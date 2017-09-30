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
app.constant('JS_REQUIRED',{
    scripts: {
        //Controllers
        'userProfileCtrl': 'assets/js/controllers/userProfileCtrl.js',
        'editUserProfileCtrl': 'assets/js/controllers/editUserProfileCtrl.js',
        'viewProfileCtrl': 'assets/js/controllers/viewProfileCtrl.js',
        'imageDownloadCtrl': 'assets/js/controllers/imageDownloadCtrl.js'
    },
    modules:[{

    }]
});