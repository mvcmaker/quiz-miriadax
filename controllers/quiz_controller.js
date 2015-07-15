var models = require("../models/models");

// Autoload - factorizes the code if path includes :quizId
exports.load = function(req, res, next, quizId) {
	models.Quiz.findById(quizId).then(function(quiz) {
		if(quiz) {
			req.quiz = quiz;
			next();
		}
		else {
			next(new Error("quizId = " + quizId + " not found"));
		}
	}).catch(function(error) { next(error); });
}

// GET /quizes
exports.index = function(req, res) {
	models.Quiz.findAll().then(function(quizes) {
		res.render('quizes/index.ejs', {quizes:quizes});
	}).catch(function(error) { next(error); });
} 

// GET /quizes/:quizId
exports.show = function(req, res) {
	//console.log(req.params.quizId);
	//models.Quiz.findById(req.params.quizId).then(function(quiz){
		res.render('quizes/show', { quiz: req.quiz });
	//});
	
};

// GET /quizes/:quizId/answer
exports.answer = function(req, res) {
	//models.Quiz.findById(req.params.quizId).then(function(quiz){
		var responses = req.quiz.answer.split(',');
		var i;
		var result = 'Incorrecto';
		if(i=responses.indexOf(req.query.respuesta.toLowerCase()) != -1)
			result = 'Correcto';
		res.render('quizes/answer', { quiz: req.quiz, respuesta: result });
	//});
};

// GET /quizes/author
exports.author = function(req, res) {
	res.render('author');
};