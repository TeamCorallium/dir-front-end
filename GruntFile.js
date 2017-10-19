2
module.exports = function(grunt) {
	var gtx = require('gruntfile-gtx').wrap(grunt);

    gtx.loadAuto();

    var gruntConfig = require('./grunt');
    gruntConfig.package = require('./package.json');

    gtx.config(gruntConfig);

    // We need our bower components in order to develop
    gtx.alias('build:frontend', ['compass:frontend', 'clean:frontend', 'copy:frontend', 'concat:frontend', 'cssmin:frontend', 'uglify:frontend']);




    gtx.finalise();
};
