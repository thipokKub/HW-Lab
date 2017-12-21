/**
 * Important Note
 * use lodash as _.isEqual to compare 2 objects or arrays or anything actually :-P;
 */

import firebase from 'firebase';
import firebaseApp from '../function/firebase';

/**
 * randInt give random number in range [min, max] (inclusive, inclusive)
 */
export function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * This function will give random number between [num - ratio*num, num + ratio*num]
 */
export function randomRatio(num, ratio) {
    return random(num - ratio*num, num + ratio*num);
}

export function setCookie(params) {
    var name = params.name,
        value = params.value,
        expireDays = params.days,
        expireHours = params.hours,
        expireMinutes = params.minutes,
        expireSeconds = params.seconds;

    var expireDate = new Date();
    if (expireDays) expireDate.setDate(expireDate.getDate() + expireDays);
    if (expireHours) expireDate.setHours(expireDate.getHours() + expireHours);
    if (expireMinutes) expireDate.setMinutes(expireDate.getMinutes() + expireMinutes);
    if (expireSeconds) expireDate.setSeconds(expireDate.getSeconds() + expireSeconds);

    document.cookie = name + "=" + escape(value) +
        ";domain=" + window.location.hostname +
        ";path=/" +
        ";expires=" + expireDate.toUTCString();
}

export function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    //expire auto delete
    return "";
}

export function deleteCookie(name) {
    setCookie({ name: name, value: "", seconds: 1 });
}

export function clearAllCookie() {
    document.cookie.split(";").forEach(function (c) { document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); });
}

export function storeItem(name, value) {
    localStorage.setItem(name, value);
}

export function retrieveItem(name) {
    return localStorage.getItem(name);
}

export function deleteItem(name) {
    localStorage.removeItem(name);
}

export function clearStorage() {
    localStorage.clear();
}

const provider = new firebase.auth.FacebookAuthProvider();
provider.addScope('public_profile');

export function firebaseLogin(callback) {
    firebase.auth().signInWithPopup(provider).then(
    (result) => {
        if(typeof callback === "function") callback(result);
    })
}

export function firebaseGet(ref = '', callback) {
    firebase.database().ref(ref).once('value').then((snapshot) => {
        if (snapshot.val() !== null) {
            if (typeof callback === "function") callback(snapshot.val());
        }
    });
}

export function firebaseSet(ref = '', data) {
    firebase.database().ref(ref).set(data)
}

export function firebaseGetUID() {
    if(getCookie('uid').length !== 0) return getCookie('uid');
    return firebaseApp.auth().currentUser.uid;
}

export function firebasePush(ref, data) {
    let key = firebase.database().ref(ref).push().key;
    let updates = {};
    updates[`${ref}${key}`] = data;
    firebase.database().ref().update(updates);
}