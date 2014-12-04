// public/core.js
//api key Rotten Tomatoes = 8mkbcbhtencmgcnkujsm5b4k

var movieScreen = angular.module('movieScreen', []);



function mainController($scope, $http) {
	//var movieTextHold = "Movie Data!';
    $scope.formData = {};
	var currentUserName = "No User!";
	var currentMovie = "null";
	$scope.currentUserName = currentUserName;
    // when landing on the page, get all Movies and show them
    $http.get('/api/movies')
        .success(function(data) {
            $scope.movies = data;
            console.log(data);
			
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });

    // when submitting the add form, send the text to the node API
    $scope.createMovie = function() {
		if(currentUserName == "No User!"){
			alert("Sign in!");
		}
		else if(currentMovie == "null"){
			alert("Get a movie!");
		}
		else if($scope.publicCom == null || $scope.privateCom ==null){
			alert("Empty comments!");
		}
		else{
			var jsonInsert = {
				user : currentUserName,
				name : currentMovie,
				publicC : $scope.publicCom.text,
				privateC : $scope.privateCom.text
			}
			
			$http.post('/api/movies', jsonInsert)
				.success(function(data) {
					$scope.formData = {}; // clear the form so our user is ready to enter another
					$scope.movies = data;
					console.log(data);
				})
				.error(function(data) {
					console.log('Error: ' + data);
				});
			$http.post('/api/movies/user',{
					user: currentUserName
					}).success(function(data){						
						$scope.userMovies = data;
					})
					.error(function(data){
						alert(data);
					});	
		}
    };
	//update movie status
	$scope.updateStatus = function(id){
		$http.post('/api/movies/update/' +id)
			.success(function(data){
				console.log(data);
				
				$http.post('/api/movies/user',{
					user: currentUserName
					}).success(function(data){						
						$scope.userMovies = data;
					})
					.error(function(data){
						alert(data);
					});
			})
			.error(function(data){
				console.log("Error " + data);
			});
	};
	
    // delete a movie after checking it
    $scope.deleteMovie = function(id) {
        $http.delete('/api/movies/' + id)
            .success(function(data) {
                console.log(data);
				
				$http.post('/api/movies/user',{
					user: currentUserName
					}).success(function(data){						
						$scope.userMovies = data;
					})
					.error(function(data){
						alert(data);
					});
				
				
				$http.get('/api/movies')
					.success(function(data) {
						$scope.movies = data;
						console.log(data);
						
					})
					.error(function(data) {
						console.log('Error: ' + data);
					});
				
				
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };
	//add a movie another user has on their list to yours
	$scope.addToMine = function(movieToAdd){
		if(currentUserName == "No User!"){
			alert("Sign in!");
		}
		else if(movieToAdd.user == currentUserName){
			alert("Already in your list!");
		}
		else if($scope.publicCom == null || $scope.privateCom ==null){
			alert("Empty comments!");
		}
		else{
			var jsonInsert = {
				user : currentUserName,
				name : movieToAdd.name,
				publicC : $scope.publicCom.text,
				privateC : $scope.privateCom.text
			}
			
			$http.post('/api/movies', jsonInsert)
				.success(function(data) {
					$scope.formData = {}; 
					$scope.movies = data;
					console.log(data);
				})
				.error(function(data) {
					console.log('Error: ' + data);
				});
			$http.post('/api/movies/user',{
					user: currentUserName
					}).success(function(data){						
						$scope.userMovies = data;
					})
					.error(function(data){
						alert(data);
					});	
		}
	
	}
	
	//Search movie database
	$scope.search = function(){
		$http.post('/moviequery',$scope.formData)
			.success(function(data){
				if(data.Response == "False"){
					alert("Nothing Found!");
					$scope.movieData = "Movie Not Found!";
				}
				else{
					alert("Successful search");
					var createText = data.Title + ": \n STARS: " + data.Actors + " \n PLOT: " + data.Plot;
					currentMovie = data.Title;
					$scope.movieData = createText;
				}
				
			})
			.error(function(data){
				console.log('Search Error');
			});
	};
	
	//Users
	$scope.logon = function(){
		
		$http.post('/users/logon', {
			username : $scope.formUserData.text,
			pass : $scope.formPassData.text
		}).success(function(data){
			alert(data);
			if(data != "Wrong password!"){
				currentUserName = $scope.formUserData.text;
				$scope.currentUserName = currentUserName;
				$http.post('/api/movies/user',{
					user: currentUserName
					}).success(function(data){						
						$scope.userMovies = data;
					})
					.error(function(data){
						alert(data);
					});
				
			}
		})
		.error(function(data){
			alert(data);
		});
	};
	
}