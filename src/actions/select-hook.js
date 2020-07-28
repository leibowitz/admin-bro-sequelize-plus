const { unflatten } = require('flat')

const { Filter } = require('admin-bro')

const { getResourceId, getSortField } = require('../utils/resource')

const setResponseItems = async (context, response, property) => {
  const { _admin, resource, record } = context

  const field = property.name()
  const value = record.params[field]

  if (!value) {
    return
  }

  const toResourceId = getResourceId(property)

  const toResource = _admin.findResource(toResourceId)
  const sortBy = getSortField(property) || toResource.sortField()

  const filters = {[property.options.custom.targetField]: value}
  const filter = new Filter(filters, toResource)
  const items = await toResource.find(filter, {sort: {sortBy: sortBy}})

  if (items.length !== 0) {
    const primaryKeyField = toResource.primaryKeyField()
    response.record.populated[field] = items[0].toJSON()
  }
}

const after = async (response, request, context) => {
  if (request && request.method) {
    const properties = context.resource.getSelectProperties()
    if (context.action.name == 'edit' && request.method === 'get') {
      // Load all linked data
      await Promise.all(properties.map(async (property) => {
        await setResponseItems(context, response, property)
      }))
    }
  }
  return response
}

export { after }
