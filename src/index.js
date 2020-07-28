const { Resource } = require('./adapter')

const { after: manyToManyAfterHook } = require('./actions/many-to-many-hook')
const { after: selectAfterHook } = require('./actions/select-hook')
const { after: inlineAfterHook } = require('./actions/inline-hook')
const { before: oneBeforeHook, after: oneAfterHook } = require('./actions/one-hook')
const { before: chainBefore, after: chainAfter, chainActions } = require('./utils/chain')

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
  manyToManyActionHooks,
  selectActionHooks,
  inlineActionHooks,
  oneActionHooks,
  chainBefore,
  chainAfter,
  chainActions
}
