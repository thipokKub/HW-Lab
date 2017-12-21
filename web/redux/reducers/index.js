import { combineReducers } from 'redux';
import test_reducer from './test_reducer';
import map_reducer from './map_reducer';

const rootReducer = combineReducers({
    test: test_reducer,
    map: map_reducer
});

export default rootReducer;