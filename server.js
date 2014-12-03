// server.js

    // set up ========================
    var express  = require('express');
    var app      = express();                               // create our app w/ express
    var mongoose = require('mongoose');                     // mongoose for mongodb
    var morgan = require('morgan');             // log requests to the console (express4)
    var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
    var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)
	var http = require('http');
	var request = require('request');

    // configuration 

    mongoose.connect('mongodb://test:test@ds055680.mongolab.com:55680/3316_lab_4');     // connect to mongoDB database on modulus.io

    app.use(express.static(__dirname + '/public'));                 // set the static files location /public/img will be /img for users
    app.use(morgan('dev'));                                         // log every request to the console
    app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
    app.use(bodyParser.json());                                     // parse application/json
    app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
    app.use(methodOverride());
	
	//define the models
	//User Movie Model/List
	var Movie = mongoose.model('Movie', {
		user: String,
		name : String,
		publicC: String,
		privateC: String,
		status: String
		
	});
	//User Model
	var User = mongoose.model('User', {
		name : String,
		pass : String
	});
	
	//routes
	//User Routes
	//Get all users
	app.get('/users',function(req,res){
		User.find(function(err,users){
			if (err)
                res.send(err)
            res.json(users);
		});
	});
	//Create user
	app.post('/users/create',function(req,res){
		//Check if there already is this user
		var alreadyCreated = false;
		User.find(function(err, users) {
            // err
            if (err)
                res.send(err)
            
			for(i=0;i < users.length;i++){
				if(users[i].name == req.body.username){
						alreadyCreated = true;
						console.log("There is already a user with this name!");
						break;
				}
			}
			console.log(alreadyCreated);
		//otherwise create
			if(alreadyCreated == true){
				res.send("Already have a user with this name!");
			}
			else{
				User.create({
					name : req.body.username,
					pass : req.body.pass
				}, function(err,users){
					if(err)
						res.send(err);
					res.send("User created");
				});
			}
			
        });
		
		
	});
	
	//log user on
	app.post('/users/logon/', function(req,res){
		var loggedOn = false;
		var wrongPass = false;
		console.log(req.body.username);
		User.find(function(err,users){
			for(i=0;i < users.length;i++){
				if(users[i].name == req.body.username && users[i].pass == req.body.pass){
						res.send("Logged on!");
						loggedOn = true;
						break;
				}
				else if(users[i].name == req.body.username && users[i].pass != req.body.pass){
					res.send("Wrong password!");
					wrongPass = true;
					break;
				}
			}
			if(loggedOn == false && wrongPass == false){
				
				User.create({
					name : req.body.username,
					pass : req.body.pass
				}, function(err,users){
					if(err)
						res.send(err);
					res.send("No user/password combination found, creating user!");
				});
			}
		});
	});
	
    // api Movies 
    // get all Movies Comments
    app.get('/api/movies', function(req, res) {
        // use mongoose to get all movies in the database
        Movie.find(function(err, movies) {
            // err
            if (err)
                res.send(err)
            res.json(movies); // return all movies in JSON format
        });
    });
	
	//get all movies by user
	app.post('/api/movies/user', function(req, res) {
        // use mongoose to get all movies in the database
        Movie.find({'user' : req.body.user} ,function(err, movies) {
            // err
            if (err)
                res.send(err)
			console.log(movies.length);
            res.json(movies); // return all movies in JSON format
        });
    });

    // create Movie and send back all movies after creation
    app.post('/api/movies', function(req, res) {
        // create a movie comment, information comes from AJAX request from Angular
        Movie.create({
            user : req.body.user,
			name : req.body.name,
			publicC : req.body.publicC,
			privateC : req.body.privateC,
			status: "to-be-watched"
        }, function(err, movies) {
            if (err)
                res.send(err);

            // get and return all the movie comments after you create another
            Movie.find(function(err, movies) {
                if (err)
                    res.send(err)
                res.json(movies);
            });
        });

    });

    // delete a movie comment
    app.delete('/api/movies/:movie_id', function(req, res) {
        Movie.remove({
            _id : req.params.movie_id
        }, function(err, movies) {
            if (err)
                res.send(err);

            // get and return all the Movies after you create another
            Movie.find({'user' : req.body.user} ,function(err, movies) {
            // err
            if (err)
                res.send(err)
			console.log(movies.length);
            res.json(movies); // return all movies in JSON format
        });
        });
    });

	//query OMDB
	app.post('/moviequery', function(req,res){
			//Create the text used to query
			var text = req.body.text;
			var holdText = text.split(" ");
			var inputText = "";
			for(i=0; i < holdText.length; i++){
				inputText += holdText[i];
				if(i != holdText.length -1){
					inputText += "+";
				}
			}
			console.log("Request Started");
			var sendURL = 'http://www.omdbapi.com/?t='+inputText+'&y=&plot=short&r=json';
			console.log(sendURL);
			//'http://api.rottentomatoes.com/api/public/v1.0/movies.json?apikey=8mkbcbhtencmgcnkujsm5b4k&q='+inputText+ '&page_limit=1'
			request(sendURL, function (error, response, body) {
			if (!error) {
				console.log(body) // Print the response to console.
				res.send(body);
			}
})
			 
	});
	
	
	
	
	//Send to front end
	app.get('*', function(req, res) {
        res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
    });
	
	
    // listen (start app with node server.js) ======================================
    app.listen(3005);
    console.log("App listening on port 3005");
