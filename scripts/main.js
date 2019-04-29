/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}
        require.config({
        packages: [
            {
                name: 'crypto-js',
                location: '../bower_components/crypto-js',
                main: 'index'
            }
        ]
    });


    require.config({
        paths: {
            'crypto-js': '../bower_components/crypto-js'
        }
    });
function TaskListViewModel() {
       // Data
            var self = this;
            self.index = new indexmodel();
            self.password = new PasswordModel();
            self.tasks = ko.observableArray([]);
            self.logins = ko.observableArray([]);
            self.newTaskText = ko.observable();
            self.taskSubject = ko.observable("Enter Task Subject");
            self.taskContent = ko.observable("Enter Task Content")
            self.currentUserText = self.password.userName;
            self.currentPasswordText = self.password.password;
            self.incompleteTasks = ko.computed(function () {
                return ko.utils.arrayFilter(self.tasks(), function (task) {
                    return !task.isDone()
                });
            });

            // Operations
            self.addTask = function () {
                self.tasks.push(new Task({title: this.newTaskText(), isDone: false}));
                self.newTaskText("");
            };
            
            self.addLogin = function() {
                self.logins.push(new LoginModel({title: this.password.hash(), isDone: false}) );
                self.currentUserText("");
                self.currentPasswordText("");
                
            };
            
            self.removeTask = function (task) {
                // self.tasks.remove(task)      // the KO tutorial uses this line but we actually
                self.tasks.destroy(task);      // need KO to flag the task with the _destroy property
                                                // so we can tell django which tasks to delete
            };

            // ajax request to perform Read operation on our data
            $.getJSON("{% url 'ajax_knockout_tasks' %}", function (allData) {
                var mappedTasks = $.map(allData, function (item) {
                    return new Task(item);
                });
                self.tasks(mappedTasks);
            });
            
            // ajax request to perform Read operation on our data
            $.getJSON("{% url 'ajax_knockout_logins' %}", function (allData) {
                var mappedLogins = $.map(allData, function (item) {
                    return new Login(item);
                });
                self.logins(mappedLogins);
            });

            // ajax request to perform CUD operations on our data
            self.save = function () {
                $.ajax("{% url 'ajax_knockout_tasks' %}", {
                    data: ko.toJSON(self.tasks),
                    type: "POST", contentType: "application/json",  // Always make sure to specify POST
                                                                    // to avoid security holes
                    success: function (result) {
                        alert(result);
                    }
                });
            };
            
            
}

var randomString = function (length, nonAlpha) {
	var text = "";
	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

	if (nonAlpha) {
		possible += '_+-!@#$%^*()/*`~={}|\][;:,./?';
	}

	for (var i = 0; i < length; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}

	return text;
};

var PasswordModel = function () {

	var _this = this;
	this.userName = ko.observable('');
	this.password = ko.observable('');
	this.roles = ko.observable('');

	this.salt = ko.computed(function () {
		//generate new salt on password/username update
		var u = _this.userName();
		var p = _this.password();
		return randomString(24, true);
	});

	this.hash = ko.computed(function () {
		var h = _this.salt() + _this.password();
		return CryptoJS.SHA256(h);
	});

	//generate a new alpha-numeric password
	this.generateNewPassword = function () {
		var password = randomString(16, false);
		_this.password(password);
	};

	this.generateNewPassword();
};

var LoginModel = function (username, password, salt, parentModel){
    var _this = this;
    this.passwordModel = new PasswordModel();
    this.salt = ko.observable(salt);
    this.userNameHash = ko.observable('');

    this.credHash = ko.computed(function () {
		var h = _this.salt() + username + password;
		return CryptoJS.SHA256(h);
	});
    this.userNameHash = ko.computed(function () {
		var h = username;
		return CryptoJS.SHA256(h);
	});

};

var DashboardViewModel = function(){
    var self = this;
    self.uId =  ko.observable();
};

function topMenu(){
    var _that = indexmodel();
    var _this = this;
    _this.isSetup = ko.observable("").subscribeTo("thisis");
    _this.HiddenCode = ko.observable("").subscribeTo(Tasklist.index.newHtml);
    _this.computedAbout = {
        details: ko.observable("<a href=" + '"' + "View/View0/view0.html" + '"' + ">About</a>") // Initially blank
    };

    
    _this.newHtml = ko.computed( function() {
        if(loginEnable){
            return _this.computedAbout.details();
        }
        else{
            return ko.observable("<p>This is not the button your looking for</p>");
        }
    }, );
    _this.HULK = "./View/View1/img/HulkComicPage.png";
    _this.w = "646";
    _this.h = "966";
   
}

