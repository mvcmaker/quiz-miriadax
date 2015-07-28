var models = require('../models/models.js');

var statistics = {
		num_questions : 0,
		num_comments : 0,
		avg_comments : 0,
		num_questions_no_comments : 0,
		num_questions_comments : 0
	};
var errors = [];


// GET /quizes/statistics
exports.show = function(req, res, next) {
	res.render('quizes/statistics', { statistics:statistics, errors:errors });
}

exports.calculate = function(req, res, next) {	
	models.Quiz.count()
	.then(function(numQuests) {
		statistics.num_questions = numQuests;
		return models.Comment.count();
	})
	.then(function(numComments) {
		statistics.num_comments = numComments;
		
		return models.Comment.countCommentedQuizes();
	})
	.then(function(numCommentedQuizes) {
		statistics.num_questions_comments = numCommentedQuizes;
		return models.Comment.countUnpublished();
	})
	.then(function(numUnpublished) {
		statistics.num_questions_no_comments = numUnpublished;
		statistics.avg_comments = 'N/A';
		if(statistics.num_questions_comments) {
			statistics.avg_comments = (statistics.num_questions_no_comments *100 / statistics.num_questions_comments).toFixed(2) + '%';
		}
	})
	.catch(function(err) {
		errors.push(err);
	})
	.finally(function() {
		next();
	});
	
	/*
	models.Quiz.count().then(function(n) {
		statistics.num_questions = n;
		models.Comment.count().then(function(n) {
			statistics.num_comments = n;
			
			
			models.Quiz.count({
				include : [{ model: models.Comment, required:true }]
			}).then(function(n) {
				statistics.num_questions_comments = n;
				models.Quiz.count({
					include : [{ model: models.Comment, required:false }]
				}).then(function(n) {
					statistics.num_questions_no_comments = n;
					res.render('quizes/statistics', { statistics:statistics, errors:[] });
				});
				
			});
		});
	})

	.catch(function(error) { next(error); });
	*/
}