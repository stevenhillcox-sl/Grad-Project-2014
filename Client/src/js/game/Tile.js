define(['./Position'], function(Position) {
	return function Tile(tileType) {
		var self = this;

		self.tileType = tileType;
		self.position = new Position(0, 0);

		// Sets a tile's position
		self.setPosition = function(position) {
			self.position = position;
		};
	};
});