const path          = require('path');
const webpack       = require('webpack');
const TerserPlugin  = require('terser-webpack-plugin');
const package       = require('./package.json');
const buildDate     = new Date();

// --------------------------------------------------
// Webpack plugins

const plugins       = [
    new webpack.BannerPlugin(
        'angular-schema-form\n' +
        '@version ' + package.version + '\n' +
        '@date ' + buildDate.toUTCString() + '\n' +
        '@link https://github.com/json-schema-form/angular-schema-form\n' +
        '@license MIT\n' +
        'Copyright (c) 2014-' + buildDate.getFullYear() + ' JSON Schema Form'
    )
]


// --------------------------------------------------
// Entry includes

const mainEntries       = [
    path.join(__dirname, "src", "schema-form.module.js"),
    path.join(__dirname, "plugins", "validators", "tv4.validator.js")
]
const bootstrapEntries  = [
    path.join(__dirname, "src", "schema-form.module.js"),
    path.join(__dirname, "plugins", "validators", "tv4.validator.js"),
    path.join(__dirname, "plugins", "decorators", "bootstrap", "bootstrap.decorator.js")
]
const recaptchaEntries  = [
    path.join(__dirname, "plugins", "directives", "recaptcha", "sf-recaptcha.directive.js")
]


// --------------------------------------------------
// Config export

module.exports = {
    entry: {
        "angular-schema-form"               : mainEntries,
        "angular-schema-form.min"           : mainEntries,
        "angular-schema-form-bootstrap"     : bootstrapEntries,
        "angular-schema-form-bootstrap.min" : bootstrapEntries,
        "angular-schema-form-recaptcha"     : recaptchaEntries,
        "angular-schema-form-recaptcha.min" : recaptchaEntries,
    },
    output: {
        // library: 'angular-schema-form',
        filename: '[name].js',
        sourceMapFilename: '[name].map',
        path: path.resolve(__dirname, 'dist/bundles')
    },
    resolve: {
        modules: [
            "node_modules",
            path.join(__dirname, "src"),
            path.join(__dirname, "src", "directives"),
            path.join(__dirname, "src", "services"),
            path.join(__dirname, "plugins"),
        ],
        extensions: [ '.js', '.html', '.css' ]
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "eslint-loader",
                // options: {
                //     color: true
                // }
            },
            {
                test: /\.html$/,
                use: [ 
                    {
                        loader: 'ngtemplate-loader',
                        options: {
                            relativeTo: __dirname
                        }
                    }, 
                    'html-loader' 
                ],
                exclude: /(index)/
            },
            {
                test: /\.css$/,
                use:[ 'style-loader','css-loader' ]
            }
        ] 
    },
    devServer : {
        contentBase: __dirname,
        port: 9000,
        open: true,
        openPage: "editor/editor.html"
    },
    externals: {
        'angular'       : 'var angular',
        'tv4'           : 'var tv4'
    },
    optimization: {
        minimizer: [
            new TerserPlugin({
                test: /\.min\.js$/,
                sourceMap: true
            }),
        ],
    },
    plugins : plugins
};