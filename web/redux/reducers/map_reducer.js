import * as types from '../types';

const initialState = {}

/**
 * Action format
 * {
 *      type: <type of action>,
 *      payload: {
 *          data: <responses, if exist>,
 *          fieldName: <fieldName>,
 *          id: <ID map>
 *      }
 * }
 */

export default (state = initialState, action) => {
    if(action.payload && 
        typeof action.payload.fieldName === "string" &&
        typeof action.payload.id === "string"
    ) {
        const { fieldName, id } = action.payload;
        const isFieldExist = state[fieldName] && typeof state[fieldName] === "object";
        const isIdExist = (isFieldExist) && typeof state[fieldName][id] === "object";
        const oldIdState = isIdExist ? { ...state[fieldName][id] } : {};
        let new_state = { ...state };
        
        switch(action.type) {
            case types.MAP_INIT_ID:
                if(!isFieldExist) new_state[fieldName] = {};
                new_state[fieldName][id] = {
                    isLoaded: false,
                    isError: false,
                    error: undefined
                }
                break;
            case types.MAP_UPDATE_ID:
                if (!isFieldExist) new_state[fieldName] = {};
                new_state[fieldName][id] = {
                    ...oldIdState,
                    isLoaded: true,
                    isError: false,
                    ...action.payload.data
                }
                break;
            case types.MAP_REPLACE_ID:
                if (!isFieldExist) new_state[fieldName] = {};
                new_state[fieldName][id] = {
                    isLoaded: true,
                    isError: false,
                    ...action.payload.data
                }
                break;
            case types.MAP_ERROR_ID:
                if (!isFieldExist) new_state[fieldName] = {};
                new_state[fieldName][id] = {
                    ...oldIdState,
                    isLoaded: true,
                    isError: true,
                    error: {
                        ...action.payload.data
                    }
                }
                break;
            default:
                break;
        }
        return {
            ...new_state
        }
    }

    return {
        ...state
    }
}