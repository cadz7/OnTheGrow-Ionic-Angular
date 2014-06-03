/* globals describe, it, chai, console */

'use strict';
var expect = chai.expect;
describe('server service', function() {
  var server
  ,$httpBackend
  ,apiRoot
  ,cache
  ,mockData;
  beforeEach(module('sproutApp.server'));


  beforeEach(module(function ($provide) {
    $provide.factory('cache', function () {
        return {
          get: sinon.spy(function(key) {
            return mockData[key];
          }),
          set: sinon.spy(function(key, value) {
            mockData[key] = value;
          }),
          delete: sinon.spy(function(key) {
            mockData[key] = null;
          })
        };
    });
    $provide.factory('Notify', function() { return {warn:function() {}}});
    $provide.factory('$window', function () {

        return {         
          location : {
            replace : function(url){return true;}
          }        
        };
    });
  }));

  beforeEach(function(){

    mockData = {};
    server = testUtils.getService('server');
    cache = testUtils.getService('cache');  
  })
  beforeEach(inject(function($injector) {
    apiRoot = $injector.get('API_URL');
    $httpBackend = $injector.get('$httpBackend');   
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('should load', function () {
    expect(server).to.not.be.undefined;
  });

  
  it('should have API_URL defined',function(){
    expect(apiRoot).to.not.be.undefined;
  });

  describe('login',function(){

    it('should make a post req and receive a token and exp time if the server returns 201',function(done){
      $httpBackend.expectPOST(apiRoot+'auth/login',{username:'user',password:'pass',rememberMe:false}).respond(201,{token:'token',expirationDateTime:new Date().toUTCString()});
      server.login('user','pass',false)
      .then(function(result){
        expect(result).to.not.be.undefined;
        expect(result.token).to.not.be.undefined;
        expect(result.expirationDateTime).to.not.be.undefined;
        done();
      },function(error){done(error)});
      $httpBackend.flush();      
    });

    it('should put the given token in the header of all requests after authenticating', function(done){
      $httpBackend.expectPOST(apiRoot+'auth/login',{username:'user',password:'pass',rememberMe:false}).respond(201,{token:'token',expirationDateTime:new Date().toUTCString()});
      $httpBackend.expectGET(apiRoot+'test',undefined,function(headers){return headers['Authorization'] === 'sprout-token token';}).respond(200,{test:1});
      
      server.login('user','pass',false)
            .then(function(result){
               server.get('test').then(function(result){done()},done);
              },function(error){done(error)});
      $httpBackend.flush();      
    });

    it('should strip the given token from the header if given a status code 401', function(done){
      //assign the service a token
      $httpBackend.expectPOST(apiRoot+'auth/login',{username:'user',password:'pass',rememberMe:false}).respond(201,{token:'token',expirationDateTime:new Date().toUTCString()});
      //return a 401

      $httpBackend.expectGET(apiRoot+'test',undefined,function(headers){return headers['Authorization'] === 'sprout-token token';}).respond(401,{test:1});
      //check that the next request no longer has the token
      $httpBackend.expectGET(apiRoot+'test',undefined,function(headers){return !headers['Authorization'];}).respond(401,{test:1});
      
      server.login('user','pass',false)
        .then(function(result){
           return server.get('test')
        },function(error){done(error)})
        .then(function(){done(new Error('promise should have been rejected due to 401'))},
              function(){
                server.isReachable = true;
                return server.get('test')
              })
        .then(function(result){done(new Error('should have been rejected'))},
              function(){done();});
      $httpBackend.flush();      
    });

    it('should return a rejected promise if the server returns 401',function(done){
      $httpBackend.expectPOST(apiRoot+'auth/login',{username:'not a user',password:'pass',rememberMe:false}).respond(401,{errorCode: 'error_code_example', displayMessage: 'Example error code display message',errorDetails: 'Something went really wrong, and here are the details of what exactly was'});
      var result = server.login('not a user','pass',false)
      .then(function(result){
        done(new Error('the promise should have been rejected'));
      },function(error){        
        expect(error).to.not.be.undefined;
        expect(error.errorCode).to.not.be.undefined;
        expect(error.displayMessage).to.not.be.undefined;
        expect(error.errorDetails).to.not.be.undefined;
        done()
      });
      $httpBackend.flush();
    });

    it('should put the token in the cache if rememberMe = true',function(done){
      $httpBackend.expectPOST(apiRoot+'auth/login',{username:'user',password:'pass',rememberMe:true}).respond(200,{token:'Something'});
      var result = server.login('user','pass',true)
      .then(function(result){
        expect(cache.get(server.getCacheKey())).to.equal('sprout-token Something');
        done();
      },done);
      $httpBackend.flush();
    });

    it('should not put the token in the cache if rememberMe = false',function(done){
      $httpBackend.expectPOST(apiRoot+'auth/login',{username:'user',password:'pass',rememberMe:false}).respond(200,{token:'Something'});
      var result = server.login('user','pass',false)
      .then(function(result){
        expect(cache.get(server.getCacheKey())).to.be.falsely;
        done();
      },done);
      $httpBackend.flush();
    });

  });//LOGIN
  
  describe('refreshAuthToken',function(){
    it('should make a PUT request',function(done){
      $httpBackend.expectPUT(apiRoot+'auth/refresh_token').respond(200,{token:'Something'});
      server.refreshAuthToken().then(function(){done();},done);
      $httpBackend.flush();      
    });
  });

  describe('getCacheKey', function(){
    it('should return a string', function(){
      expect(server.getCacheKey()).to.be.a.string;
    });
  });

  describe('clearAuthToken', function(){
    it('should clear the auth token', function(done){
      $httpBackend.expectPOST(apiRoot+'auth/login',{username:'user',password:'pass',rememberMe:true}).respond(201,{token:'test',expirationDateTime:new Date().toUTCString()});
      
      server.login('user','pass',true)
            .then(function(result){
                expect(cache.get(server.getCacheKey())).to.not.be.falsely;
                server.clearAuthToken();
                expect(cache.get(server.getCacheKey())).to.be.falsely;
                done();
              },done);
      $httpBackend.flush();  
    });
  });

  describe('saveAuthToken', function(){
    it('should set the auth token from the headers', function(done){
      $httpBackend.expectPOST(apiRoot+'auth/login',{username:'user',password:'pass',rememberMe:false}).respond(201,{token:'test',expirationDateTime:new Date().toUTCString()});
      
      server.login('user','pass',false)
            .then(function(result){
                expect(cache.get(server.getCacheKey())).to.be.falsely;
                server.saveAuthToken();
                expect(cache.get(server.getCacheKey())).to.equal('sprout-token test');
                done();
              },done);
      $httpBackend.flush();  
    });
  });

  describe('logout', function(){
    it('should make a post req',function(done){
      $httpBackend.expectPOST(apiRoot+'auth/logout').respond(201);
      server.logout()
      .then(function(result){        
        done();
      },function(error){done(error)});
      $httpBackend.flush();      
    });

    it('should clear the Authorization header field', function(done){
      $httpBackend.expectPOST(apiRoot+'auth/login',{username:'user',password:'pass',rememberMe:false}).respond(201,{token:'token',expirationDateTime:new Date().toUTCString()});
      $httpBackend.expectPOST(apiRoot+'auth/logout').respond(201);      
      $httpBackend.expectGET(apiRoot+'test',undefined,function(headers){return headers['Authorization'] === null;}).respond(200,{test:1});
      
      server.login('user','pass',false)
            .then(function(result){
                return server.logout();               
              })

            .then(function() {
              return server.get('test');
            })
            .then(function(){done()})
            .then(null,function(error){done(error)});
      $httpBackend.flush();      
    });

    it('should clear the auth token from cache',function(done){
      $httpBackend.expectPOST(apiRoot+'auth/logout').respond(201);
      server.logout()
      .then(function(result){    
        expect(cache.get('Authorization')).to.be.null;    
        done();
      },function(error){done(error)});
      $httpBackend.flush();      
    });
  });

  describe('get',function(){

    it('should make a get req and receive a json obj since the server returns 200',function(done){
      $httpBackend.expectGET(apiRoot+'test?param=1').respond(200,{test:true});


      server.get('test',{param:1})
      .then(function(result){
        expect(result).to.not.be.undefined;
        expect(result.test).to.not.be.undefined;       
        done();
      },function(error){done(error)});
      $httpBackend.flush();      
    });

    it('should return a rejected promise if the server returns a non 200s status',function(done){
      $httpBackend.expectGET(apiRoot+'test').respond(500,{test:true});
      server.get('test')
      .then(function(result){
        done(new Error('the promise should have been rejected'));
      },function(error){        
        expect(error).to.not.be.undefined;
        expect(error.test).to.not.be.undefined;        
        done()
      });
      $httpBackend.flush();
    });
  });//GET

  describe('post',function(){

    it('should make a post req and receive a json obj since the server returns 201',function(done){
      var msg = {test:true};
      $httpBackend.expectPOST(apiRoot+'test',msg).respond(201,{test:true});
      var result = server.post('test',msg)
      .then(function(result){
        expect(result).to.not.be.undefined;
        expect(result.test).to.not.be.undefined;       
        done();
      },function(error){done(error)});
      $httpBackend.flush();      
    });

    it('should return a rejected promise if the server returns a non 200s status',function(done){
      var msg = {test:true};
      $httpBackend.expectPOST(apiRoot+'test',msg).respond(400,{test:true});
      var result = server.post('test',msg)
      .then(function(result){
        done(new Error('the promise should have been rejected'));
      },function(error){        
        expect(error).to.not.be.undefined;
        expect(error.test).to.not.be.undefined;        
        done()
      });
      $httpBackend.flush();
    });
  });//POST

  describe('put',function(){

    it('should make a put req and receive a json obj since the server returns 201',function(done){
      var msg = {test:true};
      $httpBackend.expectPUT(apiRoot+'test',msg).respond(201,{test:true});
      var result = server.put('test',msg)
      .then(function(result){
        expect(result).to.not.be.undefined;
        expect(result.test).to.not.be.undefined;       
        done();
      },function(error){done(error)});
      $httpBackend.flush();      
    });

    it('should return a rejected promise if the server returns a non 200s status',function(done){
      var msg = {test:true};
      $httpBackend.expectPUT(apiRoot+'test',msg).respond(400,{test:true});
      var result = server.put('test',msg)
      .then(function(result){
        done(new Error('the promise should have been rejected'));
      },function(error){        
        expect(error).to.not.be.undefined;
        expect(error.test).to.not.be.undefined;        
        done()
      });
      $httpBackend.flush();
    });
  });//put

  describe('delete',function(){

    it('should make a delete req ',function(done){
      
      $httpBackend.expectDELETE(apiRoot+'test').respond(204);
      var result = server.delete('test')
      .then(function(result){
        done();
      },function(error){done(error)});
      $httpBackend.flush();      
    });

    it('should return a rejected promise if the server returns a non 200s status',function(done){
     
      $httpBackend.expectDELETE(apiRoot+'test').respond(420,{test:true});
      var result = server.delete('test')
      .then(function(result){
        done(new Error('the promise should have been rejected'));
      },function(error){        
        expect(error).to.not.be.undefined;
        expect(error.test).to.not.be.undefined;        
        done()
      });
      $httpBackend.flush();
    });
  });//DELETE

  describe('server connection status', function(){
    it('should be initalized to true',function(){
      expect(server.isReachable).to.be.true;
    });

    it('should be set to false after an 404 status code',function(done){
      $httpBackend.expectDELETE(apiRoot+'test').respond(404);
      var result = server.delete('test')
      .then(function(result){
        done(new Error('the promise should have been rejected'));
      },function(error){
        expect(server.isReachable).to.be.false;
        done();
      });
      $httpBackend.flush();      
    
    });
  });//connection status
  //TODO test offine stuff
});