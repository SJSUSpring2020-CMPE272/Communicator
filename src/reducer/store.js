import thunk from 'redux-thunk';
import {createStore,applyMiddleware} from 'redux';

import Reducer from './combineReducer';

let middleWares=[thunk];

const store=createStore(Reducer,applyMiddleware(...middleWares));

export default store;