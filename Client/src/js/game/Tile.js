define([], function() {
	return function Tile(tileType) {
		var self = this;

		self.tileType = tileType;
		self.row = 0;
		self.column = 0;

		self.move = function(row, column) {
			self.row = row;
			self.column = column;
		};
	};
});