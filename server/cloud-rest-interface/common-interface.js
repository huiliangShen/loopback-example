/**
 * Created by BanRuo on 2016/12/3.
 */
var util = require('util');
var async = require('async');
var http = require('http');
var config = require('./config.json');
var crypto = require('crypto');

var CommonInterface = function() {
    Object.call(this);
};
util.inherits(CommonInterface, Object);

http.globalAgent.maxSockets = 10000;
http.globalAgent.keepAlive = true;

var parFilter = function(obj) {

    for (var o in obj) {
        if (obj[o] === null || obj[o] === undefined) {
            delete obj[o];
        }
    }
    return obj;
};

function createOption(cloud, url, len) {
    return {
        hostname: cloud.ip,
        port: cloud.port,
        path: cloud.basePath + url,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Connection': 'keep-alive'
        }
    };
}

function createRequest(options, callback) {
    return http.request(options, function(res) {
        if (res.statusCode != 200) {
            console.error(options.path + ' problem with request: ' + res.statusCode);
            callback(res.statusCode, null);
        }
        res.setEncoding('utf8');
        var data = '';
        res.on('data', function(chunk) {
            data += chunk;
        });
        res.on('end', function() {
            if (res.statusCode === 200) {
                callback(res.statusCode, JSON.parse(data));
            }
        });
    });
}

CommonInterface.prototype.login = function(obj, callback) {
    var param = {};
    param.CompanyCode = config.companyCode;
    param.UserSysNo = obj.systemId || 1;
    param.Filters = [];

    param.body = {
        LoginName: obj.name,
        Password: obj.pwd
    };
    param.Filters = [];

    var content = JSON.stringify(param);
    var options = createOption(config.UserAction, 'User/LoginUser', content.length);
    //console.log("options:"+JSON.stringify(options) + "content:"+JSON.stringify(content));
    var req = createRequest(options, function(code, data) {
        callback(code, data);
    });

    req.on('error', function(e) {
        console.error('login problem with request: ' + e.message);
        callback(-1, null);
    });

    req.end(content);
};


exports = module.exports = CommonInterface;