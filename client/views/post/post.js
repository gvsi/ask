Template.postPage.rendered = function () {
  // close sidebar for mobile
  $("body").removeClass("sidebar-open")

  //number of users per day
  for (var i = 0; i < 10; i++) {
    var date = moment().subtract(i, 'days').format("L");
  }

  if (!$("#no-post-error").length) {
    $("#postList").ioslist();
  }

  EasySearch.changeProperty('courseSearch', 'courseId', Router.current().params.courseId);
  mathquill();

  if ($(window).width() < 980) {
    $('.postListContainer').attr('id', 'slide-left');
  } else {
    $('.postListContainer').removeAttr('id', 'slide-left');
  }

  Meteor.call("visitCourse", Router.current().params.courseId , function(error, result){
    if(error){
      console.log("error", error);
    }
  });

  if (Router.current().params.query.p) {
    loadPage(Router.current().params.query.p, true);
  }else{
    var course = Courses.findOne(Router.current().params.courseId);
    if(course){
      Session.set("DocumentTitle",  course.name + " | Ask");
    }else{
      Session.set("DocumentTitle", "Ask");
    }
    setUserLastCourse();
  }

  $(window).resize(function() {
    if ($(window).width() < 980) {
      $('.postListContainer').attr('id', 'slide-left');
    } else {
      $('.postListContainer').removeAttr('id', 'slide-left');
    }

    if ($(window).width() > 1024) {
      $('.postListContainer').length && $('.postListContainer').removeClass('slideLeft');
    }

  });

  var elems = Array.prototype.slice.call(document.querySelectorAll('.switchery'));
  elems.forEach(function(html) {
    if(html.id == "lectureMode"){
      var switchery = new Switchery(html, {disabled: true});
    }else{
      var switchery = new Switchery(html, {color: '#10CFBD'});
    }
  });

  $('.custom-tag-input').tagsinput({});
  $('#instructorsInput').tagsinput({});

  var course = Courses.findOne(Router.current().params.courseId);
  if (course) {
    var instructors = course.instructors;

    instructors.forEach(function(instructor){
      if(instructor != Meteor.user().username.toLowerCase()){
        $('#instructorsInput').tagsinput('add', instructor);
      }
    });
  }

  var cts = Session.get('customTags');
  if (cts) {
    cts.forEach(function(tag) {
      $('.custom-tag-input').tagsinput('add', tag);
    });
    Session.set('customTags', undefined)
    $('#customTagsForCourse').show();
  }
  setTimeout(function () {
    $("#howToAnswerPortlet").portlet();
  }, 2000);
}

Template.registerHelper("hasAvatar", function(argument){
    var user = Meteor.users.findOne(this.userId);
    if(user && user.profile.image){
      return true;
    }else{
      return false;
    }
});

Template.registerHelper("avatar", function(argument){
  var user = Meteor.users.findOne(this.userId);
  if(user && user.profile.image){
    return user.profile.image;
  }else{
    return "";
  }
});

Template.registerHelper("isUserInstructor", function(){
  var currentCourse = Courses.findOne(Router.current().params.courseId);
  var un = Meteor.user().username.toLowerCase();
  if(currentCourse && (currentCourse.instructors.indexOf(un)!=-1)){
    return true;
  }else{
    return false;
  }
});

Template.registerHelper("isUserEnrolled", function(){
  return Meteor.users.findOne(Meteor.userId()).profile.courses.indexOf(Router.current().params.courseId) != -1
});

Template.registerHelper("posterIsOwner", function(){
  var post = Posts.findOne({_id: this.postId}, {fields: {userIdenticon: true}});
  if (post) {
    return this.userIdenticon == post.userIdenticon;
  }
});

Template.registerHelper('equals', function (a, b) {
  return a === b;
});

Template.postPage.helpers({
  courseId: function () {
    return Router.current().params.courseId;
  },
  queryPathFor: function () {
    return "q="+this.post._id;
  },
  areTherePosts: function() {
    return Posts.find({'courseId': Router.current().params.courseId}).count() > 0;
  }
});

Template.courseSettingsModal.helpers({
  course: function() {
    return Courses.findOne(this.courseId);
  },
  defaultTagsChecked: function(){
    return this.areTagsDefault == true ? "checked" : "";
  },
  loadCustomTags: function() {
    Session.set('customTags', this.tags);
  }
});


