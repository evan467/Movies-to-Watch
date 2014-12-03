// server.js

    // set up ========================
    var express  = require('express');
    var app      = express();                               // create our app w/ express
    var mongoose = require('mongoose');                     // mongoose for mongodb
    var morgan = require('morgan');             // log requests to the console (express4)
    var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
    var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)
	var http = require('http');

    // configuration =================

    mongoose.connect('mongodb://test:test@ds055680.mongolab.com:55680/3316_lab_4');     // connect to mongoDB database on modulus.io

    app.use(express.static(__dirname + '/public'));                 // set the static files location /public/img will be /img for users
    app.use(morgan('dev'));                                         // log every request to the console
    app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
    app.use(bodyParser.json());                                     // parse application/json
    app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
    app.use(methodOverride());
	
	//define the model
	var Movie = mongoose.model('Movie', {
		text: String
	});
	
	//routes
	// routes ======================================================================

    // api ---------------------------------------------------------------------
    // get all Movies
    app.get('/api/movies', function(req, res) {

        // use mongoose to get all movies in the database
        Movie.find(function(err, movies) {

            // if there is an error retrieving, send the error. nothing after res.send(err) will execute
            if (err)
                res.send(err)

            res.json(movies); // return all movies in JSON format
        });
    });

    // create Movie and send back all movies after creation
    app.post('/api/movies', function(req, res) {

        // create a movie, information comes from AJAX request from Angular
        Movie.create({
            text : req.body.text,
            done : false
        }, function(err, movies) {
            if (err)
                res.send(err);

            // get and return all the todos after you create another
            Movie.find(function(err, movies) {
                if (err)
                    res.send(err)
                res.json(movies);
            });
        });

    });

    // delete a movie
    app.delete('/api/movies/:movie_id', function(req, res) {
        Movie.remove({
            _id : req.params.movie_id
        }, function(err, movies) {
            if (err)
                res.send(err);

            // get and return all the Movies after you create another
            Movie.find(function(err, movies) {
                if (err)
                    res.send(err)
                res.json(movies);
            });
        });
    });
	//Send to front end
	app.get('*', function(req, res) {
        res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
    });
	
	app.post('/moviequery', function(req,res){
			var text = req.body.text;
			var holdText = text.split(" ");
			var inputText = "";
			for(i=0; i < holdText.length; i++){
				inputText += holdText[i];
				if(i != holdText.length -1){
					inputText += "+";
				}
			}
			 var sendOptions = {
				host : 'api.rottentomatoes.com',
				path: '/api/public/v1.0/movies.json?apikey=8mkbcbhtencmgcnkujsm5b4k&q='+inputText+ '&page_limit=1'
			 };
		http.request(sendOptions, function(err, movies) {
            if (err)
                res.send(err);
			res.json(movies);	
			});
	});
	
	
	 callback = function(response) {
		  var str = '';

		  //another chunk of data has been recieved, so append it to `str`
		  response.on('data', function (chunk) {
			str += chunk;
		  });

		  //the whole response has been recieved, so we just print it out here
		  response.on('end', function () {
			console.log(str);
		  });
	}

	
	
	
    // listen (start app with node server.js) ======================================
    app.listen(3005);
    console.log("App listening on port 3005");
