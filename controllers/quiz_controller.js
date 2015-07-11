exports.question = function(req, res) {
	res.render('quizes/question', { title: 'Quiz', pregunta: 'Capital de Italia?'});
};
exports.answer = function(req, res) {
	if(req.query.respuesta === 'Roma')
		res.render('quizes/answer', { title: 'Quiz', respuesta: 'Correcto' });
	else
		res.render('quizes/answer', { title: 'Quiz', respuesta: 'Incorrecto' });
};
exports.author = function(req, res) {
	res.render('author');
};