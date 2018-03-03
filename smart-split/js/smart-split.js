var app = angular.module("smart-split-app", []);

app.controller("smart-split-controller", function($scope) {
	
	$scope.participants = [];
	$scope.participantName = "";
	$scope.addParticipant = function() {
		var participant = $scope.participantName;
		if (participant.length == 0) {
			return;
		}
		$scope.participants.push(participant);
		$scope.participantName = "";
	}
	$scope.deleteParticipant = function() {
		
	}

	$scope.items = [];
});
