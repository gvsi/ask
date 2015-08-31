Students = new Mongo.Collection('students');
Visits = new Mongo.Collection('visits');

UserStatus.events.on("connectionLogin", function(fields) {
  if(Meteor.isServer){
    var currentDate = moment().startOf('day').toDate();
    var visit = Visits.findOne({userId: fields.userId, date: currentDate});

    if(!visit){
      var visitAttributes = {
        userId: fields.userId,
        date: currentDate
      };

      Visits.insert(visitAttributes);
    }
  }
});

Meteor.methods({
  deleteProfilePicture:function(){
     Meteor.users.update({_id: Meteor.userId()}, {$unset: {"profile.image": 1 } });
  }
});
