const { unflatten } = require('flat')

const { getAssociation } = require('../utils/many')
const { getResourceId } = require('../utils/resource')

const setResponseItems = async (context, response, property) => {
  const { _admin, resource, record } = context
  const toResourceId = getResourceId(property)
  const toResource = _admin.findResource(toResourceId)
  const association = getAssociation(context, resource, property)
  //const options = {order: [toResource.titleField()]}
  const options = {}
  const related = await resource.findRelated(record, association, options)
  const item = related ? toResource.wrapObject(related) : null
  if (item) {
    const propName = property.name()
    response.record.populated[propName] = item
    response.record.params[propName] = item.params
  }
}

const after = async (response, request, context) => {
  if (request && request.method) {
    const properties = context.resource.getLinkedProperties()
    if (context.action.name == 'edit' && request.method === 'get') {
      // Load all linked data
      await Promise.all(properties.map(async (property) => {
        await setResponseItems(context, response, property)
      }))
    }
    const { record, _admin, translateMessage } = context
    if (request.method === 'post' && record.isValid()) {
      const params = unflatten(request.payload)
      const links = await Promise.all(properties.map(async (property) => {
        const toResourceId = getResourceId(property)
        const toResource = _admin.findResource(toResourceId)

        const propName = property.name()
        const item = params[propName] ? params[propName] : {}
        item[property?.options?.custom?.field || propName] = record.id()

        const related = toResource.build(item)
        const saved = await related.save()
        return {
          property: property,
          record: saved
        }
      }))

      links.map(link => {
        const propName = link.property.name()
        if (!link.record.isValid()) {
          response.record.errors[propName] = link.record.errors
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

export { after }
