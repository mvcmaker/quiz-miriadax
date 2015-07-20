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
exports.index = function(req, res, next) {
	var options;
	if(req.query.search !== undefined) {
		console.log("Detected search query!: " + req.query.search);
		var search = '%' + req.query.search.trim().replace(/\s/g, '%') + '%';
		options = { 'where': ["question LIKE ?", search], order:"question" };
	}
	models.Quiz.findAll(options).then(function(quizes) {
		res.render('quizes/index.ejs', { quizes:quizes, errors: [] });
	}).catch(function(error) { next(error); });
	
} 

// GET /quizes/:quizId
exports.show = function(req, res) {
	//console.log(req.params.quizId);
	//models.Quiz.findById(req.params.quizId).then(function(quiz){
		res.render('quizes/show', { quiz: req.quiz, errors: [] });
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
		res.render('quizes/answer', { quiz: req.quiz, respuesta: result, errors: [] });
	//});
};

// GET /quizes/new
exports.new = function(req, res) {
	var quiz = models.Quiz.build( { // Creates quiz object
		question : "Pregunta",
		answer : "Respuesta"
	});
	res.render('quizes/new', { quiz:quiz, errors: [] });
}

// POST /quizes/create
exports.create = function(req, res) {
	var quiz = models.Quiz.build( req.body.quiz );

	
	quiz.validate().then(function(err) {
		if(err) {
			res.render('quizes/new', { quiz:quiz, errors:err.errors });
		}
		else {
			// save: Stores in DB the quiz questions and answers fields
			quiz.save({ fields:['question', 'answer']}).then(function() {
				res.redirect('/quizes');
			}); // HTTP redirection (relative), question list
		}
	});

	
}

// GET /quizes/:id/edit
exports.edit = function(req, res) {
	var quiz = req.quiz; // autoload of quiz instance
	res.render('quizes/edit', { quiz:quiz, errors: [] });
}

// PUT /quizes/:id
exports.update = function(req, res) {
	req.quiz.question = req.body.quiz.question;
	req.quiz.answer = req.body.quiz.answer;

	req.quiz.validate().then(function(err) {
		if(err) {
			res.render('quizes/edit', { quizes: req.quiz, errors:err.errors })
		}
		else {
			// save: Stores in DB the quiz questions and answers fields
			req.quiz.save( { fields: ['question', 'answer' ]} ).then(function() {
				res.redirect('/quizes');
			}); // HTTP redirection (relative), question list
		}
	});
}

// DELETE /quizes/:id
exports.destroy = function(req, res, next) {
	var quiz = req.query.quizId;
	req.quiz.destroy().then(function(err) {
		res.redirect('/quizes');
	}).catch(function(error) { next(error); });
	
}

// GET /quizes/author
exports.author = function(req, res) {
	res.render('author');
};