const component = (type, componentId) => {
  return {
    type: type,
    components: {
      edit: componentId,
    }
  }
}

export { component }
