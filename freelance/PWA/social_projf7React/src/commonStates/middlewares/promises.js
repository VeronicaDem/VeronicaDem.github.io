const middleware = store => next => action => {
    try {
    if(action.type !== "PROMISE") {
        return next(action);

    }
    alert("in promise");
    const [startAction, successAction, failureAction] = action.actions;
    store.dispatch({
        type:startAction,
        payload: action.payload
    })
    action.promise.then((response) => {
        if(response.ok) {
        store.dispatch({
            type:successAction,
            payload:action.payload
        })
    }
        else {
            store.dispatch({
                type:failureAction,
                payload:action.payload
            })
        }
    }, (error)=> {
        store.dispatch({
            type:failureAction,
            payload:action.payload
        })
    })
}catch(e) {

}
}
export default middleware;