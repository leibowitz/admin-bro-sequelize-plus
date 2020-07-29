const isAlias = (property) => {
  return property.options && property.options.custom && property.options.custom.resourceId ? true : false
}

const getResourceId = (property) => {
  return isAlias(property) ? property.options.custom.resourceId : property.name()
}

const getSortField = (property) => {
  return property.options && property.options.custom && property.options.custom.sortBy ? property.options.custom.sortBy : null
}

export { isAlias, getResourceId, getSortField }
