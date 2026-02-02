import { DELETE_MODULES, GET_MODULES, LOGOUT } from './constant'

const initialState = {
    isAuthenticated: true,
    userId: null,
    isLogin: false,
    userName: null,
    roleInfo: null
}


export const modulesData = (data = initialState, action) => {
    switch (action.type) {
        case GET_MODULES:
            return { ...data, userId: action.data.userId, isLogin: true, userName: action.data.userName, roleInfo: action.data.roleInfo, isAuthenticated: true }
        case DELETE_MODULES:
            return { ...data, userId: null, isLogin: false, userName: null , roleInfo: null }
        case LOGOUT:
            return { ...data, userId: null, isLogin: false, userName: null, roleInfo: null, isAuthenticated: false }
        default:
            return data
    }
}


