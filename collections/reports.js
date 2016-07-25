Reports = new Mongo.Collection('reports');

Meteor.methods({
    /**
     * @summary Reports an abuse to the University (email and in-platform system).
     * @todo
     * @isMethod true
     * @memberOf Reports
     * @locus Server
     * @param  {Object} reportAttributes The attributes of the post that has been reported.
     */
    reportAbuse: function(reportAttributes) {
        check(reportAttributes, {
            id: String,
            type: String,
        });

        if (Meteor.isServer) {
            var emailText = "";
            var now = new Date();

            var report = {
                status: "in_review",
                type: reportAttributes.type,
                reporter: {
                    id: Meteor.userId(),
                    username: Meteor.user().username
                },
                createdAt: now,
                updatedAt: now,
            };

            if (reportAttributes.type == "post") {
                var post = Posts.findOne({_id: reportAttributes.id});
                if (post) {
                    emailText += "<b>Question title:</b><br>" + post.title;
                    emailText += "<br><b>Question body:</b> " + post.text;
                    emailText += 'Link: <a href="' + LIVE_URL + 'room/' + post.courseId +'?p=' + post._id + '"> Reported Link </a>';

                    report = _.extend(report, {
                        postId: post._id,
                        content: post.title + " - " + post.body,
                        author: {
                            id : post.userId,
                            username: Meteor.users.findOne(post.userId).username
                        },
                        link: '/room/' + post.courseId +'?p=' + post._id
                    });

                    Posts.update({_id: post._id}, {$set: {report: "in_review" }})

                    var notificationAttributes = {
                        intend: 'You question is being reviewed:',
                        postTitle: post.title,
                        text: sanitizeHtml(post.text, {allowedTags: []}),
                        type: 'reportedPost',
                        answerId: "",
                        postId: post._id,
                        postCourseId: post.courseId,
                        userId: post.userId,
                        seen: false
                    };

                    Meteor.call("addNotification", notificationAttributes);

                } else {
                    throw new Meteor.Error('invalid-report', 'This post you are trying to report does not exist');
                }

            } else if (reportAttributes.type == "answer") {
                var answer = Answers.findOne({_id: reportAttributes.id});
                if (answer) {
                    var post = Posts.findOne({_id: answer.postId});
                    emailText += "<br><b>Answer body:</b> " + answer.body;
                    emailText += '<b>Link:</b> <a href="' + LIVE_URL + 'room/' + post.courseId +'?p=' + post._id + '#'+ answer._id + '"> Reported Link </a>' ;
                } else {
                    throw new Meteor.Error('invalid-report', 'This question you are trying to report does not exist');
                }

                report = _.extend(report, {
                    content: answer.body,
                    postId: post._id,
                    answerId: answer._id,
                    author: {
                        id : answer.userId,
                        username: Meteor.users.findOne(answer.userId).username
                    },
                    link: '/room/' + post.courseId +'?p=' + post._id + '#'+ answer._id
                });

                Answers.update({_id: answer._id}, {$set: {report: "in_review" }})

                var notificationAttributes = {
                    intend: 'You answer is being reviewed:',
                    postTitle: post.title,
                    text: sanitizeHtml(answer.body, {allowedTags: []}),
                    type: 'reportedAnswer',
                    answerId: answer._id,
                    postId: post._id,
                    postCourseId: post.courseId,
                    userId: answer.userId,
                    seen: false
                };

                Meteor.call("addNotification", notificationAttributes);

            } else {
                throw new Meteor.Error('invalid-report', 'This type of report does not exist');
            }

            var reportId = Reports.insert(report);

            Email.send({
                from: "ask@ask.sli.is.ed.ac.uk",
                to: ["s1448512@sms.ed.ac.uk"],
                subject: "Ask Abuse Report",
                html: emailText
            });
        }


    },

    handleReport: function(id, isViolating) {
        check(id, String);
        check(isViolating, Boolean);

        if (Meteor.isServer) {
            var user = Meteor.users.findOne({_id: this.userId});

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
                            Posts.update({_id: report.postId}, {$set: {report: "not_violating"}});
                        } else if (report.type == "answer") {
                            Answers.update({_id: report.answerId}, {$set: {report: "not_violating"}});
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