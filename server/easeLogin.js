Accounts.registerLoginHandler(function(loginRequest) {
  console.log(loginRequest.uun);
  if(!loginRequest.ease) {
    return undefined;
  }

  if(!loginRequest.uun || loginRequest.uun == '(null)') {
    return undefined;
  }

  var userId = null;
  var user = Meteor.users.findOne({username: loginRequest.uun});
  console.log(user);
  if(user) {
    userId = user._id;
  } else {
    throw new Meteor.Error('invalid-user', 'No user found with this uun');
  }

console.log(userId);

  //creating the token and adding to the user
  var stampedToken = Accounts._generateStampedLoginToken();
  //hashing is something added with Meteor 0.7.x,
  //you don't need to do hashing in previous versions
  var hashStampedToken = Accounts._hashStampedToken(stampedToken);

  Meteor.users.update(userId,
    {$push: {'services.resume.loginTokens': hashStampedToken}}
  );

  //sending token along with the userId
  return {
    userId: userId,
    token: stampedToken.token
  }
});
