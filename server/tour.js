{
	"answersCount" : 2,
	"badges" : {
		"hasStudentAnswer" : true
	},
	"courseId" : "JmDNqcQhivTjcrNrT",
	"createdAt" : ISODate("2015-08-18T16:37:33.890Z"),
	"followers" : [
		"zpWCsxeMLkYayvE84"
	],
	"isAnonymous" : false,
	"isDeleted" : false,
	"responseTime" : 0,
	"tags" : [ ],
	"text" : "<p>Good job on making it here!</p>\n<p>Hope you're finding Ask just alright.</p>\n<p>&nbsp;</p>\n<p>This is a sample question.</p>",
	"title" : "Welcome to Ask's Virtual Tour!",
	"type" : 1,
	"updatedAt" : ISODate("2015-08-18T16:37:33.890Z"),
	"upvoters" : [ ],
	"upvotesCount" : 0,
	"userId" : "zpWCsxeMLkYayvE84",
	"userIdenticon" : "cb14fc7950c2dfc95dda17f6d7a77de2791bdc452c736ab71ca87202d6f77ed5",
	"usersLiveAnswering" : [ ],
	"viewCount" : 2,
	"viewers" : [
		"zpWCsxeMLkYayvE84",
		"pjAyjJwdy2QzsAevo"
	]
}
> db.posts.find({_id:"xveigwzFR8Fxk9ERL", isDeleted: true},{_id: false, revisionHistory: false}).pretty()
> db.posts.find({_id:"xveigwzFR8Fxk9ERL", isDeleted: false},{_id: false, revisionHistory: false}).pretty()
{
	"answersCount" : 2,
	"badges" : {
		"hasStudentAnswer" : true
	},
	"courseId" : "JmDNqcQhivTjcrNrT",
	"createdAt" : ISODate("2015-08-18T16:37:33.890Z"),
	"followers" : [
		"zpWCsxeMLkYayvE84"
	],
	"isAnonymous" : false,
	"isDeleted" : false,
	"responseTime" : 0,
	"tags" : [ ],
	"text" : "<p>Good job on making it here!</p>\n<p>Hope you're finding Ask just alright.</p>\n<p>&nbsp;</p>\n<p>This is a sample question.</p>",
	"title" : "Welcome to Ask's Virtual Tour!",
	"type" : 1,
	"updatedAt" : ISODate("2015-08-18T16:37:33.890Z"),
	"upvoters" : [ ],
	"upvotesCount" : 0,
	"userId" : "zpWCsxeMLkYayvE84",
	"userIdenticon" : "cb14fc7950c2dfc95dda17f6d7a77de2791bdc452c736ab71ca87202d6f77ed5",
	"usersLiveAnswering" : [ ],
	"viewCount" : 2,
	"viewers" : [
		"zpWCsxeMLkYayvE84",
		"pjAyjJwdy2QzsAevo"
	]
}
> db.posts.find({_id:"xveigwzFR8Fxk9ERL"},{_id: false, revisionHistory: false}).count()
1
> db.posts.find({courseId:"JmDNqcQhivTjcrNrT", isDeleted: false},{_id: false, revisionHistory: false}).pretty()
{
	"answersCount" : 3,
	"badges" : {
		"hasStudentAnswer" : true
	},
	"courseId" : "JmDNqcQhivTjcrNrT",
	"createdAt" : ISODate("2015-08-18T15:36:30.092Z"),
	"followers" : [
		"pjAyjJwdy2QzsAevo"
	],
	"isAnonymous" : false,
	"isDeleted" : false,
	"responseTime" : 2,
	"tags" : [ ],
	"text" : "<p>It's a great feature to get to see which questions are interesting and which answers are more relevant to the question asked.</p>\n<p>&nbsp;</p>\n<p>Just look on the top right corner of the question, the upvote count is right there (you can't upvote your own question)</p>",
	"title" : "Do you like the upvoting system?",
	"type" : 1,
	"updatedAt" : ISODate("2015-08-18T15:37:29.988Z"),
	"upvoters" : [
		"zpWCsxeMLkYayvE84"
	],
	"upvotesCount" : 1,
	"userId" : "pjAyjJwdy2QzsAevo",
	"userIdenticon" : "88f44225a09259de2d51d7448b7ed8d534308b01caa69cd7e72fdd9d448040aa",
	"usersLiveAnswering" : [ ],
	"viewCount" : 2,
	"viewers" : [
		"pjAyjJwdy2QzsAevo",
		"zpWCsxeMLkYayvE84"
	]
}
{
	"answersCount" : 1,
	"badges" : {
		"hasStudentAnswer" : true
	},
	"courseId" : "JmDNqcQhivTjcrNrT",
	"createdAt" : ISODate("2015-08-18T16:03:35.842Z"),
	"followers" : [
		"pjAyjJwdy2QzsAevo"
	],
	"isAnonymous" : false,
	"isDeleted" : false,
	"responseTime" : 5,
	"tags" : [ ],
	"text" : "<p>They look pretty sleek, and I'd like to know what they are for.</p>",
	"title" : "What are these round badges in the question lists?",
	"type" : 1,
	"updatedAt" : ISODate("2015-08-18T16:09:47.661Z"),
	"upvoters" : [ ],
	"upvotesCount" : 0,
	"userId" : "pjAyjJwdy2QzsAevo",
	"userIdenticon" : "88f44225a09259de2d51d7448b7ed8d534308b01caa69cd7e72fdd9d448040aa",
	"usersLiveAnswering" : [ ],
	"viewCount" : 2,
	"viewers" : [
		"pjAyjJwdy2QzsAevo",
		"zpWCsxeMLkYayvE84"
	]
}
{
	"answersCount" : 0,
	"courseId" : "JmDNqcQhivTjcrNrT",
	"createdAt" : ISODate("2015-08-18T16:06:36.328Z"),
	"followers" : [
		"pjAyjJwdy2QzsAevo"
	],
	"isAnonymous" : false,
	"isDeleted" : false,
	"tags" : [ ],
	"text" : "<p>You can access our search system by clicking on the search field in the header.</p>\n<p>It allows users to search for words and phrases in the title and the content of questions.</p>\n<p>You can search in the current course you have opened or all of the courses you are taking.</p>\n<p>The search results are fetched live while typing, so you don't even have to press enter!&nbsp;</p>",
	"title" : "We are all searching for something, aren't we?",
	"type" : 1,
	"updatedAt" : ISODate("2015-08-18T16:07:56.888Z"),
	"upvoters" : [ ],
	"upvotesCount" : 0,
	"userId" : "pjAyjJwdy2QzsAevo",
	"userIdenticon" : "88f44225a09259de2d51d7448b7ed8d534308b01caa69cd7e72fdd9d448040aa",
	"viewCount" : 2,
	"viewers" : [
		"pjAyjJwdy2QzsAevo",
		"zpWCsxeMLkYayvE84"
	]
}
{
	"answersCount" : 0,
	"courseId" : "JmDNqcQhivTjcrNrT",
	"createdAt" : ISODate("2015-08-18T16:35:33.094Z"),
	"followers" : [
		"zpWCsxeMLkYayvE84"
	],
	"isAnonymous" : false,
	"isDeleted" : false,
	"tags" : [ ],
	"text" : "<p>We hope it's been a pleasant experience.</p>\n<p>&nbsp;</p>\n<p>Feel free to play around the platform as much as you want.</p>\n<p>&nbsp;</p>\n<p>Also, do leave your comments/feedback here, report bugs or request features&nbsp;<span style=\"letter-spacing: 0.140000000596046px;\">(or just email us)</span><span style=\"letter-spacing: 0.01em;\">.</span></p>\n<p><span style=\"letter-spacing: 0.01em;\">We'll try to get back to you as soon as we can.</span></p>\n<p>&nbsp;</p>\n<p><span style=\"letter-spacing: 0.01em;\">Talk to you later.</span></p>\n<p>&nbsp;</p>\n<p>Giovanni and Martin</p>",
	"title" : "Thank you for taking Ask's Virtual Tour!",
	"type" : 1,
	"updatedAt" : ISODate("2015-08-18T21:36:24.054Z"),
	"upvoters" : [ ],
	"upvotesCount" : 0,
	"userId" : "zpWCsxeMLkYayvE84",
	"userIdenticon" : "cb14fc7950c2dfc95dda17f6d7a77de2791bdc452c736ab71ca87202d6f77ed5",
	"viewCount" : 2,
	"viewers" : [
		"zpWCsxeMLkYayvE84",
		"pjAyjJwdy2QzsAevo"
	]
}
{
	"answersCount" : 1,
	"badges" : {
		"hasStudentAnswer" : true
	},
	"courseId" : "JmDNqcQhivTjcrNrT",
	"createdAt" : ISODate("2015-08-18T15:06:47.816Z"),
	"followers" : [
		"pjAyjJwdy2QzsAevo"
	],
	"isAnonymous" : false,
	"isDeleted" : false,
	"responseTime" : 23,
	"tags" : [ ],
	"text" : "<p>I'd like to post as anonymous, but I don't know how?</p>",
	"title" : "How do I post as anonymous?",
	"type" : 1,
	"updatedAt" : ISODate("2015-08-18T15:09:35.827Z"),
	"upvoters" : [ ],
	"upvotesCount" : 0,
	"userId" : "pjAyjJwdy2QzsAevo",
	"userIdenticon" : "88f44225a09259de2d51d7448b7ed8d534308b01caa69cd7e72fdd9d448040aa",
	"usersLiveAnswering" : [ ],
	"viewCount" : 2,
	"viewers" : [
		"pjAyjJwdy2QzsAevo",
		"zpWCsxeMLkYayvE84"
	]
}
{
	"answersCount" : 0,
	"courseId" : "JmDNqcQhivTjcrNrT",
	"createdAt" : ISODate("2015-08-18T15:08:09.710Z"),
	"followers" : [
		"pjAyjJwdy2QzsAevo"
	],
	"isAnonymous" : false,
	"isDeleted" : false,
	"tags" : [
		"wk3",
		"wk8",
		"wk11",
		"logistics",
		"exam"
	],
	"text" : "<p style=\"text-align: left;\">Look at this: it's just fancy! You can also edit a question or answer after you posted it, if you noticed a typo or just want to make it as pretty as this one.</p>\n<p style=\"text-align: center;\"><br /><img src=\"http://smart.inf.ed.ac.uk/wp-content/uploads/2013/10/EdinburghUniLogo.png\" alt=\"\" width=\"204\" height=\"199\" /><br /><br />Some sample justified text:</p>\n<p style=\"text-align: left;\">&nbsp;</p>\n<p style=\"text-align: justify;\"><em>Monotonectally embrace real-time content</em> whereas fully researched technologies. Competently optimize virtual results and distributed total linkage. Holisticly integrate interoperable customer service whereas go forward services. <span style=\"text-decoration: underline;\">Efficiently implement enabled relationships with value-added catalysts for change.</span> Monotonectally actualize bleeding-edge vortals and <strong>best-of-breed markets.</strong></p>\n<p style=\"text-align: justify;\">&nbsp;</p>\n<p style=\"text-align: justify;\">Synergistically <a href=\"https://www.youtube.com/watch?v=dQw4w9WgXcQ\">coordinate virtual supply chains</a> vis-a-vis excellent e-business. Progressively unleash cutting-edge initiatives for real-time data. Distinctively enable enabled results with interactive customer service. Synergistically supply mission-critical potentialities before excellent internal or \"organic\" sources. Completely embrace front-end internal or \"organic\" sources before seamless infrastructures.</p>\n<p style=\"text-align: justify;\">&nbsp;</p>\n<p style=\"text-align: right;\"><strong>Maybe some right alignment?</strong></p>\n<p style=\"text-align: left;\"><strong>&nbsp;⇩Some tags&nbsp;&nbsp;</strong></p>",
	"title" : "Make your questions and notes look beautiful",
	"type" : 1,
	"updatedAt" : ISODate("2015-08-18T15:48:30.918Z"),
	"upvoters" : [ ],
	"upvotesCount" : 0,
	"userId" : "pjAyjJwdy2QzsAevo",
	"userIdenticon" : "88f44225a09259de2d51d7448b7ed8d534308b01caa69cd7e72fdd9d448040aa",
	"viewCount" : 2,
	"viewers" : [
		"pjAyjJwdy2QzsAevo",
		"zpWCsxeMLkYayvE84"
	]
}
{
	"answersCount" : 0,
	"courseId" : "JmDNqcQhivTjcrNrT",
	"createdAt" : ISODate("2015-08-18T15:59:28.605Z"),
	"followers" : [
		"pjAyjJwdy2QzsAevo"
	],
	"isAnonymous" : false,
	"isDeleted" : false,
	"tags" : [ ],
	"text" : "<p>Ask is reactive.</p>\n<p>Everything is reactive. You won't need that refresh button on your keyboard anymore.</p>\n<p>&nbsp;</p>\n<p><strong>Someone just posted a question</strong>? It will appear&nbsp;automagically in the sidebar (it will be marked unread so that you know it just popped up).</p>\n<p><strong>Someone just answered your question</strong>? Besides receiving a notification on the side, you will see the answer appear on the question without refreshing the page.</p>\n<p><strong>Someone is writing an answer to your question</strong>? You will have a live feedback at the bottom of the post, similar to this one:</p>\n<p>&nbsp;</p>\n<div class=\"panel-title text-complete\" style=\"box-sizing: border-box; margin: 0px; font-size: 12px; font-family: Montserrat; text-transform: uppercase; display: inline-block; letter-spacing: 0.02em; font-weight: 600; padding: 0px; overflow: hidden; text-overflow: ellipsis; transition: opacity 0.3s ease; color: #48b0f7 !important;\">&nbsp;</div>\n<div class=\"panel-title text-complete\" style=\"box-sizing: border-box; margin: 0px; font-size: 12px; font-family: Montserrat; text-transform: uppercase; display: inline-block; letter-spacing: 0.02em; font-weight: 600; padding: 0px; overflow: hidden; text-overflow: ellipsis; transition: opacity 0.3s ease; color: #48b0f7 !important;\">&nbsp;</div>\n<div class=\"panel-title text-complete\" style=\"box-sizing: border-box; margin: 0px; font-size: 12px; font-family: Montserrat; text-transform: uppercase; display: inline-block; letter-spacing: 0.02em; font-weight: 600; padding: 0px; overflow: hidden; text-overflow: ellipsis; transition: opacity 0.3s ease; color: #48b0f7 !important;\">&nbsp; &nbsp; 1&nbsp;USER IS CURRENTLY WRITING AN ANSWER...</div>\n<div class=\"panel-title text-complete\" style=\"box-sizing: border-box; margin: 0px; font-size: 12px; font-family: Montserrat; text-transform: uppercase; display: inline-block; letter-spacing: 0.02em; font-weight: 600; padding: 0px; overflow: hidden; text-overflow: ellipsis; transition: opacity 0.3s ease; color: #48b0f7 !important;\">&nbsp;</div>\n<p>&nbsp;</p>\n<p>A lot more is reactive, from upvote counts, to course stats, to time stamps, to answers, comments, questions and edits. It's all synced real-time with the database.</p>\n<p>&nbsp;</p>\n<p>Pretty cool, huh?</p>",
	"title" : "How do you make a website reactive like Ask?",
	"type" : 1,
	"updatedAt" : ISODate("2015-08-18T16:02:47.325Z"),
	"upvoters" : [ ],
	"upvotesCount" : 0,
	"userId" : "pjAyjJwdy2QzsAevo",
	"userIdenticon" : "88f44225a09259de2d51d7448b7ed8d534308b01caa69cd7e72fdd9d448040aa",
	"viewCount" : 2,
	"viewers" : [
		"pjAyjJwdy2QzsAevo",
		"zpWCsxeMLkYayvE84"
	]
}
{
	"answersCount" : 0,
	"courseId" : "JmDNqcQhivTjcrNrT",
	"createdAt" : ISODate("2015-08-18T14:50:10.654Z"),
	"followers" : [
		"pjAyjJwdy2QzsAevo"
	],
	"isAnonymous" : false,
	"isDeleted" : false,
	"tags" : [ ],
	"text" : "<p>LaTeX is a high-quality typesetting system; it includes features designed for the production of technical and scientific documentation. LaTeX is the de facto standard for the communication and publication of scientific documents.</p>\n<p>&nbsp;</p>\n<p>We render formulae using <a href=\"https://www.mathjax.org/\">MathJax</a>.</p>\n<p>You can put formulae like this:</p>\n<p>&nbsp;</p>\n<p>$F(x,y)=0 ~~\\mbox{and}~~ \\left| \\begin{array}{ccc} F''_{xx} &amp; F''_{xy} &amp; F'_x \\\\ F''_{yx} &amp; F''_{yy} &amp; F'_y \\\\ F'_x &amp; F'_y &amp; 0 \\end{array}\\right| = 0$</p>\n<p>&nbsp;</p>\n<p>or this</p>\n<p>&nbsp;</p>\n<p>$ \\underbrace{n(n-1)(n-2)\\dots(n-m+1)}_ {\\mbox{total of $m$ factors}} $</p>\n<p>&nbsp;</p>\n<p>&nbsp;</p>\n<p>or even this</p>\n<p>&nbsp;</p>\n<p>$ \\underbrace{a+\\overbrace{b+\\cdots}^{{}=t}+z} _{\\mathrm{total}} ~~ a+{\\overbrace{b+\\cdots}}^{126}+z $</p>\n<p>&nbsp;</p>\n<p>through our editor.</p>\n<p>&nbsp;</p>\n<p>Just try it with an answer!</p>\n<p>Get some formulas going!</p>",
	"title" : "Did you check LaTeX rendering?",
	"type" : 1,
	"updatedAt" : ISODate("2015-08-18T16:15:40.447Z"),
	"upvoters" : [ ],
	"upvotesCount" : 0,
	"userId" : "pjAyjJwdy2QzsAevo",
	"userIdenticon" : "88f44225a09259de2d51d7448b7ed8d534308b01caa69cd7e72fdd9d448040aa",
	"viewCount" : 1,
	"viewers" : [
		"pjAyjJwdy2QzsAevo"
	]
}
{
	"answersCount" : 0,
	"courseId" : "JmDNqcQhivTjcrNrT",
	"createdAt" : ISODate("2015-08-18T14:55:03.322Z"),
	"followers" : [
		"pjAyjJwdy2QzsAevo"
	],
	"isAnonymous" : false,
	"isDeleted" : false,
	"tags" : [ ],
	"text" : "<p>It just looks great, doesn't it?</p>\n<p>Our editor has Insert code function. Just paste your code in there, select the language or \"Automatic Language Detection\" and our employees&nbsp;in the back-end we'll read it and colour it neatly.</p>\n<p>&nbsp;&nbsp;</p>\n<pre><code class=\"java\">/**\n * @author John Smith &lt;john.smith@example.com&gt;\n * @version 1.0\n*/\npackage l2f.gameserver.model;\n\nimport java.util.ArrayList;\n\npublic abstract class L2Character extends L2Object {\n  public static final Short ABNORMAL_EFFECT_BLEEDING = 0x0_0_0_1; // not sure\n\n  public void moveTo(int x, int y, int z) {\n    _ai = null;\n    _log.warning(\"Should not be called\");\n    if (1 &gt; 5) {\n      return;\n    }\n  }\n\n  /** Task of AI notification */\n  @SuppressWarnings( { \"nls\", \"unqualified-field-access\", \"boxing\" })\n  public class NotifyAITask implements Runnable {\n    private final CtrlEvent _evt;\n\n    List&lt;String&gt; mList = new ArrayList&lt;String&gt;()\n\n    public void run() {\n      try {\n        getAI().notifyEvent(_evt, _evt.class, null);\n      } catch (Throwable t) {\n        t.printStackTrace();\n      }\n    }\n  }\n}<br /></code></pre>\n<p>&nbsp;</p>\n<p>&nbsp;<em style=\"letter-spacing: 0.01em;\">P.S.</em></p>\n<p>Did you know what's the object-oriented way to become wealthy?&nbsp;<strong>Inheritance</strong>.</p>\n<p>&nbsp;</p>",
	"title" : "Why does code look good with syntax highlighting ?",
	"type" : 1,
	"updatedAt" : ISODate("2015-08-18T16:17:13.696Z"),
	"upvoters" : [ ],
	"upvotesCount" : 0,
	"userId" : "pjAyjJwdy2QzsAevo",
	"userIdenticon" : "88f44225a09259de2d51d7448b7ed8d534308b01caa69cd7e72fdd9d448040aa",
	"viewCount" : 2,
	"viewers" : [
		"pjAyjJwdy2QzsAevo",
		"zpWCsxeMLkYayvE84"
	]
}
{
	"answersCount" : 0,
	"courseId" : "JmDNqcQhivTjcrNrT",
	"createdAt" : ISODate("2015-08-18T16:20:29.647Z"),
	"followers" : [
		"pjAyjJwdy2QzsAevo"
	],
	"isAnonymous" : false,
	"isDeleted" : false,
	"tags" : [ ],
	"text" : "<p>On the course front page you can get tonnes of information and insights about it.</p>\n<p>Some of the data provided includes:</p>\n<p>&nbsp; &nbsp; &nbsp; - The number of online users at the moment.</p>\n<p>&nbsp; &nbsp; &nbsp; - The number of online instructors at the moment.</p>\n<p>&nbsp; &nbsp; &nbsp; - The number of unread posts.</p>\n<p>&nbsp; &nbsp; &nbsp; - The number of unanswered questions.</p>\n<p>&nbsp; &nbsp; &nbsp; - The number of total posts on the platform.</p>\n<p>&nbsp; &nbsp; &nbsp; - The number of total contributions/answeres.</p>\n<p>&nbsp; &nbsp; &nbsp; - The number of instructors responses.</p>\n<p>&nbsp; &nbsp; &nbsp; - The number of student responses.</p>\n<p>&nbsp; &nbsp; &nbsp; - The average response time.</p>\n<p>&nbsp;</p>\n<p>As anything else in the platform, this data is live and you don't need to refresh in order to see changes happening!</p>\n<p>&nbsp;</p>",
	"title" : "How much course data do we have?",
	"type" : 1,
	"updatedAt" : ISODate("2015-08-18T16:27:58.940Z"),
	"upvoters" : [ ],
	"upvotesCount" : 0,
	"userId" : "pjAyjJwdy2QzsAevo",
	"userIdenticon" : "88f44225a09259de2d51d7448b7ed8d534308b01caa69cd7e72fdd9d448040aa",
	"viewCount" : 2,
	"viewers" : [
		"pjAyjJwdy2QzsAevo",
		"zpWCsxeMLkYayvE84"
	]
}
{
	"answersCount" : 1,
	"badges" : {
		"hasStudentAnswer" : true
	},
	"courseId" : "JmDNqcQhivTjcrNrT",
	"createdAt" : ISODate("2015-08-18T16:23:50.891Z"),
	"followers" : [
		"pjAyjJwdy2QzsAevo"
	],
	"isAnonymous" : false,
	"isDeleted" : false,
	"responseTime" : 2,
	"tags" : [ ],
	"text" : "<p>Certainly the developers didn't want to give instructors additional burden in setting up this platform, how did they do it?</p>",
	"title" : "How do instructors set up their courses in an intuitive way?",
	"type" : 1,
	"updatedAt" : ISODate("2015-08-18T16:26:15.679Z"),
	"upvoters" : [ ],
	"upvotesCount" : 0,
	"userId" : "pjAyjJwdy2QzsAevo",
	"userIdenticon" : "88f44225a09259de2d51d7448b7ed8d534308b01caa69cd7e72fdd9d448040aa",
	"usersLiveAnswering" : [ ],
	"viewCount" : 2,
	"viewers" : [
		"pjAyjJwdy2QzsAevo",
		"zpWCsxeMLkYayvE84"
	]
}
{
	"answersCount" : 0,
	"courseId" : "JmDNqcQhivTjcrNrT",
	"createdAt" : ISODate("2015-08-18T15:38:31.850Z"),
	"followers" : [
		"pjAyjJwdy2QzsAevo"
	],
	"isAnonymous" : false,
	"isDeleted" : false,
	"tags" : [ ],
	"text" : "<p>Just answer this question with your instructor's&nbsp;account and see the magic in action.</p>\n<p>&nbsp;</p>\n<p>You will receive a notification when:<br />&nbsp; &nbsp; &nbsp; &nbsp;- Someone answers your question.<br />&nbsp; &nbsp; &nbsp; &nbsp;- Someone answers a question you are following (did we mention users can follow questions they want to be updated on?).<br />&nbsp; &nbsp; &nbsp; &nbsp;- An instructor posts a Note on a course that you are&nbsp;taking.</p>\n<p>&nbsp;</p>\n<p>We've set you up with both a student account and an instructor account. Just play with them a little bit if you wish and get some notifications going.</p>\n<p><br /><em>P.S. If you miss the actual notification pop-up you can still see it&nbsp;by clicking the globe button on the header!</em></p>",
	"title" : "Fancy some notifications?",
	"type" : 1,
	"updatedAt" : ISODate("2015-08-18T16:36:58.987Z"),
	"upvoters" : [ ],
	"upvotesCount" : 0,
	"userId" : "pjAyjJwdy2QzsAevo",
	"userIdenticon" : "88f44225a09259de2d51d7448b7ed8d534308b01caa69cd7e72fdd9d448040aa",
	"usersLiveAnswering" : [ ],
	"viewCount" : 2,
	"viewers" : [
		"pjAyjJwdy2QzsAevo",
		"zpWCsxeMLkYayvE84"
	]
}
{
	"answersCount" : 2,
	"badges" : {
		"hasStudentAnswer" : true
	},
	"courseId" : "JmDNqcQhivTjcrNrT",
	"createdAt" : ISODate("2015-08-18T16:37:33.890Z"),
	"followers" : [
		"zpWCsxeMLkYayvE84"
	],
	"isAnonymous" : false,
	"isDeleted" : false,
	"responseTime" : 0,
	"tags" : [ ],
	"text" : "<p>Good job on making it here!</p>\n<p>Hope you're finding Ask just alright.</p>\n<p>&nbsp;</p>\n<p>This is a sample question.</p>",
	"title" : "Welcome to Ask's Virtual Tour!",
	"type" : 1,
	"updatedAt" : ISODate("2015-08-18T16:37:33.890Z"),
	"upvoters" : [ ],
	"upvotesCount" : 0,
	"userId" : "zpWCsxeMLkYayvE84",
	"userIdenticon" : "cb14fc7950c2dfc95dda17f6d7a77de2791bdc452c736ab71ca87202d6f77ed5",
	"usersLiveAnswering" : [ ],
	"viewCount" : 2,
	"viewers" : [
		"zpWCsxeMLkYayvE84",
		"pjAyjJwdy2QzsAevo"
	]
}
> db.posts.find({courseId:"JmDNqcQhivTjcrNrT", isDeleted: false},{_id: false, revisionHistory: false}).count()
13
> db.posts.find({courseId:"JmDNqcQhivTjcrNrT", isDeleted: false},{_id: false, revisionHistory: false}).pretty()
{
	"answersCount" : 3,
	"badges" : {
		"hasStudentAnswer" : true
	},
	"courseId" : "JmDNqcQhivTjcrNrT",
	"createdAt" : ISODate("2015-08-18T15:36:30.092Z"),
	"followers" : [
		"pjAyjJwdy2QzsAevo"
	],
	"isAnonymous" : false,
	"isDeleted" : false,
	"responseTime" : 2,
	"tags" : [ ],
	"text" : "<p>It's a great feature to get to see which questions are interesting and which answers are more relevant to the question asked.</p>\n<p>&nbsp;</p>\n<p>Just look on the top right corner of the question, the upvote count is right there (you can't upvote your own question)</p>",
	"title" : "Do you like the upvoting system?",
	"type" : 1,
	"updatedAt" : ISODate("2015-08-18T15:37:29.988Z"),
	"upvoters" : [
		"zpWCsxeMLkYayvE84"
	],
	"upvotesCount" : 1,
	"userId" : "pjAyjJwdy2QzsAevo",
	"userIdenticon" : "88f44225a09259de2d51d7448b7ed8d534308b01caa69cd7e72fdd9d448040aa",
	"usersLiveAnswering" : [ ],
	"viewCount" : 2,
	"viewers" : [
		"pjAyjJwdy2QzsAevo",
		"zpWCsxeMLkYayvE84"
	]
}
{
	"answersCount" : 1,
	"badges" : {
		"hasStudentAnswer" : true
	},
	"courseId" : "JmDNqcQhivTjcrNrT",
	"createdAt" : ISODate("2015-08-18T16:03:35.842Z"),
	"followers" : [
		"pjAyjJwdy2QzsAevo"
	],
	"isAnonymous" : false,
	"isDeleted" : false,
	"responseTime" : 5,
	"tags" : [ ],
	"text" : "<p>They look pretty sleek, and I'd like to know what they are for.</p>",
	"title" : "What are these round badges in the question lists?",
	"type" : 1,
	"updatedAt" : ISODate("2015-08-18T16:09:47.661Z"),
	"upvoters" : [ ],
	"upvotesCount" : 0,
	"userId" : "pjAyjJwdy2QzsAevo",
	"userIdenticon" : "88f44225a09259de2d51d7448b7ed8d534308b01caa69cd7e72fdd9d448040aa",
	"usersLiveAnswering" : [ ],
	"viewCount" : 2,
	"viewers" : [
		"pjAyjJwdy2QzsAevo",
		"zpWCsxeMLkYayvE84"
	]
}
{
	"answersCount" : 0,
	"courseId" : "JmDNqcQhivTjcrNrT",
	"createdAt" : ISODate("2015-08-18T16:06:36.328Z"),
	"followers" : [
		"pjAyjJwdy2QzsAevo"
	],
	"isAnonymous" : false,
	"isDeleted" : false,
	"tags" : [ ],
	"text" : "<p>You can access our search system by clicking on the search field in the header.</p>\n<p>It allows users to search for words and phrases in the title and the content of questions.</p>\n<p>You can search in the current course you have opened or all of the courses you are taking.</p>\n<p>The search results are fetched live while typing, so you don't even have to press enter!&nbsp;</p>",
	"title" : "We are all searching for something, aren't we?",
	"type" : 1,
	"updatedAt" : ISODate("2015-08-18T16:07:56.888Z"),
	"upvoters" : [ ],
	"upvotesCount" : 0,
	"userId" : "pjAyjJwdy2QzsAevo",
	"userIdenticon" : "88f44225a09259de2d51d7448b7ed8d534308b01caa69cd7e72fdd9d448040aa",
	"viewCount" : 2,
	"viewers" : [
		"pjAyjJwdy2QzsAevo",
		"zpWCsxeMLkYayvE84"
	]
}
{
	"answersCount" : 0,
	"courseId" : "JmDNqcQhivTjcrNrT",
	"createdAt" : ISODate("2015-08-18T16:35:33.094Z"),
	"followers" : [
		"zpWCsxeMLkYayvE84"
	],
	"isAnonymous" : false,
	"isDeleted" : false,
	"tags" : [ ],
	"text" : "<p>We hope it's been a pleasant experience.</p>\n<p>&nbsp;</p>\n<p>Feel free to play around the platform as much as you want.</p>\n<p>&nbsp;</p>\n<p>Also, do leave your comments/feedback here, report bugs or request features&nbsp;<span style=\"letter-spacing: 0.140000000596046px;\">(or just email us)</span><span style=\"letter-spacing: 0.01em;\">.</span></p>\n<p><span style=\"letter-spacing: 0.01em;\">We'll try to get back to you as soon as we can.</span></p>\n<p>&nbsp;</p>\n<p><span style=\"letter-spacing: 0.01em;\">Talk to you later.</span></p>\n<p>&nbsp;</p>\n<p>Giovanni and Martin</p>",
	"title" : "Thank you for taking Ask's Virtual Tour!",
	"type" : 1,
	"updatedAt" : ISODate("2015-08-18T21:36:24.054Z"),
	"upvoters" : [ ],
	"upvotesCount" : 0,
	"userId" : "zpWCsxeMLkYayvE84",
	"userIdenticon" : "cb14fc7950c2dfc95dda17f6d7a77de2791bdc452c736ab71ca87202d6f77ed5",
	"viewCount" : 2,
	"viewers" : [
		"zpWCsxeMLkYayvE84",
		"pjAyjJwdy2QzsAevo"
	]
}
{
	"answersCount" : 1,
	"badges" : {
		"hasStudentAnswer" : true
	},
	"courseId" : "JmDNqcQhivTjcrNrT",
	"createdAt" : ISODate("2015-08-18T15:06:47.816Z"),
	"followers" : [
		"pjAyjJwdy2QzsAevo"
	],
	"isAnonymous" : false,
	"isDeleted" : false,
	"responseTime" : 23,
	"tags" : [ ],
	"text" : "<p>I'd like to post as anonymous, but I don't know how?</p>",
	"title" : "How do I post as anonymous?",
	"type" : 1,
	"updatedAt" : ISODate("2015-08-18T15:09:35.827Z"),
	"upvoters" : [ ],
	"upvotesCount" : 0,
	"userId" : "pjAyjJwdy2QzsAevo",
	"userIdenticon" : "88f44225a09259de2d51d7448b7ed8d534308b01caa69cd7e72fdd9d448040aa",
	"usersLiveAnswering" : [ ],
	"viewCount" : 2,
	"viewers" : [
		"pjAyjJwdy2QzsAevo",
		"zpWCsxeMLkYayvE84"
	]
}
{
	"answersCount" : 0,
	"courseId" : "JmDNqcQhivTjcrNrT",
	"createdAt" : ISODate("2015-08-18T15:08:09.710Z"),
	"followers" : [
		"pjAyjJwdy2QzsAevo"
	],
	"isAnonymous" : false,
	"isDeleted" : false,
	"tags" : [
		"wk3",
		"wk8",
		"wk11",
		"logistics",
		"exam"
	],
	"text" : "<p style=\"text-align: left;\">Look at this: it's just fancy! You can also edit a question or answer after you posted it, if you noticed a typo or just want to make it as pretty as this one.</p>\n<p style=\"text-align: center;\"><br /><img src=\"http://smart.inf.ed.ac.uk/wp-content/uploads/2013/10/EdinburghUniLogo.png\" alt=\"\" width=\"204\" height=\"199\" /><br /><br />Some sample justified text:</p>\n<p style=\"text-align: left;\">&nbsp;</p>\n<p style=\"text-align: justify;\"><em>Monotonectally embrace real-time content</em> whereas fully researched technologies. Competently optimize virtual results and distributed total linkage. Holisticly integrate interoperable customer service whereas go forward services. <span style=\"text-decoration: underline;\">Efficiently implement enabled relationships with value-added catalysts for change.</span> Monotonectally actualize bleeding-edge vortals and <strong>best-of-breed markets.</strong></p>\n<p style=\"text-align: justify;\">&nbsp;</p>\n<p style=\"text-align: justify;\">Synergistically <a href=\"https://www.youtube.com/watch?v=dQw4w9WgXcQ\">coordinate virtual supply chains</a> vis-a-vis excellent e-business. Progressively unleash cutting-edge initiatives for real-time data. Distinctively enable enabled results with interactive customer service. Synergistically supply mission-critical potentialities before excellent internal or \"organic\" sources. Completely embrace front-end internal or \"organic\" sources before seamless infrastructures.</p>\n<p style=\"text-align: justify;\">&nbsp;</p>\n<p style=\"text-align: right;\"><strong>Maybe some right alignment?</strong></p>\n<p style=\"text-align: left;\"><strong>&nbsp;⇩Some tags&nbsp;&nbsp;</strong></p>",
	"title" : "Make your questions and notes look beautiful",
	"type" : 1,
	"updatedAt" : ISODate("2015-08-18T15:48:30.918Z"),
	"upvoters" : [ ],
	"upvotesCount" : 0,
	"userId" : "pjAyjJwdy2QzsAevo",
	"userIdenticon" : "88f44225a09259de2d51d7448b7ed8d534308b01caa69cd7e72fdd9d448040aa",
	"viewCount" : 2,
	"viewers" : [
		"pjAyjJwdy2QzsAevo",
		"zpWCsxeMLkYayvE84"
	]
}
{
	"answersCount" : 0,
	"courseId" : "JmDNqcQhivTjcrNrT",
	"createdAt" : ISODate("2015-08-18T15:59:28.605Z"),
	"followers" : [
		"pjAyjJwdy2QzsAevo"
	],
	"isAnonymous" : false,
	"isDeleted" : false,
	"tags" : [ ],
	"text" : "<p>Ask is reactive.</p>\n<p>Everything is reactive. You won't need that refresh button on your keyboard anymore.</p>\n<p>&nbsp;</p>\n<p><strong>Someone just posted a question</strong>? It will appear&nbsp;automagically in the sidebar (it will be marked unread so that you know it just popped up).</p>\n<p><strong>Someone just answered your question</strong>? Besides receiving a notification on the side, you will see the answer appear on the question without refreshing the page.</p>\n<p><strong>Someone is writing an answer to your question</strong>? You will have a live feedback at the bottom of the post, similar to this one:</p>\n<p>&nbsp;</p>\n<div class=\"panel-title text-complete\" style=\"box-sizing: border-box; margin: 0px; font-size: 12px; font-family: Montserrat; text-transform: uppercase; display: inline-block; letter-spacing: 0.02em; font-weight: 600; padding: 0px; overflow: hidden; text-overflow: ellipsis; transition: opacity 0.3s ease; color: #48b0f7 !important;\">&nbsp;</div>\n<div class=\"panel-title text-complete\" style=\"box-sizing: border-box; margin: 0px; font-size: 12px; font-family: Montserrat; text-transform: uppercase; display: inline-block; letter-spacing: 0.02em; font-weight: 600; padding: 0px; overflow: hidden; text-overflow: ellipsis; transition: opacity 0.3s ease; color: #48b0f7 !important;\">&nbsp;</div>\n<div class=\"panel-title text-complete\" style=\"box-sizing: border-box; margin: 0px; font-size: 12px; font-family: Montserrat; text-transform: uppercase; display: inline-block; letter-spacing: 0.02em; font-weight: 600; padding: 0px; overflow: hidden; text-overflow: ellipsis; transition: opacity 0.3s ease; color: #48b0f7 !important;\">&nbsp; &nbsp; 1&nbsp;USER IS CURRENTLY WRITING AN ANSWER...</div>\n<div class=\"panel-title text-complete\" style=\"box-sizing: border-box; margin: 0px; font-size: 12px; font-family: Montserrat; text-transform: uppercase; display: inline-block; letter-spacing: 0.02em; font-weight: 600; padding: 0px; overflow: hidden; text-overflow: ellipsis; transition: opacity 0.3s ease; color: #48b0f7 !important;\">&nbsp;</div>\n<p>&nbsp;</p>\n<p>A lot more is reactive, from upvote counts, to course stats, to time stamps, to answers, comments, questions and edits. It's all synced real-time with the database.</p>\n<p>&nbsp;</p>\n<p>Pretty cool, huh?</p>",
	"title" : "How do you make a website reactive like Ask?",
	"type" : 1,
	"updatedAt" : ISODate("2015-08-18T16:02:47.325Z"),
	"upvoters" : [ ],
	"upvotesCount" : 0,
	"userId" : "pjAyjJwdy2QzsAevo",
	"userIdenticon" : "88f44225a09259de2d51d7448b7ed8d534308b01caa69cd7e72fdd9d448040aa",
	"viewCount" : 2,
	"viewers" : [
		"pjAyjJwdy2QzsAevo",
		"zpWCsxeMLkYayvE84"
	]
}
{
	"answersCount" : 0,
	"courseId" : "JmDNqcQhivTjcrNrT",
	"createdAt" : ISODate("2015-08-18T14:50:10.654Z"),
	"followers" : [
		"pjAyjJwdy2QzsAevo"
	],
	"isAnonymous" : false,
	"isDeleted" : false,
	"tags" : [ ],
	"text" : "<p>LaTeX is a high-quality typesetting system; it includes features designed for the production of technical and scientific documentation. LaTeX is the de facto standard for the communication and publication of scientific documents.</p>\n<p>&nbsp;</p>\n<p>We render formulae using <a href=\"https://www.mathjax.org/\">MathJax</a>.</p>\n<p>You can put formulae like this:</p>\n<p>&nbsp;</p>\n<p>$F(x,y)=0 ~~\\mbox{and}~~ \\left| \\begin{array}{ccc} F''_{xx} &amp; F''_{xy} &amp; F'_x \\\\ F''_{yx} &amp; F''_{yy} &amp; F'_y \\\\ F'_x &amp; F'_y &amp; 0 \\end{array}\\right| = 0$</p>\n<p>&nbsp;</p>\n<p>or this</p>\n<p>&nbsp;</p>\n<p>$ \\underbrace{n(n-1)(n-2)\\dots(n-m+1)}_ {\\mbox{total of $m$ factors}} $</p>\n<p>&nbsp;</p>\n<p>&nbsp;</p>\n<p>or even this</p>\n<p>&nbsp;</p>\n<p>$ \\underbrace{a+\\overbrace{b+\\cdots}^{{}=t}+z} _{\\mathrm{total}} ~~ a+{\\overbrace{b+\\cdots}}^{126}+z $</p>\n<p>&nbsp;</p>\n<p>through our editor.</p>\n<p>&nbsp;</p>\n<p>Just try it with an answer!</p>\n<p>Get some formulas going!</p>",
	"title" : "Did you check LaTeX rendering?",
	"type" : 1,
	"updatedAt" : ISODate("2015-08-18T16:15:40.447Z"),
	"upvoters" : [ ],
	"upvotesCount" : 0,
	"userId" : "pjAyjJwdy2QzsAevo",
	"userIdenticon" : "88f44225a09259de2d51d7448b7ed8d534308b01caa69cd7e72fdd9d448040aa",
	"viewCount" : 1,
	"viewers" : [
		"pjAyjJwdy2QzsAevo"
	]
}
{
	"answersCount" : 0,
	"courseId" : "JmDNqcQhivTjcrNrT",
	"createdAt" : ISODate("2015-08-18T14:55:03.322Z"),
	"followers" : [
		"pjAyjJwdy2QzsAevo"
	],
	"isAnonymous" : false,
	"isDeleted" : false,
	"tags" : [ ],
	"text" : "<p>It just looks great, doesn't it?</p>\n<p>Our editor has Insert code function. Just paste your code in there, select the language or \"Automatic Language Detection\" and our employees&nbsp;in the back-end we'll read it and colour it neatly.</p>\n<p>&nbsp;&nbsp;</p>\n<pre><code class=\"java\">/**\n * @author John Smith &lt;john.smith@example.com&gt;\n * @version 1.0\n*/\npackage l2f.gameserver.model;\n\nimport java.util.ArrayList;\n\npublic abstract class L2Character extends L2Object {\n  public static final Short ABNORMAL_EFFECT_BLEEDING = 0x0_0_0_1; // not sure\n\n  public void moveTo(int x, int y, int z) {\n    _ai = null;\n    _log.warning(\"Should not be called\");\n    if (1 &gt; 5) {\n      return;\n    }\n  }\n\n  /** Task of AI notification */\n  @SuppressWarnings( { \"nls\", \"unqualified-field-access\", \"boxing\" })\n  public class NotifyAITask implements Runnable {\n    private final CtrlEvent _evt;\n\n    List&lt;String&gt; mList = new ArrayList&lt;String&gt;()\n\n    public void run() {\n      try {\n        getAI().notifyEvent(_evt, _evt.class, null);\n      } catch (Throwable t) {\n        t.printStackTrace();\n      }\n    }\n  }\n}<br /></code></pre>\n<p>&nbsp;</p>\n<p>&nbsp;<em style=\"letter-spacing: 0.01em;\">P.S.</em></p>\n<p>Did you know what's the object-oriented way to become wealthy?&nbsp;<strong>Inheritance</strong>.</p>\n<p>&nbsp;</p>",
	"title" : "Why does code look good with syntax highlighting ?",
	"type" : 1,
	"updatedAt" : ISODate("2015-08-18T16:17:13.696Z"),
	"upvoters" : [ ],
	"upvotesCount" : 0,
	"userId" : "pjAyjJwdy2QzsAevo",
	"userIdenticon" : "88f44225a09259de2d51d7448b7ed8d534308b01caa69cd7e72fdd9d448040aa",
	"viewCount" : 2,
	"viewers" : [
		"pjAyjJwdy2QzsAevo",
		"zpWCsxeMLkYayvE84"
	]
}
{
	"answersCount" : 0,
	"courseId" : "JmDNqcQhivTjcrNrT",
	"createdAt" : ISODate("2015-08-18T16:20:29.647Z"),
	"followers" : [
		"pjAyjJwdy2QzsAevo"
	],
	"isAnonymous" : false,
	"isDeleted" : false,
	"tags" : [ ],
	"text" : "<p>On the course front page you can get tonnes of information and insights about it.</p>\n<p>Some of the data provided includes:</p>\n<p>&nbsp; &nbsp; &nbsp; - The number of online users at the moment.</p>\n<p>&nbsp; &nbsp; &nbsp; - The number of online instructors at the moment.</p>\n<p>&nbsp; &nbsp; &nbsp; - The number of unread posts.</p>\n<p>&nbsp; &nbsp; &nbsp; - The number of unanswered questions.</p>\n<p>&nbsp; &nbsp; &nbsp; - The number of total posts on the platform.</p>\n<p>&nbsp; &nbsp; &nbsp; - The number of total contributions/answeres.</p>\n<p>&nbsp; &nbsp; &nbsp; - The number of instructors responses.</p>\n<p>&nbsp; &nbsp; &nbsp; - The number of student responses.</p>\n<p>&nbsp; &nbsp; &nbsp; - The average response time.</p>\n<p>&nbsp;</p>\n<p>As anything else in the platform, this data is live and you don't need to refresh in order to see changes happening!</p>\n<p>&nbsp;</p>",
	"title" : "How much course data do we have?",
	"type" : 1,
	"updatedAt" : ISODate("2015-08-18T16:27:58.940Z"),
	"upvoters" : [ ],
	"upvotesCount" : 0,
	"userId" : "pjAyjJwdy2QzsAevo",
	"userIdenticon" : "88f44225a09259de2d51d7448b7ed8d534308b01caa69cd7e72fdd9d448040aa",
	"viewCount" : 2,
	"viewers" : [
		"pjAyjJwdy2QzsAevo",
		"zpWCsxeMLkYayvE84"
	]
}
{
	"answersCount" : 1,
	"badges" : {
		"hasStudentAnswer" : true
	},
	"courseId" : "JmDNqcQhivTjcrNrT",
	"createdAt" : ISODate("2015-08-18T16:23:50.891Z"),
	"followers" : [
		"pjAyjJwdy2QzsAevo"
	],
	"isAnonymous" : false,
	"isDeleted" : false,
	"responseTime" : 2,
	"tags" : [ ],
	"text" : "<p>Certainly the developers didn't want to give instructors additional burden in setting up this platform, how did they do it?</p>",
	"title" : "How do instructors set up their courses in an intuitive way?",
	"type" : 1,
	"updatedAt" : ISODate("2015-08-18T16:26:15.679Z"),
	"upvoters" : [ ],
	"upvotesCount" : 0,
	"userId" : "pjAyjJwdy2QzsAevo",
	"userIdenticon" : "88f44225a09259de2d51d7448b7ed8d534308b01caa69cd7e72fdd9d448040aa",
	"usersLiveAnswering" : [ ],
	"viewCount" : 2,
	"viewers" : [
		"pjAyjJwdy2QzsAevo",
		"zpWCsxeMLkYayvE84"
	]
}
{
	"answersCount" : 0,
	"courseId" : "JmDNqcQhivTjcrNrT",
	"createdAt" : ISODate("2015-08-18T15:38:31.850Z"),
	"followers" : [
		"pjAyjJwdy2QzsAevo"
	],
	"isAnonymous" : false,
	"isDeleted" : false,
	"tags" : [ ],
	"text" : "<p>Just answer this question with your instructor's&nbsp;account and see the magic in action.</p>\n<p>&nbsp;</p>\n<p>You will receive a notification when:<br />&nbsp; &nbsp; &nbsp; &nbsp;- Someone answers your question.<br />&nbsp; &nbsp; &nbsp; &nbsp;- Someone answers a question you are following (did we mention users can follow questions they want to be updated on?).<br />&nbsp; &nbsp; &nbsp; &nbsp;- An instructor posts a Note on a course that you are&nbsp;taking.</p>\n<p>&nbsp;</p>\n<p>We've set you up with both a student account and an instructor account. Just play with them a little bit if you wish and get some notifications going.</p>\n<p><br /><em>P.S. If you miss the actual notification pop-up you can still see it&nbsp;by clicking the globe button on the header!</em></p>",
	"title" : "Fancy some notifications?",
	"type" : 1,
	"updatedAt" : ISODate("2015-08-18T16:36:58.987Z"),
	"upvoters" : [ ],
	"upvotesCount" : 0,
	"userId" : "pjAyjJwdy2QzsAevo",
	"userIdenticon" : "88f44225a09259de2d51d7448b7ed8d534308b01caa69cd7e72fdd9d448040aa",
	"usersLiveAnswering" : [ ],
	"viewCount" : 2,
	"viewers" : [
		"pjAyjJwdy2QzsAevo",
		"zpWCsxeMLkYayvE84"
	]
}
{
	"answersCount" : 2,
	"badges" : {
		"hasStudentAnswer" : true
	},
	"courseId" : "JmDNqcQhivTjcrNrT",
	"createdAt" : ISODate("2015-08-18T16:37:33.890Z"),
	"followers" : [
		"zpWCsxeMLkYayvE84"
	],
	"isAnonymous" : false,
	"isDeleted" : false,
	"responseTime" : 0,
	"tags" : [ ],
	"text" : "<p>Good job on making it here!</p>\n<p>Hope you're finding Ask just alright.</p>\n<p>&nbsp;</p>\n<p>This is a sample question.</p>",
	"title" : "Welcome to Ask's Virtual Tour!",
	"type" : 1,
	"updatedAt" : ISODate("2015-08-18T16:37:33.890Z"),
	"upvoters" : [ ],
	"upvotesCount" : 0,
	"userId" : "zpWCsxeMLkYayvE84",
	"userIdenticon" : "cb14fc7950c2dfc95dda17f6d7a77de2791bdc452c736ab71ca87202d6f77ed5",
	"usersLiveAnswering" : [ ],
	"viewCount" : 2,
	"viewers" : [
		"zpWCsxeMLkYayvE84",
		"pjAyjJwdy2QzsAevo"
	]
}
