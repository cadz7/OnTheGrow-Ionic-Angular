/* global exports, require */

'use strict';

var koast = require('koast');
var connection = koast.getDatabaseConnectionNow();
var mapper = koast.makeMongoMapper(connection);
var fakeAuth = require('./fake-auth');

exports.defaults = {};

exports.defaults.authorization = function defaultAuthorization(req, res) {
  var authHeader = req.headers.authorization;
  if (authHeader) {
    return authHeader[0] === '3';
  } else {
    return false;
  }
};

// mapper.defaults.useEnvelope = false;

exports.routes = [
  {
    method: 'post',
    route: 'auth/login',
    authorization: function allowAll() {
      return true;
    },
    handler: fakeAuth.login
  },
  {
    method: 'get',
    route: 'filters',
    handler: mapper.get({
      model: 'filters',
      useEnvelope: false
    })
  }
];