var models = require("../models/models");

// GET /quizes/question
exports.question = function(req, res) {
	models.Quiz.findAll().then(function(quiz){
		res.render('quizes/question', { title: 'Quiz', pregunta: quiz[0].question });
	});
	
};

// GET /quizes/answer
exports.answer = function(req, res) {
	models.Quiz.findAll().then(function(quiz){
		var responses = quiz[0].answer.split(',');

		if(responses.indexOf(req.query.respuesta.toLowerCase()) != -1)
			res.render('quizes/answer', { title: 'Quiz', respuesta: 'Correcto' });
		else
			res.render('quizes/answer', { title: 'Quiz', respuesta: 'Incorrecto' });
	});
};

// GET /quizes/author
exports.author = function(req, res) {
	res.render('author');
};