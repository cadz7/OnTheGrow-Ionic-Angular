exports.login = function login(req, res) {
  var token = '31415926535897932384626433832795';
  res.setHeader('Content-Type', 'application/json');
  if (req.body.username==='arthur') {
    var expiration = new Date();
    expiration.setHours(expiration.getHours() + 3);
    res.send(200, {
      token: token,
      expiresDateTime: expiration.toISOString()
    });
  } else {
    res.send(401, {
      errorCode: 'wrong-password',
      displayMessage: 'Wrong username or password'
    });
  }
};