const { unflatten } = require('flat');

const { getAssociation } = require('../utils/many');
const { getResourceId } = require('../utils/resource');

const getFromField = (property) => (
  property?.options?.custom?.fromField
);

const getResource = (_admin, resource, property) => {
  const fromField = getFromField(property);
  if (fromField) {
    const refField = resource
      .properties()
      .find((p) => p.type() === 'reference' && p.name() === fromField);
    if (refField) {
      const resourceId = refField.reference();
      return _admin.findResource(resourceId);
    }
  }
  return resource;
};

const getRecord = (record, property) => {
  const fromField = getFromField(property);
  if (fromField) {
    return record.populated[fromField];
  }
  return record;
};

const setResponseItems = async (context, response, property) => {
  const { _admin, resource, record } = context;
  const toResourceId = getResourceId(property);
  const toResource = _admin.findResource(toResourceId);
  const options = { order: [toResource.titleField()] };
  const fromResource = getResource(_admin, resource, property);
  const association = getAssociation(context, fromResource, property);
  const fromRecord = getRecord(record, property);
  const throughItems = await fromResource.findRelated(
    fromRecord,
    association,
    options
  );
  const items = toResource.wrapObjects(throughItems);
  if (items.length !== 0) {
    const primaryKeyField = toResource.primaryKeyField();
    const propName = property.name();
    response.record.populated[propName] = items;
    response.record.params[propName] = items.map(
      (v) => v.params[primaryKeyField || 'id']
    );
  }
};

const after = async (response, request, context) => {
  if (request && request.method) {
    const manyProperties = context.resource.getManyProperties();
    if (context.action.name === 'edit' && request.method === 'get') {
      // Load all linked data
      await Promise.all(
        manyProperties.map(async (property) => {
          await setResponseItems(context, response, property);
        })
      );
    }
    const { record } = context;
    if (request.method === 'post' && record.isValid()) {
      const params = unflatten(request.payload);
      await Promise.all(
        manyProperties.map(async (property) => {
          const fromResource = getResource(
            context._admin,
            context.resource,
            property
          );
          const association = getAssociation(context, fromResource, property);
          const propName = property.name();
          const ids = params[propName]
            ? params[propName].map((v) => parseInt(v, 10))
            : [];
          const fromRecord = getRecord(response.record, property);
          if (fromRecord && ids.length !== 0) {
            await fromResource.saveRecords(fromRecord, association, ids);
          }
        })
      );
    }
  }
  return response;
};

// eslint-disable-next-line import/prefer-default-export
export { after };
