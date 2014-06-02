/* jshint expr:true */

'use strict';
var expect = chai.expect;
describe('user service', function() {
  var mockData = {}
  , apiRoot
  , user
  , userStorage;

  beforeEach(function(){
    module('sproutApp.user');
    module(function($provide) {
      $provide.factory('$q', function() {
        return Q;
      });
      $provide.factory('server',function(){
        return {
          login : function(user,pass){
            var deferred = Q.defer();

            if (user === pass)
              deferred.resolve({token:'token'});
            else
              deferred.reject({errorCode:'WRONG'});
            return deferred.promise;
          },
          get : function(url,query){
            var deferred = Q.defer();
            deferred.resolve({
                userId: 42,
                firstNameDisplay: 'John',
                lastNameDisplay: 'Smith',
                avatarURL: 'https://company.sproutatwork.com/linktouserpic/pic.jpg',
                location: 'Toronto',
                department: 'Development',
                sproutScore: 23142,
                timePeriodId: 2
              })

            return deferred.promise;            
          }
        }
      });
      $provide.factory('userStorage', function () {
        return {
          get: sinon.spy(function(key) {
            if(typeof key === 'undefined' || ! key)
              key = 'user';
            return mockData[key];
          }),
          set: sinon.spy(function(value, key) {
            if(typeof key === 'undefined' || ! key)
              key = 'user';            
            mockData[key] = value;
          }),
          removeUser: sinon.spy(function() {
            mockData.user = null;
          })
        };
      });
      $provide.factory('$window', function () {
        return {         
          location : {
            replace : function(url){return true;}
          }        
        };
      });

    });
    mockData = {};
    user = testUtils.getService('user');
    userStorage = testUtils.getService('userStorage');  
  });  


  it('user service should get loaded', function () {
    expect(user).to.not.be.undefined;
    userStorage.get.should.have.been.calledTwice; // Once for 'user', once for 'settings'
  });

  it('user should be initially unauthenticated', function () {
    expect(user.data).to.be.falsy;
    expect(user.isAuthenticated).to.be.false;
    userStorage.get.should.have.been.calledTwice; // Once for 'user', once for 'settings'
  });

  it('should authenticate user', function (done) {
    var promise = user.whenAuthenticated();
    expect(user.isAuthenticated).to.be.falsy;
    expect(promise.isPending()).to.be.truthy;
    user.login('arthur','arthur')
      .then(function(result) {
        expect(user.isAuthenticated).to.be.truthy;        
        expect(user.data.userId).to.equal(42);
        expect(promise.isPending()).to.be.falsy;
        done();
      },done);     
  });

  it('should put the user in userStorage if rememberMe is checked',function(done){
    return user.login('simon@rangle.io','testtest', true)
      .then(function(result) {
        var storedUser = userStorage.get('user');
        expect(storedUser).to.exist;
        expect(storedUser.email).to.equal('simon@rangle.io');
        done();
      },done);     
  });

  it('should not put the user in userStorage if rememberMe is not checked',function(done){
   return user.login('arthur','arthur', false)
      .then(function(result) {
        expect(userStorage.get('user')).to.not.exist; 
        done();
      },done);     
  });

  it('should update the user settings to match the value of rememberMe=true', function(done){
    return user.login('simon@rangle.io','testtest', true)
      .then(function(result) {
        var settings = userStorage.get('settings');
        expect(settings).to.exist;
        expect(settings.rememberMe).to.be.true;
        done();
      },done);  
  });

  it('should update the user settings to match the value of rememberMe=false', function(done){
    return user.login('simon@rangle.io','testtest', false)
      .then(function(result) {
        var settings = userStorage.get('settings');
        expect(settings).to.exist;
        expect(settings.rememberMe).to.be.false;
        done();
      },done);  
  });

  it('should not authenticate wrong username', function (done) {
    user.login('bob','not bobs password')
      .then(function(result) {
        done(new Error('The promise should have been rejected'));
      }, function(error) {
        expect(error.errorCode).to.not.be.undefined;
        done();
      }).then(null,done)
  });
});