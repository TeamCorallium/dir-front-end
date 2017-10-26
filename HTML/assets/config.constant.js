/**
 * Created by Ale on 9/7/2017.
 */
'use strict';

app.constant('APP_MEDIAQUERY', {
    'desktopXL': 1200,
    'desktop': 992,
    'tablet': 768,
    'mobile': 480
});
app.constant('JS_REQUIRED', {
    scripts: {
        // JQuery Plugins
        'sweet-alert': ['../bower_components/sweetalert/lib/sweet-alert.min.js', '../bower_components/sweetalert/lib/sweet-alert.css'],
        //Controllers
        'userProfileCtrl': 'assets/js/controllers/userProfileCtrl.js',
        'editUserProfileCtrl': 'assets/js/controllers/editUserProfileCtrl.js',
        'viewProfileCtrl': 'assets/js/controllers/viewProfileCtrl.js',
        'homeCtrl': 'assets/js/controllers/homeCtrl.js',
        'exploreUsersCtrl': 'assets/js/controllers/exploreUsersCtrl.js',
        'inboxCtrl': 'assets/js/controllers/inboxCtrl.js',
        'contactUsCtrl': 'assets/js/controllers/contactUsCtrl.js',
        'faqCtrl': 'assets/js/controllers/faqCtrl.js'
    },
    modules: [{
    }]
});