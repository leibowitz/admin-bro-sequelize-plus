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
  const records = await resource.findRelated(record, association, options)
  const items = toResource.wrapObjects(records)
  if (items.length !== 0) {
    const propName = property.name()
    response.record.populated[propName] = items
    response.record.params[propName] = items.map(v => v.params)
  }
}

const after = async (response, request, context) => {
  if (request && request.method) {
    const inlineProperties = context.resource.getInlineProperties()
    if (context.action.name == 'edit' && request.method === 'get') {
      // Load all linked data
      await Promise.all(inlineProperties.map(async (property) => {
        await setResponseItems(context, response, property)
      }))
    }
    const { record, _admin, translateMessage } = context
    if (request.method === 'post' && record.isValid()) {
      const params = unflatten(request.payload)
      const inlines = await Promise.all(inlineProperties.map(async (property) => {
        const toResourceId = getResourceId(property)
        const toResource = _admin.findResource(toResourceId)

        const propName = property.name()
        const items = params[propName] ? params[propName] : []

        const references = toResource.getPropertiesOfType('edit', 'reference')
        const refProperty = references.find(p => p.property.reference() === context.resource.id())

        // Only delete linked records when they were removed from an existing record
        if (context.action.name === 'edit') {
          await toResource.deleteMissingRecords(refProperty.name(), record.id(), items.map(i => i.id))
        }

        // Set related field to main record id
        if (context.action.name === 'new') {
          items.map(item => item[refProperty.name()] = record.id())
        }

        const records = items.map(item => toResource.build(item))
        const results = await Promise.all(
          records.map(async (item) => {
            return await item.save()
          })
        )
        return {
          property: property,
          records: results
        }
      }))

      inlines.map(inline => {
        const failed = inline.records.filter(item => !item.isValid())
        const errors = failed.map(f => ({errors: f.errors, params: f.params}))
        const propName = inline.property.name()
        if (errors.length !== 0) {
          response.record.errors[propName] = errors
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
