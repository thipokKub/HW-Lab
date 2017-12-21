import { createStore, applyMiddleware } from 'redux';
import logger from 'redux-logger';
import thunk from 'redux-thunk';

import { isDebug } from '../constraint/variables';
import rootReducer from './reducers/index';

const middlewares = [thunk, isDebug && logger].filter(Boolean);
const createStoreWithMiddleware = applyMiddleware(...middlewares)(createStore);
export const store = createStoreWithMiddleware(rootReducer);

export default function iniitStore() {
    return store;
}