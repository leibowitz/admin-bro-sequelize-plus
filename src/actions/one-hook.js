const { unflatten } = require('flat')

const { getAssociation } = require('../utils/many')
const { getResourceId } = require('../utils/resource')

const setResponseItem = async (context, response, property) => {
  const { _admin, resource, record } = context
  const toResourceId = getResourceId(property)
  const toResource = _admin.findResource(toResourceId)
  const association = getAssociation(context, resource, property)
  const item = await resource.findRelated(record, association)
  const linkedRecord = toResource.wrapObject(item)
  const propName = property.name()
  response.record.populated[propName] = linkedRecord
  response.record.params[propName] = linkedRecord?.params
}

const before = async (request, context) => {
  if (request && request.method && request.method === 'post') {
    const { resource, _admin } = context
    const params = unflatten(request.payload)
    const properties = resource.getOneProperties()
    const relatedResources = await Promise.all(properties.map(async (property) => {
      const toResourceId = getResourceId(property)
      const toResource = _admin.findResource(toResourceId)

      const propName = property.name()
      const item = params[propName] ? params[propName] : {}

      const toRecord = toResource.build(item)

      const newRecord = !toRecord.id()
      const savedRecord = await toRecord.save()
      if (context.action.name == 'new' && savedRecord.id()) {
        const parentField = property?.options?.custom?.field || property.name()
        request.payload[parentField] = savedRecord.id()
      }
      return {
        property: property,
        record: savedRecord
      }
    }))

    context.relatedResources = relatedResources
  }
  return request
}

const after = async (response, request, context) => {
  if (request && request.method) {
    const properties = context.resource.getOneProperties()
    if (context.action.name == 'edit' && request.method === 'get') {
      // Load all linked data
      await Promise.all(properties.map(async (property) => {
        await setResponseItem(context, response, property)
      }))
    }
    const { record, _admin, translateMessage } = context
    if (request.method === 'post' && context.relatedResources) {
      context.relatedResources.map(related => {
        const propName = related.property.name()
        if (!related.record.isValid()) {
          response.record.errors[propName] = related.record.errors
        } else {
          const toResourceId = getResourceId(related.property)
          const toResource = _admin.findResource(toResourceId)
          const parentField = related?.property?.options?.custom?.field || propName
          response.record.populated[parentField] = {params: {[toResource.primaryKeyField()]: related.record.id()}}
        }
      })

      if (Object.keys(response?.record?.errors).length !== 0 && response.redirectUrl) {
        return {
          record: response.record,
          notice: {
            message: translateMessage('thereWereValidationErrors', context.resource.id),
            type: 'error',
          }
        }
      }
    }
  }
  return response
}

export { before, after }
