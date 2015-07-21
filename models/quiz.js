//Quiz model definition with validation

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('Quiz', {
		question : {
			type: DataTypes.STRING,
			validate:{ notEmpty:{ msg: '-> Falta pregunta' } }
		},
		answer : {
			type: DataTypes.STRING,
			validate:{ notEmpty:{ msg: '-> Falta respuesta' } }
		},
		category : {
			type: DataTypes.STRING,
			validate:{ notEmpty:{ msg: '-> Falta categoría' } }
		}
	});
};