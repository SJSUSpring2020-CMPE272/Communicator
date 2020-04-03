
const defaultState ={};


const actionTypes={
    LOGIN:'LOGIN',
    LOGOUT:'LOGOUT'
}
const authReducer = (state = defaultState, action) => {
    switch (action.type) {
        case actionTypes.LOGIN:
            return { ...action.payload };
        case actionTypes.LOGOUT:
            return {};
        default:
            return state;
    }
}

export const loginAction=(data)=>{
    return {type:actionTypes.LOGIN,payload:data};
}

export const logoutAction=(s)=>{
    return {type:actionTypes.LOGOUT};
}
export default authReducer;