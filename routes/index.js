var express = require('express');
var quizController = require('../controllers/quiz_controller');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Quiz' });
});

// Commands autoload with :quizId
router.param('quizId', quizController.load);

// /quizes routes definitions
router.get('/quizes/', quizController.index);
router.get('/quizes/:quizId(\\d+)', quizController.show);
router.get('/quizes/:quizId(\\d+)/answer', quizController.answer);
router.get("/author", quizController.author);

module.exports = router;
