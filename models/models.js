var path = require('path');

// Postgres DATABASE_URL = postgres://user:passwd@host:port/database
// SQLite DATABASE_URL = sqlite://:@:/

var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_name = (url[6]||null);
var user = (url[2]||null);
var pwd = (url[3]||null);
var protocol = (url[1]||null);
var dialect = (url[1]||null);
var port = (url[5]||null);
var host = (url[4]||null);
var storage = process.env.DATABASE_STORAGE;

// Load ORM model
var Sequelize = require('sequelize');

// Use DB Sqlite or Postgres
var sequelize = new Sequelize(DB_name, user, pwd,
	{   dialect:dialect,
		protocol:protocol,
		port:port,
		host:host,
		storage:storage, // Only for SQLite
		omitNull:true	// Only for Postgres
	}
);

// Import the definition of Quiz table in quiz.js
var quiz_path = path.join(__dirname, 'quiz');
var Quiz = sequelize.import(quiz_path);

exports.Quiz = Quiz; // exports definition of Quiz table



// sequelize.sync() creates and initializes the question tables in DB
sequelize.sync().then(function() {
	// success(...) executes the handler after the table has been created
	//Quiz.truncate().then(function() { console.log("Database has been successfully deleted") });
	Quiz.count().then(function(count) {
		if(count === 0) { // The table only is initizlied if is empty
			Quiz.create({
				question : 'Capital de Italia?',
				answer : 'roma,rome'
			});
			Quiz.create({
				question: 'Capital de Portugal?',
				answer : 'lisboa,lisbon'
			}).then(function() { console.log("Database has been successfully initialized") });
		}
	});
});

