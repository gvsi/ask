Template.postPage.rendered = function () {
  //builds the list only if there are posts

  if (!$("#no-post-error").length) {
    $("#postList").ioslist();
  }

  EasySearch.changeProperty('courseSearch', 'courseId', Router.current().params.courseId);
  mathquill();

  if ($(window).width() < 980) {
    $('.post-list').attr('id', 'slide-left');
  } else {
    $('.post-list').removeAttr('id', 'slide-left');
  }

  if (Router.current().params.query.p) {
    loadPage(Router.current().params.query.p, true);
  }else{
    var course = Courses.findOne(Router.current().params.courseId);
    if(course){
      Session.set("DocumentTitle",  course.name + " | Ask");
    }else{
      Session.set("DocumentTitle", "Ask");
    }

  }

  $(window).resize(function() {
    if ($(window).width() < 980) {
      $('.post-list').attr('id', 'slide-left');
    } else {
      $('.post-list').removeAttr('id', 'slide-left');
    }

    if ($(window).width() > 1024) {
      $('.post-list').length && $('.post-list').removeClass('slideLeft');
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
  var instructors = Courses.findOne(Router.current().params.courseId).instructors;

  instructors.forEach(function(instructor){
    if(instructor != Meteor.user().username.toLowerCase()){
      $('#instructorsInput').tagsinput('add', instructor);
    }
  })

  var cts = Session.get('customTags');
  if (cts) {
    cts.forEach(function(tag) {
      $('.custom-tag-input').tagsinput('add', tag);
    });
    Session.set('customTags', undefined)
    $('#customTagsForCourse').show();
  }
  // setTimeout(function () {
  //   //
  // }, 5000);
  // // $('[data-toggle="tooltip"]').tooltip();
  // // $(".list-view-wrapper [data-toggle=\"tooltip\"]").tooltip();
}

Template.registerHelper("isUserInstructor", function(){
  var currentCourse = Courses.findOne(Router.current().params.courseId);
  var un = Meteor.user().username.toLowerCase();
  if(currentCourse && (currentCourse.instructors.indexOf(un)!=-1)){
    return true;
  }else{
    return false;
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
    console.log("q="+this.post._id);
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
      isAdd: 1,
      tag: event.item
    };

    Meteor.call('addOrRemoveTag', tagAttributes, function(error, result) {});
  },
  "itemRemoved .custom-tag-input": function(event){
    var tagAttributes = {
      courseId: Router.current().params.courseId,
      isAdd: 0,
      tag: event.item
    };

    Meteor.call('addOrRemoveTag', tagAttributes, function(error, result) {});
  },
  "itemAdded #instructorsInput": function(event){
    var instructorAttributes = {
      courseId: Router.current().params.courseId,
      isAdd: 1,
      instructor: event.item
    };

    Meteor.call('addOrRemoveInstructor', instructorAttributes);
  },
  "itemRemoved #instructorsInput": function(event){
    var instructorAttributes = {
      courseId: Router.current().params.courseId,
      isAdd: 0,
      instructor: event.item
    };

    Meteor.call('addOrRemoveInstructor', instructorAttributes);
  }
});

Template.postList.events({
  'click .item': function(e) {
    $('.item').removeClass('active');
    $(e.currentTarget).addClass('active');
    var postId = $(e.currentTarget).attr('data-post-id');
    Router.go('room', {courseId: Router.current().params.courseId}, {query: 'p='+postId});
    Session.set("postId", postId);
    loadPage(postId, false);
  }
});

Template.postList.helpers({
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
    return Posts.find({'courseId': Router.current().params.courseId}).count() > 0;
  },
  postsByDate: function () {
    return Posts.find({'courseId': Router.current().params.courseId, createdAt: {$gte: this.start.toDate(), $lt: this.end.toDate()}}, {sort: {createdAt: -1}});
  }
})

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
      return "bg-warning-lighter";
    }
  }
});

