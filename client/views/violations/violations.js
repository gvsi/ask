Template.violations.helpers({
  activeReports: function(){
    Meteor.subscribe('allReports');
    return Reports.find({status: "in_review"}, {sort: {createdAt: -1}}).fetch();
  },
  violatingReports: function() {
    return Reports.find({status: "violating"}, {sort: {createdAt: -1}}).fetch();
  },
  nonViolatingReports: function() {
    return Reports.find({status: "not_violating"}, {sort: {createdAt: -1}}).fetch();
  },
  dateFromNow: function() {
    return moment(this.createdAt).fromNow();
  }
});


Template.violations.events({
  "click .abuseBtn": function(event, template){
    Meteor.call('handleReport', this._id, true)
  },
  "click .notAbuseBtn": function(event, template){
    Meteor.call('handleReport', this._id, false)
  }
});