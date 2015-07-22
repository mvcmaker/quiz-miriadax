// Comment model creation with validation

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('Comment', {
		text : {
			type:DataTypes.STRING,
			validate:{ notEmpty:{ msg : '-> Falta comentario' } }
		}
	});
}