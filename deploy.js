'use strict';

var request = require('request');
var jsyaml = require('js-yaml');

var BASE_URL = 'http://ngolikov0l:1234/';
var DEPLOYER_API = BASE_URL + 'env/%s/app/%s';
var ENVIRONMENTS_API = BASE_URL + 'env';

var REQUEST_OPTS = { method: '', url: '', headers: { 'Content-Type': 'application/json' }};

var supported_actions = ['create', 'delete'];

var argv = process.argv,
    action = argv[2],
    _appid = argv[3],
    _envid = argv[4];

if (!action || !_appid || !_envid) {
  console.error(getUsageInfo());
  process.exit(1);
} else {
  deploy(action, _appid, _envid);
}

function deploy(action, appid, envid) {    
  // validate action 
  action = action && action.toLowerCase ? action.toLowerCase() : action;    
  if (supported_actions.indexOf(action) === -1) {
    console.error('invalid action specified. valid actions are [' + supported_actions + ']. exiting..');
    console.error(getUsageInfo());
    process.exit(1);
  }
  // validate environement
  request({ url: ENVIRONMENTS_API, method: 'GET' }, function(err, resp, body) {
    if (err) {
      console.error('unknown error fetching environments: ' + err);
      process.exit(1);
    }
    var json_body = JSON.parse(body);
    var environments = json_body.environments;
    if (!environments || environments.length < 1) {
      console.error('no environments returned by deployer. exiting..');
      process.exit(1);
    }
    if (environments.indexOf(envid) === -1) {
      console.error('invalid environment specified [' + envid + ']. valid environments are [' + environments + ']. exiting..');
      process.exit(1);
    }
    console.log('executing [%s] : [%s]', action, appid);      
    var request_opts = REQUEST_OPTS;
    request_opts.url = parse(DEPLOYER_API, envid, appid);
    request_opts.method = action === 'create' ? 'POST' : 'DELETE';
    request(request_opts, function(err, resp, body) {
      if (err) { 
        console.error('err [%s] app: ' + err1, action);               
        process.exit(1);
      }
      //debugger;
      var json_body = JSON.parse(body);
      var exitCode = (json_body.success === true) ? 0 : 1;
      console.log('existing with exit code ' + exitCode);
      process.exit(exitCode);
    });
  });               
}  

function getUsageInfo() {
  return 'usage: ./node deploy.js <create|delete> <appid> <envid>';
}

/**
 *  utility function to replace %s in a string with provided values
 */
function parse(str) {
  var args = [].slice.call(arguments, 1), i = 0;
  return str.replace(/%s/g, function() {
      return args[i++];
  });
}