var models = require('../models/models.js');

// Autoload :id of comments
exports.load = function(req, res, next, commentId) {
	models.Comment.find({
		where: {
			id: Number(commentId)
		}
	}).then(function(comment) {
		if(comment) {
			req.comment = comment;
			next();
		}
		else {
			next(new Error("No existe commentId=" + commentId))
		}
	}).catch(function(err){ next(error); });
}

// GET /quizes/:quizId/comments/new
exports.new = function(req, res) {
	res.render('comments/new', { quizid: req.params.quizId, errors : [] });
}

// POST /quizes/:quizId/comments
exports.create = function(req, res, next) {
	var comment = models.Comment.build({
		text : req.body.comment.text,
		QuizId : req.params.quizId
	});
	comment
	.validate()
	.then(function(err){
		if(err) {
			res.render('comments/new', { comment:comment, errors:err.erros });
		}
		else {
			comment
			.save() // save: Stores in DB the comment.text field
			.then(function() {
				res.redirect('/quizes/' + req.params.quizId);
				// red.redirect: HTTP redirection to the quizzes list
			});
		}
	}).catch(function(error){ next(error) });
}

// GET /quizes/:quizId/comments/:commentId/publish
exports.publish = function(req, res) {
	req.comment.published = true;
	console.log("publish call");
	req.comment.save({ fields: ['published']})
		.then(function() { console.log("SAVING comment published");res.redirect('/quizes/' + req.params.quizId); })
		.catch(function(err){ next(err); });
}