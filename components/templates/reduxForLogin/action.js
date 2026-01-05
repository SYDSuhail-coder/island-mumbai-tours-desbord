import { DELETE_MODULES, GET_MODULES, LOGOUT } from "./constant";

export const getModules = (data) => {
    return {
        type: GET_MODULES,
        data
    }
}

export const deleteModules = (data) => {
    return {
        type: DELETE_MODULES
    }
}

export const logout = () => {
    return {
        type: LOGOUT,
    };
};







