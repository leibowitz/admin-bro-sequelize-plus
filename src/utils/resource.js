const isAlias = (property) =>
  property.options &&
  property.options.custom &&
  property.options.custom.resourceId;

const getResourceId = (property) =>
  isAlias(property) ? property.options.custom.resourceId : property.name();

const getSortField = (property) =>
  property.options && property.options.custom && property.options.custom.sortBy
    ? property.options.custom.sortBy
    : null;

export { isAlias, getResourceId, getSortField };
