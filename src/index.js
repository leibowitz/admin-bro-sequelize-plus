const { buildFeature } = require('admin-bro')
const { Resource } = require('./adapter')

const { after: manyToManyAfterHook } = require('./actions/many-to-many-hook')
const { after: selectAfterHook } = require('./actions/select-hook')
const { after: inlineAfterHook } = require('./actions/inline-hook')
const { after: linkedAfterHook } = require('./actions/linked-hook')
const { before: oneBeforeHook, after: oneAfterHook } = require('./actions/one-hook')
const { before: chainBefore, after: chainAfter, chainActions } = require('./utils/chain')
const { component, getComponent } = require('./utils/component')

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

const linkedActionHooks = {
  new: {
    after: linkedAfterHook,
  },
  edit: {
    after: linkedAfterHook,
  }
}

const manyToManyFeature = buildFeature(getComponent('many', manyToManyActionHooks))
const oneFeature = buildFeature(getComponent('one', oneActionHooks))
const linkedFeature = buildFeature(getComponent('linked', linkedActionHooks))
const selectFeature = buildFeature(getComponent('select', selectActionHooks))
const inlineFeature = buildFeature(getComponent('inline', inlineActionHooks))

export {
  Resource,
  manyToManyActionHooks,
  selectActionHooks,
  inlineActionHooks,
  oneActionHooks,
  linkedActionHooks,
  chainBefore,
  chainAfter,
  chainActions,
  component,
  getComponent,
  manyToManyFeature,
  oneFeature,
  linkedFeature,
  selectFeature,
  inlineFeature
}
