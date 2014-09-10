define(['./Position'], function(Position) {
	return function Tile(tileType, position) {
		var self = this;

		self.tileType = tileType;
		self.position = position || new Position(0, 0);

		// Sets a tile's position
		self.setPosition = function(position) {
			self.position = position;
		};
	};
});