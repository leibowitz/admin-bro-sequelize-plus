const AdminBro = require('admin-bro')
const { buildFeature } = require('admin-bro')

const component = (type, componentId) => {
  return {
    type,
    components: {
      edit: componentId,
    }
  }
}

const getComponent = (type) => {
  const componentId = AdminBro.bundle(`../src/components/${type}.edit.jsx`)
  return component(type, componentId)
}

const getFeature = (type, actions = {}) => (property) => {
  return buildFeature({
    properties: {
      [property]: getComponent(type)
    },
    actions
  })
}

export { component, getComponent, getFeature }
