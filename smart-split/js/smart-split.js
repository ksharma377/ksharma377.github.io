var app = angular.module("smart-split-app", []);

app.controller("smart-split-controller", function($scope) {
	
	$scope.participants = [];
	$scope.participantName = "";

	$scope.addParticipant = function() {
		var participant = $scope.participantName;
		if (participant.length == 0) {
			return;
		}
		if ($scope.participants.indexOf(participant) > -1) {
			alert('Participant already exists. Please use a different name.');
			return;
		}
		$scope.participants.push(participant);
		$scope.participants.sort();
		$scope.participantName = "";
	}
	
	$scope.deleteParticipant = function(index) {
		$scope.participants.splice(index, 1);
	}

	$scope.items = [];
});