Template.courseSettingsModal.events({
  "change #defaultTags": function(e){
    var isDefault = $("#defaultTags")[0].checked;
    var tagAttributes = {
      courseId: this._id,
      areTagsDefault: isDefault,
    };

    Meteor.call('setOrRemoveDefaultTags', tagAttributes, function(error, result) {});

    if (isDefault) {
      //stores custom somewhere if there's change of mind
      var cts = $(".custom-tag-input").tagsinput('items');
      if (cts.length > 0) {
        Session.set('customTags', $(".custom-tag-input").tagsinput('items'));
      }
      $('#customTagsForCourse').hide();
    } else {
      var cts = Session.get('customTags');
      if (cts) {
        $(".custom-tag-input").tagsinput('removeAll');
        cts.forEach(function(ct) {
          $('.custom-tag-input').tagsinput('add', ct);
        });
      }
      $('#customTagsForCourse').show();
      $("#customTagsForCourse>.bootstrap-tagsinput input").focus();
    }

  },
  "itemAdded .custom-tag-input": function(event){
    var tagAttributes = {
      courseId: Router.current().params.courseId,
      isAdd: true,
      tag: event.item
    };

    Meteor.call('addOrRemoveTag', tagAttributes, function(error, result) {});
  },
  "itemRemoved .custom-tag-input": function(event){
    var tagAttributes = {
      courseId: Router.current().params.courseId,
      isAdd: false,
      tag: event.item
    };

    Meteor.call('addOrRemoveTag', tagAttributes, function(error, result) {});
  },
  "itemAdded #instructorsInput": function(event){
    var instructorAttributes = {
      courseId: Router.current().params.courseId,
      isAdd: true,
      instructor: event.item
    };

    Meteor.call('addOrRemoveInstructor', instructorAttributes);
  },
  "itemRemoved #instructorsInput": function(event){
    var instructorAttributes = {
      courseId: Router.current().params.courseId,
      isAdd: false,
      instructor: event.item
    };

    Meteor.call('addOrRemoveInstructor', instructorAttributes);
  }
});

Template.postList.events({
  'click .item': function(e) {
    var postId = $(e.currentTarget).attr('data-post-id');

    Router.go('room', {courseId: Router.current().params.courseId}, {query: 'p='+postId});
    loadPage(postId, false);

  },
  'click .closeFilter': function(e) {
    Session.set('postFilter', undefined);
    Session.set('isTagFilter', undefined);
  }
});

Template.registerHelper("filterName", function(){
  return Session.get('postFilter');
});

Template.registerHelper("isTagFilter", function(){
  return Session.get('isTagFilter');
});

Template.thumbnailList.helpers({
  dateGroups: function() {
    var groups = [
      {
        title:'today',
        start: moment().startOf('day'),
        end: moment().endOf('day')
      },
      {
        title:'yesterday',
        start: moment().startOf('day').subtract(1, 'days'),
        end: moment().endOf('day').subtract(1, 'days')
      },
      {
        title:'earlier this week',
        start: moment().startOf('isoweek'),
        end: moment().endOf('day').subtract(2, 'days')
      },
      {
        title:'last week',
        start: moment().startOf('isoweek').subtract(1, 'weeks'),
        end: moment().format('dddd') != 'Monday'? moment().endOf('isoweek').subtract(1, 'weeks') : moment().endOf('isoweek').subtract(8, 'days')
      }
    ];

    var lastPost = Posts.findOne({},{sort:{createdAt:1}, limit:1})
    var startOfLastWeek = moment().startOf('isoweek').subtract(1, 'weeks');

    if (lastPost && lastPost.createdAt < startOfLastWeek) {
      var lastDate = lastPost.createdAt;
      var st = moment(lastDate).startOf('isoweek');
      var en = moment(lastDate).endOf('isoweek');

      while(en <= startOfLastWeek) {

        groups.push({
          title: "week " + st.format("DD/MM") + " - " + en.format("DD/MM"),
          start: moment(st),
          end: moment(en)
        })
        st.add(1, 'weeks');
        en.add(1, 'weeks');
      }
    }
    return groups;
  },
  areTherePosts: function() {
    var filter = Session.get('postFilter');
    var isTagFilter = Session.get('isTagFilter');
    if (filter == 'unanswered') {
      return Posts.find({'courseId': Router.current().params.courseId, 'answersCount': 0, 'isInstructorPost': {$exists: false}}).count() > 0;
    } else if (filter == "unread") {
      return Posts.find({'courseId': Router.current().params.courseId, 'viewers': {$ne: Meteor.userId()}}).count() > 0;
    } else {
      if(isTagFilter == 1 || isTagFilter == 2){
        return Posts.find({'courseId': Router.current().params.courseId, 'tags': filter}).count() > 0;
      }else{
        return Posts.find({'courseId': Router.current().params.courseId}).count() > 0;
      }
    }
  },
  postsByDate: function () {
    var filter = Session.get('postFilter');
    var isTagFilter = Session.get('isTagFilter');
    if (filter == 'unanswered') {
      $(".post-list").css('height', '94%');
      return Posts.find({'courseId': Router.current().params.courseId, 'answersCount': 0, 'isInstructorPost': {$exists: false}, 'createdAt': {$gte: this.start.toDate(), $lt: this.end.toDate()}}, {sort: {createdAt: -1}});
    } else if (filter == 'unread') {
      $(".post-list").css('height', '94%');
      return Posts.find({'courseId': Router.current().params.courseId, 'viewers': {$ne: Meteor.userId()}, 'createdAt': {$gte: this.start.toDate(), $lt: this.end.toDate()}}, {sort: {createdAt: -1}});
    } else {
      if(isTagFilter == 1 || isTagFilter == 2){
        $(".post-list").css('height', '94%');
        return Posts.find({'courseId': Router.current().params.courseId, 'tags': filter , 'createdAt': {$gte: this.start.toDate(), $lt: this.end.toDate()}}, {sort: {createdAt: -1}});
      }else{
        $(".post-list").css('height', '100%');
        return Posts.find({'courseId': Router.current().params.courseId, createdAt: {$gte: this.start.toDate(), $lt: this.end.toDate()}}, {sort: {createdAt: -1}});
      }
    }
  }
});

