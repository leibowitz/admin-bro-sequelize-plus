const after = (handlers) => async (rsp, request, context) => {
  const result = handlers.reduce(async (previousPromise, handler) => {
    const response = await previousPromise
    return handler.apply(null, [response, request, context]);
  }, Promise.resolve(rsp));
  return result
}

const before = (handlers) => async (req, context) => {
  const result = handlers.reduce(async (previousPromise, handler) => {
    const request = await previousPromise
    return handler.apply(null, [request, context]);
  }, Promise.resolve(req));
  return result
}

const chainActions = (...actions) => {
  const newBeforeActions = actions.filter(o => o.new?.before).map(o => o.new.before)
  const newAfterActions = actions.filter(o => o.new?.after).map(o => o.new.after)
  const editBeforeActions = actions.filter(o => o.edit?.before).map(o => o.edit.before)
  const editAfterActions = actions.filter(o => o.edit?.after).map(o => o.edit.after)
  return {
    new: {
      after: after(newAfterActions),
      before: before(newBeforeActions)
    },
    edit: {
      after: after(newAfterActions),
      before: before(editBeforeActions)
    }
  }
}

module.exports = { after, before, chainActions }
