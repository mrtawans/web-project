var express     =   require('express');
module.exports = (function(){
  'use strict';
  var jwt    		= 	require('jsonwebtoken');
  var config    = 	require('../config');
  var path      = 	require('path');
  var fs      	=   require('fs');
  var routes 		= 	express.Router();

    /*
    * =============================================================
    * Public for authentication
    * =============================================================
    */
    routes.get('/', function(req, res) {
    	res.json({
    		messages:'Access denied'
    	});
    });
    
    routes.get('/auth/:username', function(req, res) {
    	/*
    	* In case of testing and developing.
    	*/
    	var validUsername = req.params.username;
    	if(validUsername === "tawan") {
	    	var user = {
	    		"username": validUsername,
	    		"user_type": "admin"	
	    	}

	        var TokenGenerated = jwt.sign(user, config.privateKey, {
	          expiresInMinutes: 1
	        });

			res.json({
				status: true,
				message: 'authentication successfully',
				token: TokenGenerated
			});

    	} else {
    		res.json({
				status: false,
				message: 'Failed to authenticate'
			});
    	}

    });

    /*
    * =============================================================
    * AUTHENTICATE
    * =============================================================
    */
  	routes.use(function(req, res, next) {

  		var token = req.body.token || 
  					req.query.token ||  
  					req.headers['x-access-token'];
  		// decode token
  		if (token) {
  			// verifies secret and checks exp
  			jwt.verify(token, config.privateKey, function(err, decoded) 
  			{      
      		if (err) {
	        		return res.json({ 
	        			status: false,
	        			message: 'Failed to authenticate token or already expired.'
	        		});    
	      		} else {
	    			// if everything is good, 
	    			// save to request for use in other routes
	        		req.decoded = decoded;    
	        		next();
	      		}
	      	});
  	  	} else {
  	  		// if there is no token
  	  		return res.status(403).send({ 
  					status: false, 
  					message: 'No token provided.' 
  				});
  			}
  	});
	/*
    * =============================================================
    * END AUTHENTICATE
    * =============================================================
    */


    /*
    * =============================================================
    * Start Routing
    * =============================================================
    */
    {
  		var files = fs.readdirSync("./src/server/routes");
  		for(var index in files) {
  			var file = files[index];
  			if (file === "index.js") continue;
  			// skip non-javascript files
  			if (path.extname(file) != ".js") continue;
  			var router = require("./" + path.basename(file));
  			// Add router to handle routing
  			router(routes);
  		}
  	}

    return routes;
    /*
    * =============================================================
    * End Routing
    * =============================================================
    */

})();