Template.postContent.helpers({
  post: function() {
    var postId = Router.current().params.query.p;
    if (!postId) {
      $('.no-post').show();
      $('.post-content-wrapper').hide();
      return false;
    } else {
      var post = Posts.findOne(postId);

      if (post) {
        //if not anonymous
        Meteor.subscribe('singleUser', post.userId);
        var o = Meteor.users.findOne(post.userId);
        if (o) {
          post.ownerName = o.profile.name;
          post.ownerSurname = o.profile.surname;
        }
        // if (post.usersLiveAnswering) {
        //     post.usersLiveAnsweringCount = post.usersLiveAnswering.length;
        // }
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
  followButton: function(){
    var postId = Router.current().params.query.p;
    var post = Posts.findOne(postId);
    if (post) {
      var followers = post.followers;
      var user = Meteor.user();
      if (user && followers && followers.length == 1) {
        return 'btn-warning';
      } else {
        return 'btn-default';
      }
    } else {
      return false;
    }
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
    return this.usersLiveAnswering.length;
  },
  viewCount: function() {
      var post = Posts.findOne({_id: Router.current().params.query.p});
      if (post && post.viewCount == 1) {
        return "VIEWED 1 TIME";
      } else {
        if (post)
          return "VIEWED " + post.viewCount + " TIMES";
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

          // puts badges in the postList
          //$(".list-view-wrapper [data-toggle=\"tooltip\"]").tooltip();

          $('.post-content-wrapper').scrollTo("#"+answerId,1000);
          Session.set('answerSubmitErrors', {});
        }, 100);

      }
    });
  },
  'click #upvoteQuestion': function(e) {
    var id = Router.current().params.query.p;
    Meteor.call('upvote', id, function(error) {
      if (error){
        throw new Meteor.error(error.reason);
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
        throw new Meteor.error(error.reason);
      } else {
        //upvotes post's syntax highlighting
        $('.post-content-body pre code').each(function(i, block) {
          hljs.highlightBlock(block);
        });
      }
    });
  },
  "click .post-list-toggle": function(event) {
    $('.post-list').toggleClass('slideLeft');
  },
  "click #openDeleteAnswerModal": function(event){
    Session.set("deleteAnswerId", $(event.currentTarget).data("id"));
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
  }
});

Template.postContent.onRendered(function () {
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
});


Template.answer.helpers({
  currentUserIsOwner: function() {
    if(this.isAnonymous) {
      return this.userIdenticon == Package.sha.SHA256(this.postId + Meteor.user()._id)
    } else {
      return this.userId == Meteor.user()._id;
    }
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
  },
  createTooltip: function() {
    setTimeout(function(){
      //$('[data-toggle="tooltip"]').tooltip();
    }, 200);
  }
});

Template.answer.events({
  'click #addCommentBtn': function(e) {
    $(".commentTinyMCE-wrapper[data-answer-id="+this._id+"]").toggle();
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
          //$('[data-toggle="tooltip"]').tooltip();
        }, 300);
        //$('[data-toggle="tooltip"]').tooltip();
      }
    });
  },
  'click .editAnswerBtn': function(e) {
    var answerId = this._id;
    $(".editAnswerBtn[data-answer-id="+answerId+"]").hide();
    $(".answerBody[data-answer-id="+answerId+"]").hide();
    $(".editAnswerTinyMCE-wrapper[data-answer-id="+answerId+"]").show();
    loadTinyMCE("editAnswerTinyMCE-"+answerId, 200);
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
  'click .cancelUpdateBtn': function(e) {
    $(".editAnswerBtn[data-answer-id="+this._id+"]").show();
    $(".answerBody[data-answer-id="+this._id+"]").show();
    $(".editAnswerTinyMCE-wrapper[data-answer-id="+this._id+"]").hide();
  }
});


loadPage = function(postId, needsScroll) {
  Session.set('answerSubmitErrors', {});

  $('.item').removeClass('active');
  $("li[data-post-id="+ postId +"]").addClass('active');

  if(needsScroll && !$("li[data-post-id="+ postId +"]").visible() && $("li[data-post-id="+ postId +"]").offset()){
      $('.list-view-wrapper').scrollTop($("li[data-post-id="+ postId +"]").offset().top-92);
  }

  Meteor.subscribe('answers', postId);
  Meteor.subscribe('singlePost', postId, {
    onReady: function() {
      var postOpened = $('.post-opened');

      $('.no-post').hide();
      $('.post-content-wrapper').show();

      loadTinyMCE("answerTinyMCE", 150);

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

        if(post.viewers.indexOf(Meteor.userId()) == -1){
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

      //$('[data-toggle="tooltip"]').tooltip();

    }
  }
);
}

//removes all tags and whitespaces (&nbsp;)
function strip_tags(input, allowed) {
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
  tinymce.EditorManager.execCommand('mceRemoveEditor',true, selector);
  tinymce.init({
    selector: "#" + selector,
    plugins: "link , image, sh4tinymce, equationeditor",
    min_height: height,
    content_css: '/tinymce/plugins/equationeditor/mathquill.css',
    menu: {},
    menubar: false,
    toolbar: "undo | redo | bold | italic | underline | alignleft | aligncenter | alignright | alignjustify | link | unlink | image | sh4tinymce | equationeditor |",
    preview_styles: false,
    elementpath: false,
    setup: function(editor) {
        if (selector == "answerTinyMCE") {
          editor.on('focus', function(e) {
              console.log('focus');
              if (Answers.find({postId: Router.current().params.query.p, userId: Meteor.userId()},{limit:1}).count() > 0) {
                Session.set('answerSubmitErrors', {answerBody: "Are you sure you want to add another answer? You could use the edit button to refine and improve your existing answer, instead."});
              }
          });
          editor.on('keyup', _.throttle(function(e) {
              var postId = Router.current().params.query.p;
              //Meteor.call("liveAnswer", postId);
              console.log('change');
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
    }
  });
}
