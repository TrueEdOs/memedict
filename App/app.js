"use strict";

import * as Actions from  './../../services/Actions.js'

import Index from './views/pages/Index.js'
import MyMemes from './views/pages/MyMemes.js'
import Search from './views/pages/Search.js'
import Login from './views/pages/Login.js'
import SignUp from './views/pages/SignUp.js'
import AddMeme from './views/pages/AddMeme.js'
import Error404 from './views/pages/Error404.js'
import Header from './views/components/Header.js'

const firebaseConfig = {
    apiKey: "AIzaSyDU_EgZ_R1nEnea0h9x2wEM78KhUgyucFw",
    authDomain: "czar-dictionary.firebaseapp.com",
    databaseURL: "https://czar-dictionary.firebaseio.com",
    projectId: "czar-dictionary",
    storageBucket: "czar-dictionary.appspot.com",
    messagingSenderId: "849808347860",
    appId: "1:849808347860:web:8e29b99e73059503866141"
  };


try {
    firebase.initializeApp(firebaseConfig);
}
catch (error) {
    alert(error);
}

// var ref = firebase.app().database().ref();
// var testRef = ref.child('test/');
// testRef.set({ first: 'Ada', last: 'Lovelace' })
// testRef.on('value', function(snapshot) {
//     alert(snapshot.val().first)
// })

const routes = {
    '/': Index,
    '/login': Login,
    '/sign-up': SignUp,
    '/new': AddMeme,
    '/my': MyMemes,
    '/search/:id': Search
}

const router = async () => {
    const header = document.getElementById('header_container');
    const content = document.getElementById('page_container');
    header.innerHTML = await Header.render();
    await Header.after_render();
    let request = Actions.parseRequestURL()
    let parsedURL = (request.resource ? '/' + request.resource : '/') + (request.id ? '/:id' : '') + (request.verb ? '/' + request.verb : '')
    let page = routes[parsedURL] ? routes[parsedURL] : Error404
    content.innerHTML = await page.render();
    await page.after_render();
}

window.addEventListener('hashchange', router);
window.addEventListener('load', router);

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
            console.log(user + " IS LOGGED");
        }
    else {
        console.log("NOT LOGGED");
    }
});