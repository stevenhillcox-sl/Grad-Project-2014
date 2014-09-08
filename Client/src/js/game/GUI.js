define(['jQuery', './Tile', './TileType', './Position'], function($, Tile, TileType) {
	return function GUI($tileContainer, gameTick) {
		var self = this;
		var tileMaps = [];
		gameTick = gameTick || 200;

		// Returns a tile mapping based on it's game tile
		var findTileMap = function(gameTile) {
			return tileMaps.filter(function(tileMap) {
				return tileMap.gameTile == gameTile;
			})[0];
		};

		// Removes a tile mapping
		var removeTileMap = function(tileMap) {
			tileMaps.splice(tileMaps.indexOf(tileMap), 1);
		};

		// Creates a new gui tile and maps it to a given game tile
		self.addTile = function(tile) {
			var $newTile = $("<div>", {
				class: "tile"
			});

			$newTile.addClass(tile.tileType.classString);
			$newTile.addClass('tile-new');
			$newTile.addClass('tile-position-' + tile.row + '-' + tile.column);

			tileMaps.push({
				gameTile: tile,
				$uiTile: $newTile
			});

			setTimeout(function() {
				$tileContainer.append($newTile);
			}, gameTick);
		};

		// Removes a gui tile based on a game tile and remove the associated mapping
		self.removeTile = function(gameTile) {
			var tileMap = findTileMap(gameTile);
			setTimeout(function() {
				tileMap.$uiTile.remove();
				removeTileMap(tileMap);
			}, gameTick);
		};

		// Remove all UI tiles and clear the mappings
		self.clear = function(){
			tileMaps.forEach(function(tileMap){
				tileMap.$uiTile.remove();
			});
			tileMaps = [];
		};

		// Updates the UI tiles based on thier game tile locations
		self.updateUI = function() {

			tileMaps.forEach(function(tileMap) {
				var classes = tileMap.$uiTile.attr('class').split(' ');
				classes.forEach(function(classString) {
					if (classString.indexOf('tile-position') === 0 || classString == 'tile-new') {
						tileMap.$uiTile.removeClass(classString);
					}
				});

				tileMap.$uiTile.addClass('tile-position-' + tileMap.gameTile.position.row + '-' + tileMap.gameTile.position.column);
			});
		};
	};
});