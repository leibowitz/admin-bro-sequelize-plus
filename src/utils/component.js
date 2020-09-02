const AdminBro = require('admin-bro')

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

export { component, getComponent }
