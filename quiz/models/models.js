var path = require('path');

// Load ORM model
var Sequelize = require('sequelize');

// Use DB Sqlite:
var sequelize = new Sequelize(null, null, null,
		{ dialect:'sqlite', storage:'quiz.sqlite' }
	);

// Import the definition of Quiz table in quiz.js
var Quiz = sequelize.import(path.join(__dirname, 'quiz'));

exports.Quiz = Quiz; // exports definition of Quiz table

// sequelize.sync() creates and initializes the question tables in DB
sequelize.sync().then(function() {
	// success(...) executes the handler after the table has been created
	Quiz.count().then(function(count) {
		if(count === 0) { // The table only is initizlied if is empty
			Quiz.create({
				question : 'Capital de Italia?',
				answer : 'roma,rome'
			}).then(function() { console.log("Database has been successfully initialized") });
		}
	});
});