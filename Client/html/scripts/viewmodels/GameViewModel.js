define(['knockout'], function(ko) {

	return function GameViewModel() {
		var self = this;

		self.redScore = ko.observable(0);
		self.blueScore = ko.observable(0);
		self.playerTurnName = ko.observable('');
		self.playerTurnString = ko.computed(function(){
			return self.playerTurnName() != '' ? self.playerTurnName() + '\'s Turn' : '';
		})
	}
});