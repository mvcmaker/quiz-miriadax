var models = require('../models/models.js');

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