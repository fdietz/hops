/**
 * @module config
 * @author Somebody <somebody@foo.bar>
 */


var fs = require('fs');
var path = require('path');

var appRoot = require('app-root-path');

/**
 * get full path from filename with an optional fallback.
 * @private
 * @param  {String} fileName - name of requested file.
 * @param  {String} fallback - if the file is not found this can 
 *                             be used as a replacement.
 * @return {String|null}     `string` if file is found or fallback is set 
 *                            otherwise `null`.
 */
function getFilePath(fileName, fallback) {
  try {
    var filePath = appRoot.resolve(fileName);
    fs.accessSync(filePath, fs.F_OK);
    return filePath;
  }
  catch (e) {
    return path.resolve(__dirname, fallback);
  }
}

/**
 * override config with new options
 * @private
 * @param  {Object} config - custom configuration
 * @param  {String} config.appRoot - path to app root (source).
 * @param  {String} config.distDir - path to distribution directory.
 * @param  {String} config.eslint - path to eslintrc and config.
 * @param  {String} config.testGlob - path to gloabal tests.
 * @param  {String} config.webpackBase - path to webpack base files.
 * @param  {String} config.webpackDev - path to webpack dev files.
 * @param  {String} config.webpackBuild - path to webpack build files.
 * @return {Object} updated configuration.
 */
function overrideConfig(config) {
  try { return Object.assign(config, appRoot.require('.hopsrc')); }
  catch (e) { return config; }
}

module.exports = overrideConfig({
  appRoot: appRoot.toString(),
  eslint: getFilePath('.eslintrc.js', '../etc/eslint.js'),
  stylelint: getFilePath('.stylelintrc.js', '../etc/stylelint.js'),
  webpackBase: getFilePath('webpack.base.js', '../etc/webpack.base.js'),
  webpackDev: getFilePath('webpack.dev.js', '../etc/webpack.dev.js'),
  webpackBuild: getFilePath('webpack.build.js', '../etc/webpack.build.js'),
  webpackNode: getFilePath('webpack.node.js', '../etc/webpack.node.js')
});
