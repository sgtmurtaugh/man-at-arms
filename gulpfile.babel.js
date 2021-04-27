'use strict';

import gulp     from 'gulp';
import plugins  from 'gulp-load-plugins';
import fs       from 'fs';
import path     from 'path';
//import mkdirp   from 'make-dir';
//import yargs    from 'yargs';
// TODO: YAML wieder aktivieren, da die YAML config self references und nested values verwenden kann
// import yaml     from 'js-yaml';
import nsg      from 'node-sprite-generator';
//import promise  from 'es6-promise';
//import panini   from 'panini';
import sherpa   from 'style-sherpa';
import typechecks from '@sgtmurtaugh/typechecks';
//import glob     from 'glob';
// import parcel     from 'parcel-bundler';
// import svgSpritesheet from '@mariusgundersen/gulp-svg-spritesheet';

// Load all Gulp plugins into one variable
const $ = plugins();

// Load settings from settings.yml
// const { COMPATIBILITY, PORT, UNCSS_OPTIONS, PATHS } = loadConfig();
const config = loadConfig();



/* ==================================================================================================================
 *  # Functions
 * ================================================================================================================== */

/* ------------------------------
 *  ## Helper Functions
 * ------------------------------ */

/**
 * Load the JSON Config
 */
function loadConfig() {
    // let ymlFile = fs.readFileSync('config.yml', 'utf8');
    // return yaml.load(ymlFile);

    let configFile = fs.readFileSync('config.json', 'utf-8');
    return JSON.parse(configFile);
}


/* ------------------------------
 *  ## Build Functions
 * ------------------------------ */


/* ------------------------------
 *  ## Image Scaler Functions
 * ------------------------------ */


/* ------------------------------
 *  ## JavaScript Functions
 * ------------------------------ */


/* ------------------------------
 *  ## Pages Functions
 * ------------------------------ */

/**
 * Copy page templates into finished HTML files
 * @returns {*}
 */
function generatePages() {
    return gulp.src('src/pages/**/*.{html,hbs,handlebars}')
        .pipe(panini({
            root: 'src/pages/',
            layouts: 'src/layouts/',
            partials: 'src/partials/',
            data: 'src/data/',
            helpers: 'src/helpers/'
        }))
        .pipe(gulp.dest(config.paths.dist.path));
}

/**
 * resetPages
 * @param done
 * Load updated HTML templates and partials into Panini
 */
function resetPages(done) {
    panini.refresh();
    done();
}


/* ------------------------------
 *  ## SASS Functions
 * ------------------------------ */


/* ------------------------------
 *  ## Sprite Functions
 * ------------------------------ */


/* ------------------------------
 *  ## Styleguide Functions
 * ------------------------------ */


/* ------------------------------
 *  ## SVG Sprite Functions
 * ------------------------------ */

/**
 * TODO
 * parcelWatch
 */
function parcelWatch() {
    return _parcel({
        outDir: 'dist2',
        publicURL: './',
        watch: true,
        _production: false,
        minify: false
    });
}

function parcelBuild() {
    return _parcel({
        outDir: 'dist2',
        publicURL: './',
        watch: false,
        _production: true,
        minify: true
    });
}

function _parcel(options, gOptions = { source: ''}) {
    return gulp.src('src/pages/**/*.html', {
        read: false
    })
    .pipe($.parcel(options, gOptions))
    .pipe(gulp.dest('dist2'));
}


/* ==================================================================================================================
 *  # Tasks
 * ================================================================================================================== */


/**
 * Task: generate-pages
 * runs: generatePages function
 */
gulp.task('generate-pages', generatePages );

/**
 * Task: generate-svg-sprite
 * runs: generateSvgSprite function
 */
gulp.task('parcel-watch', parcelWatch );


/**
 * Task: generate-svg-sprite
 * runs: generateSvgSprite function
 */
gulp.task('parcel-build', parcelBuild );


/**
 * Task: default
 * runs: built task task
 */
gulp.task('default',
     gulp.series(
//         'generate-pages',
         'parcel-watch'
     )
);
