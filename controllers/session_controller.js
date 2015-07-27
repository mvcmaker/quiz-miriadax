exports.loginRequired = function(req, res, next) {
	if(req.session.user !== undefined)
		next();
	else
		res.redirect('/login');
}
// GET /login -- login form
exports.new = function(req, res) {
	var errors = req.session.errors || {};
	req.session.errors = {};

	res.render('sessions/new', { errors: errors });
}

// POST /login -- session create
exports.create = function(req, res) {
	var login = req.body.login;
	var password = req.body.password;

	var userController = require('./user_controller');
	userController.authenticate(login, password, function(error, user) {
		if(error) { // if there's an error, returns the session message error
			req.session.errors = [{ 'message' : "Se ha producido un error: " + error }];
			res.redirect('/login');
			return;
		}

		// Creates req.session.user and stores id and username fields
		// The session is defined by th existence of req.session.user
		
		var d = new Date();
		var dt = d.getDate().toString() + '/' + (+d.getMonth()+1) + '/' + d.getFullYear().toString() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
		req.session.user = { id:user.id, username:user.username, friendlyName:user.friendlyName, dt:dt };
		console.log("user authenticated OK");
		console.log(req.session.user);
		res.redirect(req.session.redir.toString()); // redirection to last path to login
	});
}

// DELETE /logout  -- session destroy
exports.destroy = function(req, res) {
	delete req.session.user;
	if(req.session.expiration !== undefined)
		delete req.session.expiration;
	res.redirect(req.session.redir.toString());
}