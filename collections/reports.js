Meteor.methods({
    handleReport: function(id, isViolating) {
        check(id, String);
        check(isViolating, Boolean);

        if (Meteor.isServer) {
            var user = Meteor.users.findOne({_id: this.userId});
            console.log(user);

            if (user) {
                var report = Reports.findOne(id);
                if (!report) {
                    throw new Meteor.Error('invalid-report', 'This report does not exist');
                }

                if (ADMINS.indexOf(user.username) != -1) {
                    if (isViolating) {
                        Reports.update({_id: id}, {$set: {status: "violating", updatedAt: new Date()}});
                        if (report.type == "post") {
                            Posts.update({_id: report.postId}, {$set: {report: "violating"}});
                        } else if (report.type == "answer") {
                            Answers.update({_id: report.answerId}, {$set: {report: "violating"}});
                        }
                    } else {
                        Reports.update({_id: id}, {$set: {status: "not_violating", updatedAt: new Date()}});
                        if (report.type == "post") {
                            Posts.update({_id: report.postId}, {$unset: {report: true}});
                        } else if (report.type == "answer") {
                            Answers.update({_id: report.answerId}, {$unset: {report: true}});
                        }
                    }

                    return Posts.find({report: "in_review"});
                } else {
                    throw new Meteor.Error('invalid-authorisation', 'You are not authorised to do that!');
                }
            } else {
                throw new Meteor.Error('invalid-user', 'This user does not exist');
            }
            
        }
    }
});