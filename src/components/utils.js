const findReferenceProperty = (properties, originalResourceId) => (
  properties.find(
    (p) => p.type === 'reference' && p.reference === originalResourceId
  )
);

const filterProperties = (type, properties, originalResourceId) => (
  properties
    .filter((p) => p.type !== type)
    .filter(
      (p) => p.type !== 'reference' || p.reference !== originalResourceId
    )
);

export { filterProperties, findReferenceProperty };
