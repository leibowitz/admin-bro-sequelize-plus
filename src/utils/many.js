const { isAlias, getResourceId } = require('./resource')

const getAssociation = (context, resource, property) => {
  const toResourceId = getResourceId(property)
  const toResource = context._admin.findResource(toResourceId)
  const resourceId = toResource.id()
  if (isAlias(property)) {
    const associations = resource.associationFor(resourceId)
    return associations[property.name()] ? associations[property.name()] : associations[resourceId]
  }
  const associations = resource.getAssociationsByResourceId(resourceId)
  return associations[0]
}

module.exports = { getAssociation }
