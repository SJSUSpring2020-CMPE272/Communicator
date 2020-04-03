import { combineReducers } from 'redux'

import AppStateReducer from './appReducers';
import AuthReducer from './authReducer';

const data={
    auth:AuthReducer,
    app:AppStateReducer
}

const reducers=combineReducers(data);

export default reducers;