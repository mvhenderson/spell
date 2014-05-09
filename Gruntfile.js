'use strict';

module.exports = function (grunt) {
    require('load-grunt-tasks')(grunt);
    require('time-grunt')(grunt);

    grunt.initConfig({
        watch: {
            js: {
                options: { livereload: true },
                files: ['app/scripts/{,*/}*.js'],
                tasks: ['jshint']
            },
            gruntfile: {
                files: ['Gruntfile.js']
            },
            livereload: {
                options: { livereload: '<%= connect.options.livereload %>' },
                files: [
                    'app/{,*/}*.html',
                    '.tmp/styles/{,*/}*.css',
                    'app/images/{,*/}*',
                    'app/audio/{,*/)*'
                ]
            }
        },
        connect: {
            options: {
                port: 9000,
                open: true,
                livereload: 35729,
                hostname: '0.0.0.0' //0.0.0.0 for outside access
            },
            livereload: {
                options: {
                    middleware: function(connect) {
                        return [ connect.static('app') ];
                    }
                }
            },
            dist: {
                options: {
                    base: 'dist',
                    livereload: false
                }
            }
        },
        clean: {
            dist: {
                files: [{
                    dot: true,
                    src: [
                        '.tmp',
                        'dist/*',
                        '!dist/.git*'
                    ]
                }]
            },
            audio: 'app/audio/{,*/}*'
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc',
                reporter: require('jshint-stylish')
            },
            all: [
                'Gruntfile.js',
                'app/scripts/{,*/}*.js',
                '!app/scripts/vendor/*'
            ]
        },
        rev: {
            dist: {
                files: {
                    src: [
                        'dist/scripts/{,*/}*.js',
                        'dist/styles/{,*/}*.css',
                        'dist/images/{,*/}*.*'
                    ]
                }
            }
        },
        useminPrepare: {
            options: { dest: 'dist' },
            html: 'app/index.html'
        },
        usemin: {
            options: { assetsDirs: ['dist', 'dist/images'] },
            html: ['dist/{,*/}*.html'],
            css: ['dist/styles/{,*/}*.css']
        },
        htmlmin: {
            dist: {
                options: {
                    collapseBooleanAttributes: true,
                    collapseWhitespace: true,
                    removeAttributeQuotes: true,
                    removeCommentsFromCDATA: true,
                    removeEmptyAttributes: true,
                    removeOptionalTags: true,
                    removeRedundantAttributes: true,
                    useShortDoctype: true
                },
                files: [{
                    expand: true,
                    cwd: 'dist',
                    src: '{,*/}*.html',
                    dest: 'dist'
                }]
            }
        },
        copy: {
            dist: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: 'app',
                    dest: 'dist',
                    src: [
                        '*.{ico,png,txt}',
                        'images/{,*/}*.webp',
                        'styles/{,*/}*.css',
                        'audio/{,*/}*',
                        'words/*.json',
                        '{,*/}*.html',
                    ]
                }]
            },
        },
    });

    grunt.registerTask('serve', function (target) {
        if (target === 'dist') {
            return grunt.task.run(['build', 'connect:dist:keepalive']);
        }
        grunt.task.run(['connect:livereload', 'watch']);
    });

    grunt.registerTask('build', [
        'clean:dist',
        'useminPrepare',
        'concat',
        'cssmin',
        'uglify',
        'copy:dist',
        'rev',
        'usemin',
        'htmlmin'
    ]);

    grunt.registerTask('default', [
        'jshint',
        'build'
    ]);

    grunt.registerTask('audio', function (voice) {
        voice = voice || 'Alex';

        var wordlists = grunt.file.expand('app/words/*.json');
        var allwords = [];
        wordlists.forEach(function (wordlist) {
            var words = require('./'+wordlist);
            words.forEach(function (word) {
                allwords.push(word);
            });
        });
        grunt.verbose.writeln(allwords);

        var done = this.async();
        var exec = require('child_process').exec;
        var async = require('async');

        async.each(
            allwords,
            function(word, callback) {
                var file = 'app/audio/'+word.replace(/['"\s]/g,'_');
                var cmd = 'say' +
                    ' -v '+voice +
                    ' -o '+file+'.wav' +
                    ' --data-format=LEI16@12000' +
                    ' "'+word+'"';
                var say = exec(cmd, function (error) {
                    if (error) callback(error);
                });
                say.on('exit', function (code) {
                    grunt.verbose.writeln(word + ' exit code: '+code);
                    callback();
                });
            },
            function (err) {
                if (err) done(err);
                grunt.log.ok('All audio files generated');
                done();
            }
        );
    });
};
