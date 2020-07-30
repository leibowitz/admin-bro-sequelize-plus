const findReferenceProperty = (properties, originalResourceId) => {
  return properties
    .find(p => p.type === 'reference' && p.reference === originalResourceId)
}

const filterProperties = (type, properties, originalResourceId) => {
  return properties
    .filter(p => p.type !== type)
    .filter(p => p.type !== 'reference' || p.reference !== originalResourceId)
}

export { filterProperties, findReferenceProperty }