function indexmodel() {

    var _this = this;
    this.passwordmodel = new PasswordModel();
    //this.login = new LoginModel();
    this.firstName = ko.observable("Dr.");
    this.lastName = ko.observable("Banner");
    this.title = ko.observable("Marvel Movies");
    this.HULK = "./View/View1/img/HulkComicPage.png";
    this.w = "646";
    this.h = "966";
    this.userName = ko.observable("Mr.Green");
    this.passWord = ko.observable("");
    this.signuserName = ko.observable('Mr.Green');
    this.signpassWord = ko.observable('');
    this.passwordmodel.password = this.passWord;
    this.passwordmodel.userName = this.userName;
    this.userPass= ko.computed( function() {
        return CryptoJS.SHA256(_this.userName() + _this.passWord()).toString();
    }, );

    this.signuserPass = ko.computed( function() {
        return CryptoJS.SHA256(_this.signuserName() + _this.signpassWord()).toString();
    }, );
    this.login = new LoginModel(this.userName, this.passWord, randomString(32, true), _this  );

    var jsonData = ko.toJSON(this.login);
    this.buttonEnabled = ko.computed(function() {
    return ((_this.userName() !== "") && (_this.passWord() !== ""));
}, );
   this.Enabled = ko.observable(_this.buttonEnabled);

    this.signbuttonEnabled = ko.computed(function() {
        return(_this.signuserName() !== "") && (_this.signpassWord() !== "");
    }, );
    //this.isSetup = ko.observable(false).publishOn("buttonEnabled");
    this.dashboardViewModel = new DashboardViewModel(self);

this.getHtml = function(param1, param2, callback) {
        $.ajax(
            {
                type: "POST",
                url: "./",
                data: {
                        html: "<a href=" + '"' + "View/View0/view0.html" + '"' + ">About</a>",
                        delay: 1
                    },
                success: callback,
                dataType: "text"
            });

    };
this.computedAbout = {
        details: ko.observable("<a href=" + '"' + "View/View0/view0.html" + '"' + ">About</a>") // Initially blank
    };


 this.newHtml =ko.computed( function() {
            return _this.computedAbout.details();
    }, );

};

ko.components.register('like-widget', {
    viewModel: function(params) {
        this.checkthis = ko.observable();
        this.checkthis.subscribeTo(Tasklist.index.newHtml);
        this.buttonboolean = ko.observable();
        this.buttonboolean.subscribeTo(Tasklist.index.buttonEnabled);
        this.HOT_TAMALE = params.value;
        this.JediTraining = ko.observable(true);
        this.htaml = function() { this.HOT_TAMALE(); }.bind(this);
        this.valuea = ko.observable("value is false");
    },
    template: 
            '<div  data-bind="visible: HOT_TAMALE(), hmtl: htaml">\
            <p>This is not the button your looking for</p> \
        </div>   \
        <div  data-bind="visible: !HOT_TAMALE()">\
             <strong data-bind="text: valuea "></strong> \
        </div>'
}, );

ko.components.register('login-widget', {
    viewModel: function(params) {
        this.HULK = "./View/View1/img/HulkComicPage.png";
        this.HOT_TAMALE = params.value;
        this.JediTraining = params.value;
        this.htaml = function() { this.HOT_TAMALE(); }.bind(this);
        this.valuea = ko.observable("Please Type Credentials to View");
    },
    template: 
            '<div  data-bind="visible: HOT_TAMALE(), hmtl: htaml">\
            <a href ="View/View1/view1.html"><img width="50px" height="50px" data-bind="attr : {src: HULK}" /></a> \
        </div>   \
        <div  data-bind="visible: !HOT_TAMALE()">\
             <strong data-bind="text: valuea "></strong> \
        </div>'
}, );

function NavigationService(){
    var self = this;
    self.navigateTo = function(pageId){
        $.mobile.changePage(pageId);
    };
}

ko.bindingHandlers.fileUpload = {
    init: function (element, valueAccessor) {
        $(element).change(function () {
            valueAccessor()(element.files[0]);
        });
    },
    update: function (element, valueAccessor) {
        if (ko.unwrap(valueAccessor()) === null) {
            $(element).wrap('<form>').closest('form').get(0).reset();
            $(element).unwrap();
        }
    }
};

var csrftoken = Cookies.get('csrftoken');
        function csrfSafeMethod(method) {
            // these HTTP methods do not require CSRF protection
            return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
        }
        $.ajaxSetup({
            beforeSend: function (xhr, settings) {
                if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                    xhr.setRequestHeader("X-CSRFToken", csrftoken);
                }
            }
});

ko.bindingHandlers.asyncHtml = {
    init: function(element, valueAccessor) {
        var value = ko.utils.unwrapObservable(valueAccessor());
        var parameters = value.params.concat([function(data) {
           $(element).html(data);
        }]);
        value.source.apply(null, parameters);
    }
};

ko.bindingHandlers.gammaGenerator = {
    init: function(element, valueAccessor, allBindings, viewModel, bindingContext){
        //var value = ko.utils.unwrapObservable(valueAccessor());
        var isSetup = ko.observable(false).subscribeTo("buttonEnabler");
        var value = ko.utils.unwrapObservable(valueAccessor());
        // var parameters = value.params.concat([function(data){
        //        $(element).html(data);
        // }]);
        if(viewModel.isSetup()){
            value.source.apply(null, value);
            };
        },
    update: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
        // This will be called once when the binding is first applied to an element,
        // and again whenever any observables/computeds that are accessed change
        var isSetup = ko.observable(false).subscribeTo("thisis");
        var value = ko.utils.unwrapObservable(valueAccessor());
        // var parameters = value.params.concat([function(data){
        //        $(element).html(data);
        // }]);
        if(viewModel.isSetup()){
            value.source.apply(null, value);
            };
        
    }
};
var navigationService = new NavigationService();
// Activates knockout.js
var Tasklist = new TaskListViewModel();
var TopMenu = new topMenu();
ko.applyBindings(TopMenu, document.getElementById("TopMenuBar"));
ko.applyBindings(Tasklist, document.getElementById("htmlLogin"));
ko.applyBindings(Tasklist, document.getElementById("htmlSignup"));
 
var somevalue = Tasklist.index.buttonEnabled.publishOn("thisis");
var loginEnable = Tasklist.index.buttonEnabled.subscribeTo("thisis");
var detailsHtml = Tasklist.index.newHtml.publishOn(Tasklist.index.newHtml);

