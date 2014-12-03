// public/core.js
//api key Rotten Tomatoes = 8mkbcbhtencmgcnkujsm5b4k

var scotchTodo = angular.module('scotchTodo', []);

function mainController($scope, $http) {
    $scope.formData = {};

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

    // delete a todo after checking it
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
				alert("succesful search");
			})
			.error(function(data){
				console.log('Search Error');
			});
	};
	
}