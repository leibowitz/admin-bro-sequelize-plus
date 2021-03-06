const { Resource } = require('./adapter');

const { after: manyToManyAfterHook } = require('./actions/many-to-many-hook');
const { after: selectAfterHook } = require('./actions/select-hook');
const { after: inlineAfterHook } = require('./actions/inline-hook');
const { after: linkedAfterHook } = require('./actions/linked-hook');
const {
  before: oneBeforeHook,
  after: oneAfterHook
} = require('./actions/one-hook');
const {
  before: chainBefore,
  after: chainAfter,
  chainActions
} = require('./utils/chain');
const { component, getComponent, getFeature } = require('./utils/component');

const manyToManyActionHooks = {
  new: {
    after: manyToManyAfterHook
  },
  edit: {
    after: manyToManyAfterHook
  }
};

const selectActionHooks = {
  new: {
    after: selectAfterHook
  },
  edit: {
    after: selectAfterHook
  }
};

const inlineActionHooks = {
  new: {
    after: inlineAfterHook
  },
  edit: {
    after: inlineAfterHook
  }
};

const oneActionHooks = {
  new: {
    before: oneBeforeHook,
    after: oneAfterHook
  },
  edit: {
    before: oneBeforeHook,
    after: oneAfterHook
  }
};

const linkedActionHooks = {
  new: {
    after: linkedAfterHook
  },
  edit: {
    after: linkedAfterHook
  }
};

const manyToManyFeature = getFeature('many', manyToManyActionHooks);
const oneFeature = getFeature('one', oneActionHooks);
const linkedFeature = getFeature('linked', linkedActionHooks);
const selectFeature = getFeature('select', selectActionHooks);
const inlineFeature = getFeature('inline', inlineActionHooks);

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
};
