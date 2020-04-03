const defaultAppState = {
  accessToken: ""
};

const actionType = {
  ACCESS_TOKEN: "ACCESS_TOKEN",
  CLEAR_ACCESS_TOKEN: "CLEAR_ACCESS_TOKEN"
};
const AppStateReducer = (state = defaultAppState, action) => {
  switch (action.type) {
    case actionType.ACCESS_TOKEN:
      return { ...state, accessToken: action.payload.access_token };
    case actionType.CLEAR_ACCESS_TOKEN:
      return { ...state, accessToken: "" };
    default:
      return state;
  }
};

export const addAccessToken = data => {
  return { type: actionType.ACCESS_TOKEN, payload: data };
};
export const clearAccessToken = () => {
  return { type: actionType.CLEAR_ACCESS_TOKEN };
};
export default AppStateReducer;
