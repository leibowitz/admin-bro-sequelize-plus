const AdminBro = require('admin-bro')

const component = (type, componentId, actions = {}) => {
  return {
    type,
    actions,
    components: {
      edit: componentId,
    }
  }
}

const getComponent = (type, actions = {}) => {
  const componentId = AdminBro.bundle(`../src/components/${type}.edit.jsx`)
  return component(type, componentId, actions)
}

export { component, getComponent }
