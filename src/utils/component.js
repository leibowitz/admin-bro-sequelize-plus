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
  const componentId = AdminBro.bundle(require.resolve(`admin-bro-sequelize-plus/src/components/${type}.edit.jsx`))
  return component(type, componentId, actions)
}

export { component, getComponent }
