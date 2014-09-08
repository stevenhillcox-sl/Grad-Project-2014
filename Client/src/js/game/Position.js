define([], function() {
	return function Position(row, column) {
		var self = this;

		self.row = row || 0;
		self.column = column || 0;
	};
});