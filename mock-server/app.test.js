'use strict';

var querystring = require('querystring');
var request = require('supertest');
var expect = require('chai').expect;
var Q = require('q');
var _ = require('lodash');
var token;

describe('api', function () {
  var server;

  beforeEach(function () {
    // server = request('https://platform.dev.sproutatwork.com/');
    server = request('http://localhost:3000');
  });

  // Turns supertest's end() method into a promise-returning function.
  function nbindEnd(expectObject) {
    return Q.nbind(expectObject.end, expectObject);
  }

  // Generates a function that would call a promise-returning function
  // generated from supertests's end() method.
  function makeEndCaller(expectObject) {
    return function () {
      return nbindEnd(expectObject)();
    };
  }

  it('should get a 401 without authentication', function (done) {
    return server
      .get('/v1/filters')
      .expect(401)
      // .expect('Content-Type', /json/)
      .end(done);
  });

  function login() {
    var deferred = Q.defer();
    server.post('/v1/auth/login')
      .set('Content-Type', 'application/json')
      .send(JSON.stringify({
        username: 'yuri@rangle.io',
        password: 'password',
        rememberMe: 1
      }))
      // .expect(201)
      .end(function(err, response) {
        var body;
        if (err) {
          deferred.reject(err);
        } else {
          body = response.body;
          // console.log(body);
          expect(body).to.be.an('object');
          expect(body.token).to.be.a('string');
          expect(body.expirationDateTime.length).is.equal(20);
          token = body.token;
          deferred.resolve(body);
        }
      });
    return deferred.promise;
  }

  // it('should authenticate', function () {
  //   return login();
  // });

  // it('should logout', function() {
  //   return login()
  //     .then(makeEndCaller(
  //       server
  //         .post('/v1/auth/logout')
  //         .set('Authorization', 'sprout-token ' + token)
  //         .send({})
  //         .expect(204)
  //       ))
  //     .then(makeEndCaller(
  //       server
  //         .get('/v1/auth/current_user')
  //         .set('Authorization', 'sprout-token ' + token)
  //         .expect(401)
  //     ));
  // });

  // it('should refresh token', function() {
  //   return login()
  //     .then(makeEndCaller(
  //       server
  //         .put('/v1/auth/refresh_token')
  //         .set('Authorization', 'sprout-token ' + token)          
  //         .send({})
  //         .expect(201)
  //       ));
  // });

  // function get(endpoint, query) {
  //   var url = endpoint;
  //   var deferred = Q.defer();
  //   if (query)  {
  //     url += '?'+querystring.stringify(query);
  //   }

  //   server.get(url)
  //     .set('Authorization', 'sprout-token ' + token)
  //     .expect(200)
  //     .expect('Content-Type', /json/)
  //     .end(function(err, res) {
  //       if (err) {
  //         // console.log(res);
  //         deferred.reject(err);
  //       } else {
  //         // console.log(res);
  //         deferred.resolve(res);
  //       }
  //     });

  //   return deferred.promise
  //     .then(function(res) {
  //       expect(res.body).to.not.be.undefined;
  //       return res.body;
  //     });
  // }

  // function expectFields(obj, fieldTypes) {
  //   // console.log(JSON.stringify(obj, null, 2));
    
  //   function getValue(key) {
  //     var keyParts = key.split('.');
  //     var value = obj;
  //     keyParts.forEach(function(key) {
  //       if (!value) {
  //         throw new Error('No matching value for key:', key);
  //       }
  //       value = value[key];
  //     });
  //     return value;
  //   }

  //   expect(obj).to.be.an('object');
  //   _.keys(fieldTypes).forEach(function(fieldKey) {
  //     // console.log(fieldKey);
  //     expect(getValue(fieldKey)).to.be.a(fieldTypes[fieldKey]);
  //   });
  // }

  // function loginGetAndCheckBody(endpoint, query, bodyType, fieldTypes) {
  //   return login()
  //     .then(function() {
  //       return get(endpoint, query);
  //     })
  //     .then(function(body) {
  //       // console.log('body:', JSON.stringify(body, null, 2));
  //       expect(body).to.be.a(bodyType);
  //       if (bodyType === 'array') {
  //         body.forEach(function(item) {
  //           console.log(item.streamItemId);
  //           expectFields(item, fieldTypes);
  //         });
  //       } else {
  //         expectFields(body, fieldTypes);
  //       }
  //       return body;
  //     });
  // } 

  // it('should return current user data', function () {
  //   return loginGetAndCheckBody(
  //     '/v1/auth/current_user/',
  //     {},
  //     'object',
  //     {
  //       userId: 'number',
  //       firstNameDisplay: 'string',
  //       lastNameDisplay: 'string',
  //       avatarURL: 'string',
  //       location: 'string',
  //       department: 'string'
  //     });
  // });

  // xit('should return all filters', function () {
  //   return login()
  //     .then(function() {
  //       return get('/v1/filters/')
  //         .then(function(body) {
  //           expect(body).to.be.an('array');
  //         });
  //     });
  // });

  // function testFilterByType(filterType) {
  //   return loginGetAndCheckBody(
  //     '/v1/filters/',
  //     {filterType: filterType},
  //     'array',
  //     {
  //       // filterId: 'number',
  //       displayName: 'string'
  //     }
  //   );
  // }

  // it('should return filters of each type', function () {
  //   var types = [
  //     'stream_items',
  //     'leaderboard',
  //     'time_periods',
  //     // 'activities'
  //   ];
  //   var tests = _.map(types, testFilterByType);
  //   return Q.all(tests);
  // });

  // it.only('should return stream items', function () {
  //   return loginGetAndCheckBody(
  //     '/v1/stream_items',
  //     {
  //       maxCount: 100
  //     },
  //     'array',
  //     {
  //       streamItemId: 'number',
  //       streamItemTypeSlug: 'string',
  //       'owner.userId': 'number',
  //       'owner.firstName': 'string',
  //       'owner.lastName': 'string',
  //       'viewer.isLikedByViewer': 'number',
  //       'viewer.isOwnedByViewer': 'number',
  //       'viewer.isPrivacyOn': 'number',
  //       // 'viewer.isMember': 'number',
  //       // 'viewer.eligibleGroups': 'array',
  //       'relatedToId': 'number',
  //       'relationTypeSlug': 'string',
  //       'dateTimeCreated': 'string',
  //       'streamItemDisplay': 'object',
  //       'canBePrivate': 'number',
  //       'likeCount': 'number',
  //       // 'avatarURL': 'string',
  //       'comments': 'array'
  //     }
  //   );
  // });

  // it('should return comments', function () {
  //   return loginGetAndCheckBody(
  //     '/v1/comments',
  //     {
  //       streamItemId: 444357
  //     },
  //     'array',
  //     {
  //       commentId: 'number',
  //       commentedItemId: 'number',
  //       commentedItemTypeSlug: 'string',
  //       // avatarURL: 'string',
  //       'owner.userId': 'number',
  //       'owner.firstName': 'string',
  //       'owner.lastName': 'string',
  //       'dateTimeCreated': 'string',
  //       'commentText': 'string',
  //       'commentDisplay': 'object',
  //       'commentTypeSlug': 'string'
  //     }
  //   );
  // });

  // xit('should return activity categories', function () {
  //   return loginGetAndCheckBody(
  //     '/v1/activity_categories',
  //     {},
  //     'array',
  //     {
  //       activityCategoryId: 'number',
  //       activityCategoryDisplayName: 'string',
  //       activities: 'array'
  //     }
  //   );
  // });

  // it('should return activity categories', function () {
  //   return loginGetAndCheckBody(
  //     '/v1/activity_logs',
  //     {
  //       timePeriodId: 1
  //     },
  //     'array',
  //     {
  //       // activityLogId: 'number',
  //       // activityUnitId: 'number',
  //       quantity: 'number',
  //       points: 'number',
  //       date: 'string'
  //     }
  //   );
  // });

  // xit('should return leaderboards', function () {
  //   return loginGetAndCheckBody(
  //     '/v1/leaderboards',
  //     {
  //       timePeriodId: 1
  //     },
  //     'array',
  //     {
  //       leaderboardNameDisplay: 'string',
  //       contestantLabelDisplay: 'string',
  //       items: 'array'
  //     }
  //   );
  // });

});