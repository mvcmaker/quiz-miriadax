// Comment model creation with validation

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('Comment', {
		text : {
			type:DataTypes.STRING,
			validate:{ notEmpty:{ msg : '-> Falta comentario' } }
			},
		published : {
			type:DataTypes.BOOLEAN,
			defaultValue:false
			}
		},
		{
    		classMethods: {
	    		countUnpublished: function () {
					return this.aggregate('QuizId', 'count', {'where': { 'published': false }}).then('success',function(count) {
						return count;
					});
				},
				countCommentedQuizes: function () {
					return this.aggregate('QuizId', 'count', {'distinct': true }).then('success',function(count) {
						return count;
					});
				}
			}
		}
	);
}