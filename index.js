const AdminBro = require('admin-bro')

const Adapter = require('./src/adapter')

const { after: manyToManyAfterHook } = require('./src/actions/many-to-many-hook')
const { after: selectAfterHook } = require('./src/actions/select-hook')
const { after: inlineAfterHook } = require('./src/actions/inline-hook')
const { before: oneBeforeHook, after: oneAfterHook } = require('./src/actions/one-hook')
const { before: chainBefore, after: chainAfter, chainActions } = require('./src/utils/chain')

const manyToManyComponent = {
  type: 'many',
  components: {
    edit: AdminBro.bundle('./src/components/manytomany.edit.jsx'),
  }
}

const inlineComponent = {
  type: 'inline',
  components: {
    edit: AdminBro.bundle('./src/components/inline.edit.jsx'),
  }
}

const oneComponent = {
  type: 'one',
  components: {
    edit: AdminBro.bundle('./src/components/one.edit.jsx'),
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

module.exports = {
  Adapter,
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
