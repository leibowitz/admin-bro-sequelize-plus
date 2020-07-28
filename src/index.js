const AdminBro = require('admin-bro')

const { Resource } = require('./adapter')

const { after: manyToManyAfterHook } = require('./actions/many-to-many-hook')
const { after: selectAfterHook } = require('./actions/select-hook')
const { after: inlineAfterHook } = require('./actions/inline-hook')
const { before: oneBeforeHook, after: oneAfterHook } = require('./actions/one-hook')
const { before: chainBefore, after: chainAfter, chainActions } = require('./utils/chain')

const manyToManyComponent = {
  type: 'many',
  components: {
    edit: AdminBro.bundle('./components/manytomany.edit.jsx'),
  }
}

const inlineComponent = {
  type: 'inline',
  components: {
    edit: AdminBro.bundle('./components/inline.edit.jsx'),
  }
}

const oneComponent = {
  type: 'one',
  components: {
    edit: AdminBro.bundle('./components/one.edit.jsx'),
  }
}

const manyToManyActionHooks = {
  new: {
    after: manyToManyAfterHook,
  },
  edit: {
    after: manyToManyAfterHook,
  }
}

const selectActionHooks = {
  new: {
    after: selectAfterHook,
  },
  edit: {
    after: selectAfterHook,
  }
}

const inlineActionHooks = {
  new: {
    after: inlineAfterHook,
  },
  edit: {
    after: inlineAfterHook,
  }
}

const oneActionHooks = {
  new: {
    before: oneBeforeHook,
    after: oneAfterHook,
  },
  edit: {
    before: oneBeforeHook,
    after: oneAfterHook,
  }
}

export {
  Resource,
  manyToManyComponent,
  inlineComponent,
  oneComponent,
  manyToManyActionHooks,
  selectActionHooks,
  inlineActionHooks,
  oneActionHooks,
  chainBefore,
  chainAfter,
  chainActions
}
