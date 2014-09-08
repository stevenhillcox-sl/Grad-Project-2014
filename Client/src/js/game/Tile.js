define(['./Position'], function(Position) {
	return function Tile(tileType) {
		var self = this;

		self.tileType = tileType;
		self.position = new Position

		// Sets a tile's position
		self.setPosition = function(position) {
			self.position = position;
		};
	};
});