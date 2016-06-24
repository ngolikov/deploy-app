'use strict';

var request = require('request');
var program = require('commander');

console.log('deploying..');

var DEPLOYER_URL = 'http://ngolikov0l:1234/';
var DEPLOYER_REQUEST = { method: '', url: '', headers: { 'Content-Type': 'application/json' }}

program  
  .arguments('<action>')
  .arguments('<appid>')
  .action(function(action, appid) {
  	action = action && action.toLowerCase ? action.toLowerCase() : action;
  	if (action === 'create') {
  		console.log('executing [%s] : [%s]', action, appid);  		
  		var request_opts = DEPLOYER_REQUEST;
  		request_opts.url = DEPLOYER_URL + 'env/1/app/' + appid;
  		request_opts.method = 'POST';
  		request(request_opts, function(err1, resp1, body1) {
			if (err1) { 
				console.log('err1 creating app: ' + err1);								
				process.exit(1);
			}
			//debugger;
			var r1 = JSON.parse(body1);
			var exitCode1 = (r1.success === true) ? 0 : 1;
			process.exit(exitCode1);
  		});
  	} else if (action === 'delete') {
  		console.log('executing [%s] : [%s]', action, appid);
  		var request_opts = DEPLOYER_REQUEST;
  		request_opts.url = DEPLOYER_URL + 'env/1/app/' + appid;
  		request_opts.method = 'DELETE';
  		request(request_opts, function(err2, resp2, body2) {
			if (err2) { 
				console.log('err1 creating app: ' + err2);								
				process.exit(1);
			}
			//debugger;
			var r2 = JSON.parse(body2);
			var exitCode2 = (r2.success === true) ? 0 : 1;
			process.exit(exitCode2);
  		});
  	} else {
  		console.log('unknown action [%s]. Valid actions: create|delete', action);
  		process.exit(1);
  	}  	  	
  })
  .parse(process.argv);