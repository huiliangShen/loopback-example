/**
 * Created by BanRuo on 2016/12/4.
 */
'use strict';
var async = require('async');
var CommonInterface = require('../cloud-rest-interface/common-interface');

module.exports = function (Common) {
  Common.getApp(function (err, app) {
    if (err) {
      throw err;
    }

    var app_self = app;
    var commonIter = new CommonInterface();

    //登录
    Common.login = function (data, callback) {
      var myToken = app_self.models.MYToken;
      var userInfo = {};

      //TODO: cloud logic
      async.waterfall(
        [
          function (cb) {
            commonIter.login(data, function (code, res) {
              if (code !== 200 && code !== -1) {
                cb({status: 0, msg: '云端服务异常'});
                return;
              }
              if (code === -1) {
                cb({status: 0, msg: '链接请求异常'});
                return;
              }
              //console.log("res:"+JSON.stringify(res));
              if (res.HasError) {
                cb({status: 0, msg: res.Fault.ErrorDescription});
              } else {
                //cb(null, {status: 1, data: {uid: res.Body}});
                if (res.Body) {
                  cb(null, {status: 1, data: {SysNo: res.Body}});
                } else {
                  cb({status: 0, msg: '用户不存在'});
                }
              }
            })
          },
          function (msg, cb) {
            commonIter.getUserBySysNo({userId: msg.data.SysNo}, function (code,res) {
              if (code !== 200 && code !== -1) {
                cb({status: 0, msg: '云端服务异常'});
                return;
              }
              if (code === -1) {
                cb({status: 0, msg: '链接请求异常'});
                return;
              }

              if (res.HasError) {
                cb({status: 0, msg: res.Fault.ErrorDescription});
              } else {
                //cb(null, {status: 1, data: {uid: res.Body}});
                if (res.Body) {
                  msg.data.User = res.Body;
                  cb(null, msg);
                } else {
                  cb({status: 0, msg: '用户详情错误'});
                }
              }
            });
          }
        ],
        function (err, msg) {
          if (err) {
            callback(null, err);
          } else {
            callback(null, msg);
          }
        }
      );
    };

    Common.remoteMethod(
      'login',
      {
        description: ['登录'],
        accepts: [
          {
            arg: 'data', type: 'object', required: true, http: {source: 'body'},
            description: [
              '登录(JSON string)，返回值：status 0-失败 1-成功，data {uid:用户id, token: 手令}，msg 错误消息',
              '{"name": "string", "pwd": "string"}'
            ]
          }
        ],
        returns: {arg: 'repData', type: 'string'},
        http: {path: '/login', verb: 'post'}
      }
    );

    //获取省列表
    Common.getProvinceList = function (data, callback) {

      commonIter.getProvinceList(data, function (code, res) {

        if (code !== 200 && code !== -1) {
          callback({status: 0, msg: res});
          return;
        }
        if (code === -1) {
          callback({status: 0, msg: res});
          return;
        }

        if (res.HasError) {
          callback({status: 0, msg: res.Fault.ErrorDescription});
        } else {
          callback(null, {status: 1, data: res.Body});

        }
      });
    };

    Common.remoteMethod(
      'getProvinceList',
      {
        description: ['获取省列表'],
        accepts: [
          {
            arg: 'data', type: 'object', required: true, http: {source: 'body'},
            description: [
              '获取省列表(JSON string)，返回值：status 0-失败 1-成功，data {Province 实体 list}，msg 错误消息 ',
              'showStreets: 是否显示街道',
              '{"showStreets": int}'
            ]
          }
        ],
        returns: {arg: 'repData', type: 'string'},
        http: {path: '/get-province-list', verb: 'post'}
      }
    );

    //获取市列表
    Common.getCityList = function (data, callback) {

      commonIter.getCityList(data, function (code, res) {

        if (code !== 200 && code !== -1) {
          callback({status: 0, msg: res});
          return;
        }
        if (code === -1) {
          callback({status: 0, msg: res});
          return;
        }

        if (res.HasError) {
          callback({status: 0, msg: res.Fault.ErrorDescription});
        } else {
          callback(null, {status: 1, data: res.Body});

        }
      });
    };

    Common.remoteMethod(
      'getCityList',
      {
        description: ['获取市列表'],
        accepts: [
          {
            arg: 'data', type: 'object', required: true, http: {source: 'body'},
            description: [
              '获取市列表(JSON string)，返回值：status 0-失败 1-成功，data {City 实体 list}，msg 错误消息 ',
              'showStreets: 是否显示街道 provinceId: 省编码',
              '{"showStreets": int, "provinceId": int}'
            ]
          }
        ],
        returns: {arg: 'repData', type: 'string'},
        http: {path: '/get-city-list', verb: 'post'}
      }
    );

    //获取区列表
    Common.getDistrictList = function (data, callback) {

      commonIter.getDistrictList(data, function (code, res) {

        if (code !== 200 && code !== -1) {
          callback({status: 0, msg: res});
          return;
        }
        if (code === -1) {
          callback({status: 0, msg: res});
          return;
        }

        if (res.HasError) {
          callback({status: 0, msg: res.Fault.ErrorDescription});
        } else {
          callback(null, {status: 1, data: res.Body});

        }
      });
    };

    Common.remoteMethod(
      'getDistrictList',
      {
        description: ['获取区列表'],
        accepts: [
          {
            arg: 'data', type: 'object', required: true, http: {source: 'body'},
            description: [
              '获取区列表(JSON string)，返回值：status 0-失败 1-成功，data {District 实体 list}，msg 错误消息 ',
              'showStreets: 是否显示街道 cityId: 市编码',
              '{"showStreets": int, "cityId": int}'
            ]
          }
        ],
        returns: {arg: 'repData', type: 'string'},
        http: {path: '/get-district-list', verb: 'post'}
      }
    );

    //修改密码
    Common.editUserPassword = function (data, callback) {

      commonIter.editUserPassword(data, function (code, res) {

        if (code !== 200 && code !== -1) {
          callback({status: 0, msg: res});
          return;
        }
        if (code === -1) {
          callback({status: 0, msg: res});
          return;
        }
        //console.log("editUserPassword res :"+JSON.stringify(res) + "code:"+code);
        if (res.HasError) {
          callback(null,{status: 0, msg: res.Fault.ErrorDescription});
        } else {
          callback(null, {status: 1, data: res.Body});
        }
      });
    };

    Common.remoteMethod(
      'editUserPassword',
      {
        description: ['修改密码'],
        accepts: [
          {
            arg: 'data', type: 'object', required: true, http: {source: 'body'},
            description: [
              '获取区列表(JSON string)，返回值：status 0-失败 1-成功，data，msg 错误消息 ',
              'showStreets: 是否显示街道 cityId: 市编码',
              '{"SysNo": int, "OldPassword": "string","NewPassword":"string"}'
            ]
          }
        ],
        returns: {arg: 'repData', type: 'string'},
        http: {path: '/edit-user-password', verb: 'post'}
      }
    );

    //发短信
    Common.sendMsg = function (data, callback) {

      commonIter.sendMsg(data, function (code, res) {

        if (code !== 200 && code !== -1) {
          callback(null, {status: 0, msg: res});
          return;
        }
        if (code === -1) {
          callback(null, {status: 0, msg: res});
          return;
        }
        //console.log("res:"+JSON.stringify(res));
        if (res.HasError) {
          callback(null, {status: 0, msg: res.Fault.ErrorDescription});
        } else {
          callback(null, {status: 1, data: res.Body});
        }
      });
    };

    Common.remoteMethod(
      'sendMsg',
      {
        description: ['发送短信'],
        accepts: [
          {
            arg: 'data', type: 'object', required: true, http: {source: 'body'},
            description: [
              '发送短信，返回值：status 0-失败 1-成功，data，msg 错误消息 ',
              '{"SendPhoneNos": "string"(发送短信的号码 数组JSON), "SendCount": "发送短信的数量","SendContent":"string"(内容)}'
            ]
          }
        ],
        returns: {arg: 'repData', type: 'string'},
        http: {path: '/send-msg', verb: 'post'}
      }
    );
  });
};
