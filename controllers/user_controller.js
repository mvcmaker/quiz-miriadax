var users = {
	admin : { id:1, username:'admin', password:'1234', friendlyName:'Administrador' },
	pepe : { id:2, username:'pepe', password:'5678', friendlyName:'Pepe' }
};

exports.authenticate = function(login, password, callback) {
	if(users[login]) {
		if(password === users[login].password)
			callback(null, users[login]);
		else
			callback(new Error('Password erróneo'));
	}
	else
		callback(new Error('Usuario no existente'));
}