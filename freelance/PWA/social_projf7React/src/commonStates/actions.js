/**
 * signIn
 * Авторизует пользователя в системе
 * Изменяет username и password <=> авторизация успешна
 */
export function signInAction({promise}) {
    return {
    type: 'promise',
    promise,
    actions: ['startSignIn', "changeUser", "failureSignIn"]
    }
}

/**
 * setToken
 * Устанавливает токен 
 * Изменяет токен <=> токен есть в системе
 */
export function setToken({promise}) {
    /*SETTOKENSTART ничего не делает*/
    return {
        type:'PROMISE',
        promise,
        actions: ["SETTOKENSTART","SETTOKENSUCCESS","SETTOKKENFAULURE"]
    }
}