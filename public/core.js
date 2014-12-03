// public/core.js
//api key Rotten Tomatoes = 8mkbcbhtencmgcnkujsm5b4k

var movieScreen = angular.module('movieScreen', []);



function mainController($scope, $http) {
	//var movieTextHold = "Movie Data!';
    $scope.formData = {};
	var currentUserName = "No User!";
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
    $scope.createTodo = function() {
        $http.post('/api/movies', $scope.formData)
            .success(function(data) {
                $scope.formData = {}; // clear the form so our user is ready to enter another
                $scope.movies = data;
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

    // delete a movie after checking it
    $scope.deleteTodo = function(id) {
        $http.delete('/api/movies/' + id)
            .success(function(data) {
                $scope.movies = data;
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };
	
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
					$scope.movieData = createText;
					alert(createText);
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
			}
		})
		.error(function(data){
			alert(data);
		});
	};
	
}