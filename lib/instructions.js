'use strict';

var os     =  require('os')
  , format =  require('util').format
  , colors =  require('ansicolors')
  , styles =  require('ansistyles')
  , log    =  require('./log')
  , pkg    =  require('../package')
  , config =  require('../config/current')
  , allPlugins = [ 'vim', 'matchtoken' ]
  ;

function pluginIsEnabled (x) {
  return config.plugins[x] === undefined || config.plugins[x] === true;
}

var enabledPlugins = config.plugins && typeof config.plugins === 'object'
  ? allPlugins.filter(pluginIsEnabled) 
  : allPlugins;

var specs = { cpus: Object.keys(os.cpus()).length, platform: os.platform(), host: os.hostname() }
  , v = process.versions
  , plugins = enabledPlugins.map(colors.yellow).join(' | ');

var msgs = [
    ''
  , styles.underline(colors.brightRed('replpad')) + colors.yellow(' v' + pkg.version)
  , ''
  ,   format(colors.cyan('node') + ' %s', colors.yellow('v' + v.node))
    + format(' | %s | %s cpus | %s platform', colors.green(specs.host), colors.green(specs.cpus), colors.green(specs.platform))
    +  format(colors.cyan(' | v8') + ' %s | ' + colors.cyan('uv') + ' %s', colors.yellow('v' + v.v8), colors.yellow('v' + v.uv))
  , ''
  , 'plugins: ' + plugins
  , ''
  , 'If in doubt, enter ' + colors.yellow('.help')
  , '' 
  ];


module.exports = function (output) {
  //msgs.forEach(function (msg) { log.print(msg); });
  msgs.forEach(function (msg) { output.write(msg + '\n'); });
};
