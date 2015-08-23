Students = new Mongo.Collection('students');
Visits = new Mongo.Collection('visits');

UserStatus.events.on("connectionLogin", function(fields) {
  Meteor.userId = function() {
    return fields.userId;
  };
  Meteor.call("userVisit", function(error, result){
    if(error){
      console.log("error", error);
    }
  });
});

Meteor.methods({
  userVisit:function(){
    if(Meteor.isServer){
      var currentDate = moment().format("L");
      var visit = Visits.findOne({userId: Meteor.userId(), date: currentDate});

      if(!visit){
        var visitAttributes = {
          userId: Meteor.userId(),
          date: currentDate
        };

        Visits.insert(visitAttributes);
      }
    }
  }
});
