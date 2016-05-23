var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var templateCache = require('gulp-angular-templatecache');
var del = require('del');
var Q = require('q');
var _gulpsrc = gulp.src;
gulp.src = function () {
    return _gulpsrc.apply(gulp, arguments)
        .pipe(plugins.plumber({
            errorHandler: function (err) {
                plugins.notify.onError({
                    title: "Gulp Error",
                    message: "Error: <%= error.message %>",
                    sound: "Bottle"
                })(err);
                this.emit('end');
            }
        }));
};
var config = {
    assetsDir: 'src',
    sassPattern: 'sass/**/*.scss',
    production: !!plugins.util.env.production,
    sourceMaps: !plugins.util.env.production,
    bowerDir: 'bower_components'
};
var app = {};
app.addStyle = function (paths, outputFilename, options) {
    if (options == undefined) options = {};
    return gulp.src(paths)
        .pipe(plugins.if(config.sourceMaps, plugins.sourcemaps.init()))
        .pipe(plugins.sass())
        .pipe(plugins.if(
            options.autoprefixer,
            plugins.autoprefixer({
                browsers: ['last 2 versions'],
                cascade: false
            })
        ))
        .pipe(plugins.concat('css/' + outputFilename))

        .pipe(config.production ? plugins.cssnano() : plugins.util.noop())
        .pipe(plugins.if(config.sourceMaps, plugins.sourcemaps.write('.')))
        .pipe(gulp.dest('dist'))


};
app.addScript = function (paths, outputFilename, annotate) {
    return gulp.src(paths)
        //.pipe(plugins.ngAnnotate())
        .pipe(plugins.if(config.sourceMaps, plugins.sourcemaps.init()))
        .pipe(plugins.concat('js/' + outputFilename))
        .pipe(plugins.if(config.sourceMaps, plugins.sourcemaps.write('.')))
        .pipe(gulp.dest('dist'))
};
app.addTemplate = function(paths, outputFilename){
    return gulp.src(paths)
        .pipe(templateCache())
        .pipe(gulp.dest(outputFilename));
}
app.copy = function (srcFiles, outputDir) {
    return gulp.src(srcFiles)
        .pipe(gulp.dest(outputDir));
};
var Pipeline = function () {
    this.entries = [];
};
Pipeline.prototype.add = function () {
    this.entries.push(arguments);
};
Pipeline.prototype.run = function (callable) {
    var deferred = Q.defer();
    var i = 0;
    var entries = this.entries;

    var runNextEntry = function () {
        // see if we're all done looping
        if (typeof entries[i] === 'undefined') {

            deferred.resolve();
            return;
        }

        // pass app as this, though we should avoid using "this"
        // in those functions anyways
        callable.apply(app, entries[i]).on('end', function () {
            i++;
            runNextEntry();
        });
    };
    runNextEntry();

    return deferred.promise;
};
gulp.task('scripts', function () {
    var pipeline = new Pipeline();


    /**
     * App
     *
     * */
    pipeline.add([
        './src/**/*.js',
    ], 'priceParser.js');

    return pipeline.run(app.addScript);
});
gulp.task('copy', function(){
/*    var pipeline = new Pipeline();
    pipeline.add([
        'bower_components/!**!/!*.*',
    ], 'public/vendors');

    return pipeline.run(app.copy);*/
});
gulp.task('styles', function(){
    var pipeline = new Pipeline();
    pipeline.add([
        'src/**/*.scss',
    ], 'priceParser.css');

    return pipeline.run(app.addStyle);
})
gulp.task('templates', function(){
    //del.sync('public/templates');
    var pipeline = new Pipeline();
    pipeline.add([
        'src/components/**/*.html',
    ], 'dist/templates');

    return pipeline.run(app.addTemplate);
})
gulp.task('clean', function () {
    //del.sync(config.revManifestPath);
    del.sync('dist/templates');
    del.sync('dist/css');
    del.sync('dist/js');
    //del.sync('public/vendors');
});
gulp.task('default', ['clean','scripts', 'styles', 'templates','watch']);
gulp.task('watch', function() {
    gulp.watch('src/components/**/*.html', ['templates']);
    gulp.watch('src/**/*.scss', ['styles']);
    gulp.watch('src/**/*.js', ['scripts']);
});
