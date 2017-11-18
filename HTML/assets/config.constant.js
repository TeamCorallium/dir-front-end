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
        //Controllers
        'userProfileCtrl': 'assets/js/controllers/userProfileCtrl.js',
        'editUserProfileCtrl': 'assets/js/controllers/editUserProfileCtrl.js',
        'viewProfileCtrl': 'assets/js/controllers/viewProfileCtrl.js',
        'viewTshirtCtrl': 'assets/js/controllers/viewTshirtCtrl.js',
        'homeCtrl': 'assets/js/controllers/homeCtrl.js',
        'exploreUsersCtrl': 'assets/js/controllers/exploreUsersCtrl.js',
        'inboxCtrl': 'assets/js/controllers/inboxCtrl.js',
        'contactUsCtrl': 'assets/js/controllers/contactUsCtrl.js',
        'faqCtrl': 'assets/js/controllers/faqCtrl.js',
        'adminViewCtrl': 'assets/js/controllers/adminViewCtrl.js',
        'notificationsCtrl': 'assets/js/controllers/notificationsCtrl.js',
        'configurationCtrl': 'assets/js/controllers/configurationCtrl.js'
    },
    modules: [{}]
});