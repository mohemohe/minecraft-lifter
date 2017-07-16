module.exports = function(grunt) {
  grunt.registerTask('copyRiotAssets', [
    'concat:riot',
    'copy:riot'
  ]);
};