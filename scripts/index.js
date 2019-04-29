/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


// Above-mentioned will work or use this simple form
require.config({
    packages: [
        {
            name: 'crypto-js',
            location: '../Model/Lib/crypto-js-master/crypto-js',
            main: 'index'
        }
    ]
});

require(["crypto-js/aes", "crypto-js/sha256"], function (AES, SHA256) {
    console.log(SHA256("Message"));
});
require.config({
    paths: {
        'crypto-js': '../Model/Lib/crypto-js-master/crypto-js'
    }
});

require(["crypto-js"], function (CryptoJS) {
    console.log(CryptoJS.HmacSHA1("Message", "Key"));
});


function indexmodel() {
    var CryptoJS = require("crypto-js");
    console.log(CryptoJS.SHA256("BlakeD and the HULK"));
    this.firstName = ko.observable("Dr.");
    this.lastName = ko.observable("Banner");
    this.title = ko.observable("Marvel Movies");
    this.HULK = "View/View1/img/HulkComicPage.png";
    this.w = "646";
    this.h = "966";
    this.userName = ko.observable("Username");
    this.passWord = ko.observable("Password");
    
    this.userPass = ko.computed(function() {
        return CryptoJS.SHA256(this.userName() + " " + this.passWord());    
    }, this);
    this.fullName = ko.computed(function() {
        return this.firstName() + " " + this.lastName();    
    }, this);
    
}



// Activates knockout.js
ko.applyBindings(new indexmodel(), document.getElementById("htmlTop"));