Template.thumbnailList.rendered = function(){
  $("#postList").ioslist();
}

Template.postThumbnail.helpers({
  dateFromNow: function() {
    return moment(this.createdAt).fromNow();
  },
  textWithoutTags: function() {
    var dummyNode = document.createElement('div'),
    resultText = '';
    dummyNode.innerHTML = this.text;
    resultText = dummyNode.innerText || dummyNode.textContent
    return resultText;
  },
  isPostViewed: function(){
    if(this.viewers.length == 0){
      return "new-post bold";
    }
  }
});

Template.postContent.helpers({
  post: function() {
    var postId = Router.current().params.query.p;
    if (postId) {
      var post = Posts.findOne(postId);
      if (post) {
        //if not anonymous
        Meteor.subscribe('singleUser', post.userId);
        var o = Meteor.users.findOne(post.userId);
        if (o) {
          post.ownerName = o.profile.name;
          post.ownerSurname = o.profile.surname;
        }
        return post;
      } else {
        return false;
      }
    }
  },
  currentUserIsOwner: function() {
    var postId = Router.current().params.query.p;
    var post = Posts.findOne(postId);
    if (post)
    if(post.isAnonymous) {
      return post.userIdenticon == Package.sha.SHA256(post._id + Meteor.user()._id)
    } else {
      return post.userId == Meteor.user()._id;
    }
  },
  dateFromNow: function() {
    var post = Posts.findOne(Router.current().params.query.p);
    if (post) {
      if (post.updatedAt && post.createdAt.getTime() == post.updatedAt.getTime()) {
        // the post has never been edited
        return "posted " + moment(post.createdAt).fromNow();
      } else {
        return "updated " + moment(post.updatedAt).fromNow();
      }
    }
  },
  answers: function(){
    return Answers.find({postId: Router.current().params.query.p}, {sort: {isInstructor: -1, isInstructorUpvoted: -1, voteCount: -1, createdAt: 1}});
  },
  errorMessage: function(field) {
    var e = Session.get('answerSubmitErrors');
    if (e)
    return Session.get('answerSubmitErrors')[field];
    else
    return false;
  },
  isUserFollowing: function(){
    var postId = Router.current().params.query.p;
    var post = Posts.findOne(postId);
    if (post) {
      var followers = post.followers;
      var user = Meteor.user();
      if (user && followers && followers.length == 1) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  },
  isThereMathJax: function() {
    return /\$(.*?)\$/.test(this.text) || /\$\$(.*?)\$\$/.test(this.text);
  },
  upvoteButton: function(){
    var postId = Router.current().params.query.p;
    var post = Posts.findOne(postId);
    if (post) {
      var voters = post.upvoters;
      var user = Meteor.user();
      if (voters && user && voters.indexOf(user._id) != -1) {
        return 'btn-success';
      } else {
        return 'btn-default';
      }
    } else {
      return false;
    }
  },
  tags: function(){
    var postId = Router.current().params.query.p;
    var post = Posts.findOne(postId);
    if (post) {
      return post.tags;
    }else{
      return false;
    }
  },
  answerCount: function() {
    var count = Answers.find({postId: Router.current().params.query.p}).count();
    if (count == 1) {
      return "1 answer";
    } else {
      return count + " answers"
    }
  },
  usersLiveAnsweringCount: function() {
    var liveAnswer = LiveAnswers.findOne({postId: this._id});
    if (liveAnswer) {
      return LiveAnswers.findOne({postId: this._id}).usersLiveAnsweringCount;
    }
  },
  viewCount: function() {
    var post = Posts.findOne({_id: Router.current().params.query.p});
    if (post && post.viewCount == 1) {
      return "VIEWED 1 TIME";
    } else {
      if (post)
      return "VIEWED " + post.viewCount + " TIMES";
    }
  },
  draft: function() {
    var draft = Drafts.findOne({postId: Router.current().params.query.p, userId: Meteor.userId(), type: "answer"});
    if (draft) {
      return draft.body;
    } else {
      return "";
    }
  }
});

Template.postContent.events({
  'click #sendAnswerBtn': function(e) {
    var body = tinyMCE.get('answerTinyMCE').getContent();
    var answer = {
      body: body,
      postId: Router.current().params.query.p,
      isAnonymous: $('#isAnswerAnonymous').is(':checked')
    };
    if (strip_tags(body) == "") {
      var errors = {};
      errors.answerBody = "I know you're trying to be helpful, but an empty answer won't do much...";
      tinyMCE.get('answerTinyMCE').setContent("");
      tinymce.execCommand('mceFocus',false,'answerTinyMCE');
      return Session.set('answerSubmitErrors', errors);
    } else {
      Session.set('answerSubmitErrors', {});
    }

    Meteor.call('answerInsert', answer, function(error, answerId) {
      if (error){
        Session.set('answerSubmitErrors', {answerBody: error.reason});
        throw new Meteor.Error(error.reason);
      } else {
        tinyMCE.get('answerTinyMCE').setContent("");
        setTimeout(function () {

          //highlights syntax in answer
          $('#' + answerId + ' pre code').each(function(i, block) {
            hljs.highlightBlock(block);
          });

          if (!$("#"+answerId).visible()) {
            $('.post-content-wrapper').scrollTo("#"+answerId,1000);
          }

          Session.set('answerSubmitErrors', {});
        }, 100);

      }
    });
  },
  'click #saveDraftBtn': function(e) {
    var body = tinyMCE.get('answerTinyMCE').getContent();
    var answer = {
      body: body,
      postId: Router.current().params.query.p,
    };
    if (strip_tags(body) == "") {
      var errors = {};
      errors.answerBody = "There's nothing to save as a draft. Write something first.";
      tinyMCE.get('answerTinyMCE').setContent("");
      tinymce.execCommand('mceFocus',false,'answerTinyMCE');
      return Session.set('answerSubmitErrors', errors);
    }

    Meteor.call('saveAnswerDraft', answer, function(error, result) {
      if (error){
        Session.set('answerSubmitErrors', {answerBody: error.reason});
        throw new Meteor.Error(error.reason);
      } else {
        if (result) {
          $("#saveDraftBtn").html("Saved!");
          $("#saveDraftBtn").removeClass('btn-default').addClass('btn-success');
          setTimeout(function () {
            $("#saveDraftBtn").html("<i class=\"fa fa-floppy-o\"></i>");
            $("#saveDraftBtn").removeClass('btn-success').addClass('btn-default');
          }, 2000);
        }

      }
    });
  },
  'click #upvoteQuestion': function(e) {
    var id = Router.current().params.query.p;
    Meteor.call('upvotePost', id, function(error) {
      if (error){
        throw new Meteor.Error(error.reason);
      } else {
        //upvotes post's syntax highlighting
        $('.post-content-body pre code').each(function(i, block) {
          hljs.highlightBlock(block);
        });
      }
    });
  },
  'click #followQuestion': function(e){
    var id = Router.current().params.query.p;
    Meteor.call('followQuestion', id, function(error) {
      if (error){
        throw new Meteor.Error(error.reason);
      } else {
        //upvotes post's syntax highlighting
        $('.post-content-body pre code').each(function(i, block) {
          hljs.highlightBlock(block);
        });
      }
    });
  },
  'click #previewButton': function(e) {
    e.preventDefault();
    $("#previewTitle").text("Answer preview: ");
    $("#previewContent").html(tinyMCE.get('answerTinyMCE').getContent());

    $('#previewContent pre code').each(function(i, block) {
      hljs.highlightBlock(block);
    });
    MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
  },
  "click .post-list-toggle": function(event) {
    $('.postListContainer').toggleClass('slideLeft');
  },
  "click #openDeleteAnswerModal": function(event){
    Session.set("deleteAnswerId", $(event.currentTarget).data("id"));
  },
  "click #deleteCommentBtn": function(event){
    Session.set("deleteCommentId", {answerId: $(event.currentTarget).closest(".answer").attr('id'), commentId: $(event.currentTarget).data("id")});
  },
  "click #deleteAnswer": function(){
    var id = Session.get("deleteAnswerId");
    Meteor.call("answerDelete", id, function(error, result){
      if(error){
        console.log("error", error);
      }
      if(result){

      }
    });

    $("#modalDeleteAnswer").modal('hide');
  },
  "click #deleteComment": function(){
    var attr = Session.get("deleteCommentId");
    Meteor.call("commentDelete", attr.answerId, attr.commentId, function(error, result){
      if(error){
        console.log("error", error);
      }
      if(result){

      }
    });

    $("#modalDeleteComment").modal('hide');
  },
  "click #deletePost": function(){
    var id = Router.current().params.query.p;
    Meteor.call("postDelete", id, function(error, result){
      if(error){
        console.log("error", error);
      }
      if(result){

      }
    });

    Router.go('room', {courseId: Router.current().params.courseId});
  },
  "click .btn-tag": function(e){
    var filter = $(e.currentTarget).attr('data-filter');
    Session.set('postFilter', filter);
    if(Session.get('isTagFilter') == 1){
      Session.set('isTagFilter', 2);
    }else{
      Session.set('isTagFilter', 1);
    }
  }
});

Template.postContent.onRendered(function () {
  if (this.find('.answers-wrapper')) {
    this.find('.answers-wrapper')._uihooks = {
      insertElement: function (node, next) {
        $(node)
        .hide()
        .insertBefore(next)
        .fadeIn();
      },
      moveElement: function (node, next) {
        var $node = $(node), $next = $(next);
        var oldTop = $node.offset().top;
        var height = $(node).outerHeight(true);

        // find all the elements between next and node
        var $inBetween = $(next).nextUntil(node);
        if ($inBetween.length === 0)
        $inBetween = $(node).nextUntil(next);

        // now put node in place
        $(node).insertBefore(next);

        // measure new top
        var newTop = $(node).offset().top;

        // move node *back* to where it was before
        $(node)
        .removeClass('animate')
        .css('top', oldTop - newTop);

        // push every other element down (or up) to put them back
        $inBetween
        .removeClass('animate')
        .css('top', oldTop < newTop ? height : -1 * height)


        // force a redraw
        $(node).offset();

        // reset everything to 0, animated
        $(node).addClass('animate').css('top', 0);
        $inBetween.addClass('animate').css('top', 0);
      },
      removeElement: function(node) {
        $(node).fadeOut(function() {
          $(this).remove();
        });
      }
    }
  }
});


Template.answer.helpers({
  currentUserIsOwner: function() {
    //works for both answer and comment
    if(this.isAnonymous) {
      return this.userIdenticon == Package.sha.SHA256(this.postId + Meteor.user()._id)
    } else {
      return this.userId == Meteor.user()._id;
    }
  },
  isThereMathJax: function() {
    //works for both answer and comment
    return /\$(.*?)\$/.test(this.body) || /\$\$(.*?)\$\$/.test(this.body);
  },
  disabledVoteForOwner: function() {
    var currentUserIsOwner;
    if(this.isAnonymous) {
      currentUserIsOwner = this.userIdenticon == Package.sha.SHA256(this.postId + Meteor.user()._id)
    } else {
      currentUserIsOwner = this.userId == Meteor.user()._id;
    }

    if (currentUserIsOwner) {
      return "disabled";
    } else {
      return "";
    }
  },
  isAnonymousChecked: function() {
    //works for both answer and comment
    if(this.isAnonymous) {
      return "checked";
    } else {
      return "";
    }
  },
  theAuthor: function() {
    //works for both answer and comment
    var authorId = this.userId;
    Meteor.subscribe('singleUser', authorId);
    return Meteor.users.findOne(authorId);
  },
  dateFromNow: function() {
    return moment(this.createdAt).fromNow();
  },
  isAnswerUpvoted: function(){
    var answerId = this._id;
    var answer = Answers.findOne(answerId);
    if (answer) {
      var voters = answer.upvoters;
      var userId = Meteor.user()._id;
      if(voters && voters.length == 1){
        return 'btn-success';
      }else{
        return 'btn-default';
      }
    }
  }
});

Template.answer.events({
  'click #addCommentBtn': function(e) {
    //hide all other comments and edit forms
    var visible = $(".commentTinyMCE-wrapper[data-answer-id="+this._id+"]").visible();

    resetCommentsAndAnswersForms();

    if (visible) {
      $(".commentTinyMCE-wrapper[data-answer-id="+this._id+"]").hide();
    } else {
      $(".commentTinyMCE-wrapper[data-answer-id="+this._id+"]").show();
    }

    loadTinyMCE("commentTinyMCE-"+this._id, 150);
    tinymce.execCommand('mceFocus',false,"commentTinyMCE-"+this._id);
  },
  'click #sendCommentBtn': function (e) {
    var answerId = $(e.currentTarget).attr('data-answer-id');
    var selector = 'commentTinyMCE-'+answerId;
    var body = tinyMCE.get(selector).getContent();

    var comment = {
      body: body,
      answerId: answerId,
      isAnonymous:  $('#isCommentAnon-'+ answerId).is(':checked')
    };

    if (strip_tags(body) == "") {
      tinyMCE.get(selector).setContent("");
      tinymce.execCommand('mceFocus',false,selector);
      $(".commentTinyMCE-wrapper[data-answer-id="+answerId+"] .error").text("I'm sure this would be a very insightful comment... if it weren't empty.");
      return false;
    } else {
      $(".commentTinyMCE-wrapper[data-answer-id="+answerId+"] .error").text("");
    }

    Meteor.call('commentInsert', comment, function(error) {
      if (error){
        $(".commentTinyMCE-wrapper[data-answer-id="+answerId+"] .error").text(error.reason);
        throw new Meteor.Error(error.reason);
      } else {
        $(".commentTinyMCE-wrapper[data-answer-id="+answerId+"]").hide(700);
        tinyMCE.get(selector).setContent("");

        setTimeout(function () {
          //upvotes answer's syntax highlighting
          $(".answerBody[data-answer-id='"+answerId+"'] pre code").each(function(i, block) {
            hljs.highlightBlock(block);
          });
        }, 100);

      }
    });
  },
  'click .votingContainer button': function(e) {
    var answerId = $(e.currentTarget).parent().data('answer-id');

    Meteor.call('answerVote', answerId, function(error, result) {
      if(!error) {
        //upvotes answer's syntax highlighting
        $("#" + answerId + ' pre code').each(function(i, block) {
          hljs.highlightBlock(block);
        });

        setTimeout(function(){
          if (!$("#"+answerId).visible()) {
            $('.post-content-wrapper').scrollTo("#"+answerId,1000);
          }
        }, 300);
      }
    });
  },
  'click .editAnswerBtn': function(e) {
    var answerId = this._id;

    //hide all other comments and edit forms
    resetCommentsAndAnswersForms();

    $(".editAnswerBtn[data-answer-id="+answerId+"]").hide();
    $(".answerBody[data-answer-id="+answerId+"]").hide();
    $(".editAnswerTinyMCE-wrapper[data-answer-id="+answerId+"]").show();
    loadTinyMCE("editAnswerTinyMCE-"+answerId, 200);
  },
  'click #editCommentBtn': function(e) {
    var commentId = this._id;
    //hide all other comments and edit forms
    resetCommentsAndAnswersForms();

    $(".commentCtrlBtns[data-comment-id="+commentId+"]").hide();
    $(".commentBody[data-comment-id="+commentId+"]").hide();
    $(".editCommentTinyMCE-wrapper[data-comment-id="+commentId+"]").show();
    loadTinyMCE("editCommentTinyMCE-"+commentId, 150);
  },
  'click .updateAnswerBtn': function(e) {
    var answerId = $(e.currentTarget).attr('data-answer-id');
    var selector = 'editAnswerTinyMCE-'+answerId;
    var body = tinyMCE.get(selector).getContent();

    var answer = {
      answerId: answerId,
      body: body,
      postId: Router.current().params.query.p,
      isAnonymous: $('#isAnswerAnonymous-edit-'+answerId).is(':checked')
    };

    if (strip_tags(body) == "") {
      var errors = {};
      tinyMCE.get(selector).setContent("");
      tinymce.execCommand('mceFocus',false,selector);
      $(".editAnswerTinyMCE-wrapper[data-answer-id="+answerId+"] .error").text("I know you're trying to be helpful, but an empty answer won't do much...");
      return false;
    } else {
      $(".editAnswerTinyMCE-wrapper[data-answer-id="+answerId+"] .error").text("");
    }

    Meteor.call('answerUpdate', answer, function(error, answerId) {
      if (error){
        $(".editAnswerTinyMCE-wrapper[data-answer-id="+answerId+"] .error").text(error.reason);
        throw new Meteor.Error(error.reason);
      } else {
        setTimeout(function () {
          //upvotes answer's syntax highlighting
          $(".answerBody[data-answer-id='"+answerId+"'] pre code").each(function(i, block) {
            hljs.highlightBlock(block);
          });
        }, 100);

        $(".editAnswerBtn[data-answer-id="+answerId+"]").show();
        $(".answerBody[data-answer-id="+answerId+"]").show();
        $(".editAnswerTinyMCE-wrapper[data-answer-id="+answerId+"]").hide();
      }
    });
  },
  'click .updateCommentBtn': function(e) {
    var answerId = $(e.currentTarget).closest(".answer").attr('id');
    var commentId = $(e.currentTarget).attr('data-comment-id');
    var selector = 'editCommentTinyMCE-'+commentId;
    var body = tinyMCE.get(selector).getContent();

    var comment = {
      answerId: answerId,
      commentId: commentId,
      body: body,
      postId: Router.current().params.query.p,
      isAnonymous: $('#isCommentAnonymous-edit-'+commentId).is(':checked')
    };

    if (strip_tags(body) == "") {
      var errors = {};
      tinyMCE.get(selector).setContent("");
      tinymce.execCommand('mceFocus',false,selector);
      $(".editCommentTinyMCE-wrapper[data-comment-id="+commentId+"] .error").text("I'm sure this would be a very insightful comment... if it weren't empty.");
      return false;
    } else {
      $(".editCommentTinyMCE-wrapper[data-comment-id="+commentId+"] .error").text("");
    }

    Meteor.call('commentUpdate', comment, function(error, commentId) {
      if (error){
        $(".editCommentTinyMCE-wrapper[data-comment-id="+commentId+"] .error").text(error.reason);
        throw new Meteor.Error(error.reason);
      } else {
        setTimeout(function () {
          //upvotes comment's syntax highlighting
          $(".commentBody[data-comment-id='"+commentId+"'] pre code").each(function(i, block) {
            hljs.highlightBlock(block);
          });
        }, 100);

        $(".commentCtrlBtns[data-comment-id="+commentId+"]").show();
        $(".commentBody[data-comment-id="+commentId+"]").show();
        $(".editCommentTinyMCE-wrapper[data-comment-id="+commentId+"]").hide();
      }
    });
  },
  'click .cancelUpdateBtn': function(e) {
    // works for both answers and comments
    if ($(e.currentTarget).attr("data-answer-id")) {
      $(".editAnswerBtn[data-answer-id="+this._id+"]").show();
      $(".answerBody[data-answer-id="+this._id+"]").show();
      $(".editAnswerTinyMCE-wrapper[data-answer-id="+this._id+"]").hide();
    } else {
      $(".commentCtrlBtns[data-comment-id="+this._id+"]").show();
      $(".commentBody[data-comment-id="+this._id+"]").show();
      $(".editCommentTinyMCE-wrapper[data-comment-id="+this._id+"]").hide();
    }
  },
  'click .comment-preview': function(e) {
    e.preventDefault();
    $("#previewTitle").text("Comment preview: ");
    $("#previewContent").html(tinyMCE.get('commentTinyMCE-'+this._id).getContent());

    $('#previewContent pre code').each(function(i, block) {
      hljs.highlightBlock(block);
    });
  },
  'click .updateAnswerPreview': function(e){
    e.preventDefault();
    $("#previewTitle").text("Update answer preview: ");
    $("#previewContent").html(tinyMCE.get('editAnswerTinyMCE-'+this._id).getContent());

    $('#previewContent pre code').each(function(i, block) {
      hljs.highlightBlock(block);
    });
  },
  'click .updateCommentPreview': function(e){
    e.preventDefault();
    $("#previewTitle").text("Update comment preview: ");
    $("#previewContent").html(tinyMCE.get('editCommentTinyMCE-'+this._id).getContent());

    $('#previewContent pre code').each(function(i, block) {
      hljs.highlightBlock(block);
    });
    MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
  },
  'click a[data-post-id]': function(e) {
    e.preventDefault();
    var postId = $(e.currentTarget).attr('data-post-id');
    if (postId) {
      Router.go('room', {courseId: Router.current().params.courseId}, {query: 'p='+postId});
      loadPage(postId, false);
    }
  }
});


loadPage = function(postId, needsScroll) {
  console.log('hey');
  Session.set('answerSubmitErrors', {});
  Session.set('isLoadingPost', true);

  $(".post-content").hide();
  $('.item').removeClass('active');
  $("li[data-post-id="+ postId +"]").addClass('active');

  if(needsScroll && !$("li[data-post-id="+ postId +"]").visible() && $("li[data-post-id="+ postId +"]").offset()){
    $('.list-view-wrapper').scrollTop($("li[data-post-id="+ postId +"]").offset().top-92);
  }

  var postOpened = $('.post-opened');

  // $('.no-post').hide();
  // $('.post-content-wrapper').show();

  $(".post-content-wrapper").scrollTop(0);

  // Initialize post action menu
  $('.menuclipper').menuclipper({
    bufferWidth: 20
  });

  $('#slide-left').addClass('slideLeft');

  setTimeout(function () {
    $('pre code').each(function(i, block) {
      hljs.highlightBlock(block);
    });
  }, 100);

  var post = Posts.findOne({_id: postId});
  if(post){
    Session.set("DocumentTitle",  post.title + " | Ask");

    if(post.viewers && post.viewers.indexOf(Meteor.userId()) == -1){
      Meteor.call("viewPost", postId, function(error, result){
        if(error){
          console.log("error", error);
        }
        if(result){

        }
      });
    }
  }else {
    Session.set("DocumentTitle", "Ask");
  }

  if (!Answers.find({postId: postId}).count()) {
    console.log('subscribing');
    Meteor.subscribe('answers', postId);
  }

  Meteor.subscribe('liveAnswers', postId);

  Meteor.subscribe('draft', postId, "answer", {
    onReady: function() {
      loadTinyMCE("answerTinyMCE", 150);

      setTimeout(function(){
        var draft = Drafts.findOne({postId: postId, userId: Meteor.userId(), type: "answer"});
        if (draft && tinyMCE.get('answerTinyMCE')) {
          tinyMCE.get('answerTinyMCE').setContent(draft.body);
        } else {
          tinyMCE.get('answerTinyMCE').setContent("");
        }
      }, 500);
    }
  });

  setUserLastCourse();
  setTimeout(function () {
    $(".post-content").fadeIn("1500");
  }, 200);
}

function setUserLastCourse(){
  var currentCourseId = Router.current().params.courseId;
  if(Meteor.user().lastCourse != currentCourseId){
    Meteor.call("setLastCourse", currentCourseId, function(error, result){
      if(error){
        console.log("error", error);
      }
    });
  }
}

//removes all tags and whitespaces (&nbsp;)
strip_tags = function(input, allowed) {
  allowed = (((allowed || '') + '')
  .toLowerCase()
  .match(/<[a-z][a-z0-9]*>/g) || [])
  .join(''); // making sure the allowed arg is a string containing only tags in lowercase (<a><b><c>)
  var tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi,
  commentsAndPhpTags = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi;
  return input.replace(commentsAndPhpTags, '')
  .replace(tags, function($0, $1) {
    return allowed.indexOf('<' + $1.toLowerCase() + '>') > -1 ? $0 : '';
  }).replace(/&nbsp;/gi,'').replace(/\s+/g, ''); // removes spaces and &nbsp;
}

loadTinyMCE = function(selector, height) {
  //console.log('loadTinyMCE: ' + selector);
  try {
    tinyMCE.remove()
  } catch(e) {}

  function getTinyMCEconfig(selector, height) {
    return {
      selector: "#" + selector,
      plugins: "link, image, sh4tinymce, equationeditor, paste",
      min_height: height,
      content_css: '/tinymce/plugins/equationeditor/mathquill.css',
      menu: {},
      menubar: false,
      toolbar: "undo | redo | bold | italic | underline | bullist | numlist  | link | image | sh4tinymce | equationeditor",
      preview_styles: false,
      elementpath: false,
      paste_as_text: true,
      setup: function(editor) {
        if (selector == "answerTinyMCE") {
          editor.on('focus', function(e) {
            if (Answers.find({postId: Router.current().params.query.p, userId: Meteor.userId()},{limit:1}).count() > 0) {
              Session.set('answerSubmitErrors', {answerBody: "Are you sure you want to add another answer? You could use the edit button to refine and improve your existing answer, instead."});
            }
          });
          editor.on('keyup', _.throttle(function(e) {
            var postId = Router.current().params.query.p;
            //Meteor.call("liveAnswer", postId);
            var postId = Router.current().params.query.p;
            Meteor.call("liveAnswer", postId);
          }, 1500));
          editor.on('blur', function(e) {
            var body = tinyMCE.get('answerTinyMCE').getContent();
            if (body == "") {
              Session.set('answerSubmitErrors', {});
            }
          });
        }
      },
      init_instance_callback: function(editor) {
        var posts = Posts.find({'courseId': Router.current().params.courseId},{sort: {createdAt:-1}, fields: {_id: true, title: true, text: true, courseId: true}}).fetch();
        posts.forEach(function(post) {
          // stripping tags
          var dummyNode = document.createElement('div'),
          resultText = '';
          dummyNode.innerHTML = post.text;
          resultText = dummyNode.innerText || dummyNode.textContent
          if(resultText.length > 40){
            post.text = resultText.substring(0,40) + "…";
          }else{
            post.text = resultText;
          }
        })

        $(editor.contentDocument.activeElement).atwho({
          at: "#",
          data: posts,
          displayTpl: '<li>${title} <small>${text}</small></li>',
          insertTpl: '[<a data-post-id="${_id}" href="/room/${courseId}?p=${_id}">${title}</a>]',
          searchKey: "title",
          limit: posts.length
        });
      }
    }
  }

  //reload the answer for if editing answer or adding comment (it gets removed by loadTinyMCE)
  if (selector != "composeTinyMCE" && selector != "answerTinyMCE") {
    tinyMCE.init(getTinyMCEconfig("answerTinyMCE", 150));
  }
  tinyMCE.init(getTinyMCEconfig(selector, height));

}

function resetCommentsAndAnswersForms() {
  var answers = Answers.find({postId: Router.current().params.query.p},{fields:{_id:true, comments:true}}).fetch();
  answers.forEach(function(answer) {
    $(".commentTinyMCE-wrapper[data-answer-id="+answer._id+"]").hide();
    $(".editAnswerTinyMCE-wrapper[data-answer-id="+answer._id+"]").hide();
    $(".editAnswerBtn[data-answer-id="+answer._id+"]").show();
    $(".answerBody[data-answer-id="+answer._id+"]").show();
    $(".editAnswerTinyMCE-wrapper[data-answer-id="+answer._id+"]").hide();
    answer.comments.forEach(function(comment) {
      $(".commentCtrlBtns[data-comment-id="+comment._id+"]").show();
      $(".commentBody[data-comment-id="+comment._id+"]").show();
      $(".editCommentTinyMCE-wrapper[data-comment-id="+comment._id+"]").hide();
    })
  })
}
