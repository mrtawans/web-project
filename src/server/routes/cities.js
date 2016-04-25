module.exports = function(routes) {
	'use strict';
	routes.get('/city', function(req, res){
		var city = [
			{
				name:"Thailand",
				people:10000000
			},
			{
				name:"Australia",
				people:921000000
			},
		];
		res.json(city);
	});
}