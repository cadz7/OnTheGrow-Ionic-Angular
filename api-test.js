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
    server = request('https://platform.dev.sproutatwork.com/');
    // server = request('http://localhost:3000');
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

  it('should return a 404 on a wrong endpoint', function (done) {
    return server
      .get('/v1/foo/bar')
      .expect(404)
      .end(done);
  });

  it('should return a 401 without authentication', function (done) {
    return server
      .get('/v1/filters')
      .expect(401)
      .expect('Content-Type', /json/)
      .end(done);
  });

  it('should return a 401 on wrong password', function (done) {
    return server
      .post('/v1/auth/login')
      .set('Content-Type', 'application/json')
      .send(JSON.stringify({
        username: 'yuri@rangle.io',
        password: 'asdfasdfasd',
        rememberMe: 1
      }))
      .expect(401)
      .end(done);
  });

  it('should return a 415 on wrong media type', function (done) {
    return server
      .post('/v1/auth/login')
      .set('Content-Type', 'application/foo')
      .send('F00')
      .expect(415)
      .end(done);
  });

  it('should return a 422 when the body is missing required fields', function (done) {
    return server
      .post('/v1/auth/login')
      .set('Content-Type', 'application/json')
      .send(JSON.stringify({
        username: 'yuri@rangle.io',
        password: 'password'
      }))
      .expect(422)
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
          expect(body).to.be.an('object');
          expect(body.token).to.be.a('string');
          expect(body.expirationDateTime.length).is.equal(20);
          token = body.token;
          deferred.resolve(body);
        }
      });
    return deferred.promise;
  }

  it('should authenticate', function () {
    return login();
  });

  it('should logout', function() {
    return login()
      .then(makeEndCaller(
        server
          .post('/v1/auth/logout')
          .set('Authorization', 'sprout-token ' + token)
          .send({})
          .expect(204)
        ))
      .then(makeEndCaller(
        server
          .get('/v1/auth/current_user')
          .set('Authorization', 'sprout-token ' + token)
          .expect(401)
      ));
  });

  it('should refresh token', function() {
    return login()
      .then(makeEndCaller(
        server
          .put('/v1/auth/refresh_token')
          .set('Authorization', 'sprout-token ' + token)          
          .send({})
          .expect(201)
        ));
  });

  function get(endpoint, query) {
    var url = endpoint;
    var deferred = Q.defer();
    if (query)  {
      url += '?'+querystring.stringify(query);
    }

    server.get(url)
      .set('Authorization', 'sprout-token ' + token)
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) {
          deferred.reject(err);
        } else {
          deferred.resolve(res);
        }
      });

    return deferred.promise
      .then(function(res) {
        expect(res.body).to.not.be.undefined;
        return res.body;
      });
  }

  function expectFields(obj, fieldTypes) {
    // console.log(JSON.stringify(obj, null, 2));
    
    function getValue(key) {
      var keyParts = key.split('.');
      var value = obj;
      keyParts.forEach(function(key) {
        if (!value) {
          throw new Error('No matching value for key:', key);
        }
        value = value[key];
      });
      return value;
    }

    expect(obj).to.be.an('object');
    _.keys(fieldTypes).forEach(function(fieldKey) {
      // console.log(fieldKey);
      expect(getValue(fieldKey)).to.be.a(fieldTypes[fieldKey]);
    });
  }

  function loginGetAndCheckBody(endpoint, query, bodyType, fieldTypes, bodyTest, itemTest) {
    return login()
      .then(function() {
        return get(endpoint, query);
      })
      .then(function(body) {
        // console.log('body:', JSON.stringify(body, null, 2));
        expect(body).to.be.a(bodyType);
        if (bodyType === 'array') {
          body.forEach(function(item) {
            expectFields(item, fieldTypes);
          });
        } else {
          expectFields(body, fieldTypes);
        }
        return body;
      })
      .then(function(body) {
        if (bodyTest) {
          bodyTest(body);
        }
        if (itemTest) {
          body.forEach(function(item) {
            itemTest(item);
          });
        }
      });
  }

  it('should return current user data', function () {
    return loginGetAndCheckBody(
      '/v1/auth/current_user',
      {},
      'object',
      {
        userId: 'number',
        firstNameDisplay: 'string',
        lastNameDisplay: 'string',
        avatarURL: 'string',
        location: 'string',
        department: 'string'
      });
  });

  var expectedFilterFields = {
    filterId: 'number',
    displayName: 'string'
  };

  function testFilterByType(filterType) {
    return loginGetAndCheckBody(
      '/v1/filters/',
      {filterType: filterType},
      'array',
      expectedFilterFields,
      null,
      function(filter) {
        expect(filter.filterType).to.equal(filterType);
      }
    );
  }

  it('should return all filters', function () {
    return login()
      .then(function() {
        return get('/v1/filters/')
          .then(function(body) {
            expect(body).to.be.an('array');
            body.forEach(function(item) {
              expectFields(item, expectedFilterFields);
            });
          });
      });
  });

  it('should return filters of each type', function () {
    var types = [
      'stream_items',
      'leaderboard',
      'time_periods',
      // 'activities'
    ];
    var tests = _.map(types, testFilterByType);
    return Q.all(tests);
  });

  it('should return stream items', function () {
    return loginGetAndCheckBody(
      '/v1/stream_items',
      {
        maxCount: 100
      },
      'array',
      {
        streamItemId: 'number',
        streamItemTypeSlug: 'string',
        'owner.userId': 'number',
        'owner.firstName': 'string',
        'owner.lastName': 'string',
        'viewer.isLikedByViewer': 'number',
        'viewer.isOwnedByViewer': 'number',
        'viewer.isPrivacyOn': 'number',
        'viewer.isMember': 'number',
        'viewer.eligibleGroups': 'array',
        'relatedToId': 'number',
        'relationTypeSlug': 'string',
        'dateTimeCreated': 'string',
        'streamItemDisplay': 'object',
        'canBePrivate': 'number',
        'likeCount': 'number',
        'avatarURL': 'string',
        'comments': 'array'
      },
      function(body) {
        var ids = _.pluck(body, 'streamItemId');
        var sortedIds = _.sortBy(ids, function(value) {
          return -value;
        });
        ids.forEach(function(id, idx) {
          expect(id).to.equal(sortedIds[idx]);
        });
      },
      function(item) {
        expect(item.filterType).to.equal(filterType);
      }
    );
  });

  it('should return comments', function () {
    return loginGetAndCheckBody(
      '/v1/comments',
      {
        streamItemId: 444357
      },
      'array',
      {
        commentId: 'number',
        commentedItemId: 'number',
        commentedItemTypeSlug: 'string',
        avatarURL: 'string',
        'owner.userId': 'number',
        'owner.firstName': 'string',
        'owner.lastName': 'string',
        'dateTimeCreated': 'string',
        'commentText': 'string',
        'commentDisplay': 'object',
        'commentTypeSlug': 'string'
      }
    );
  });

  it('should return activity categories', function () {
    return loginGetAndCheckBody(
      '/v1/activity_categories',
      {},
      'array',
      {
        activityCategoryId: 'number',
        activityCategoryDisplayName: 'string',
        activities: 'array'
      }
    );
  });

  it('should return activity categories', function () {
    return loginGetAndCheckBody(
      '/v1/activity_logs',
      {
        timePeriodId: 1
      },
      'array',
      {
        activityLogId: 'number',
        activityUnitId: 'number',
        quantity: 'number',
        points: 'number',
        date: 'string'
      }
    );
  });

  it('should return leaderboards', function () {
    return loginGetAndCheckBody(
      '/v1/leaderboards',
      {
        timePeriodId: 1
      },
      'array',
      {
        leaderboardNameDisplay: 'string',
        contestantLabelDisplay: 'string',
        items: 'array'
      }
    );
  });
});