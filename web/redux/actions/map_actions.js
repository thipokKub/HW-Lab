import * as types from '../types';
import { store } from '../store';

/**
 * Name: requestMapId
 * @param {*} fieldName 
 * @param {*} id 
 * @param {*} promiseFunc 
 *      - promiseFunc is function that return a promise.
 * Note that this should already stripped data out into its pure format. For example when
 * using axios(...) should be something like axios(...).then((data) => data.data). Also when
 * error, it should be an object (not some 'String' message).
 */

export function requestMapId(fieldName, id, promiseFunc) {
    return (dispatch) => {
        const isExist = store.getState().map[fieldName] && store.getState().map[fieldName][id]
        if(!isExist) {
            dispatch({
                type: types.MAP_INIT_ID,
                payload: {
                    fieldName: fieldName,
                    id: id
                }
            });

            if(typeof promiseFunc === "function") {
                promiseFunc().then((data) => {
                    dispatch({
                        type: types.MAP_UPDATE_ID,
                        payload: {
                            fieldName: fieldName,
                            id: id,
                            data: data
                        }
                    })
                }).catch((e) => {
                    dispatch({
                        type: types.MAP_ERROR_ID,
                        payload: {
                            fieldName: fieldName,
                            id: id,
                            data: e
                        }
                    })
                });
            }
        }
    }
}

export function initMapId(fieldName, id) {
    return ({
        type: types.MAP_INIT_ID,
        payload: {
            fieldName: fieldName,
            id: id
        }
    });
}

export function updateMapId(fieldName, id, data) {
    return ({
        type: types.MAP_UPDATE_ID,
        payload: {
            fieldName: fieldName,
            id: id,
            data: data
        }
    });
}

export function replaceMapId(fieldName, id, data) {
    if (typeof data === "function") {
        return (dispatch) => {
            data().then((d) => {
                dispatch({
                    type: types.MAP_REPLACE_ID,
                    payload: {
                        fieldName: fieldName,
                        id: id,
                        data: d
                    }
                })
            }).catch((e) => {
                dispatch({
                    type: types.MAP_ERROR_ID,
                    payload: {
                        fieldName: fieldName,
                        id: id,
                        data: e
                    }
                })
            });
        }
    }
    return ({
        type: types.MAP_REPLACE_ID,
        payload: {
            fieldName: fieldName,
            id: id,
            data: data
        }
    });
}

export function errorMapId(fieldName, id, error) {
    return ({
        type: types.MAP_ERROR_ID,
        payload: {
            fieldName: fieldName,
            id: id,
            data: error
        }
    });
}