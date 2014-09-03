define(['jQuery', './Tile', './TileType'], function($, Tile, TileType) {
	return function GUI($tileContainer, gameTick) {
		var self = this;
		var tileMaps = [];
		var gameTick = gameTick || 200;

		var findTileMap = function(gameTile) {
			return tileMaps.filter(function(tileMap) {
				return tileMap.gameTile == gameTile;
			})[0];
		};

		var removeTileMap = function(tileMap) {
			tileMaps.splice(tileMaps.indexOf(tileMap), 1);
		};

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

		self.removeTile = function(gameTile) {
			var tileMap = findTileMap(gameTile);
			setTimeout(function() {
				tileMap.$uiTile.remove();
				removeTileMap(tileMap);
			}, gameTick);
		};

		self.clear = function(){
			tileMaps.forEach(function(tileMap){
				tileMap.$uiTile.remove();
			});
			tileMaps = [];
		};

		self.updateUI = function() {

			tileMaps.forEach(function(tileMap) {
				var classes = tileMap.$uiTile.attr('class').split(' ');
				classes.forEach(function(classString) {
					if (classString.indexOf('tile-position') === 0 || classString == 'tile-new') {
						tileMap.$uiTile.removeClass(classString);
					}
				});

				tileMap.$uiTile.addClass('tile-position-' + tileMap.gameTile.row + '-' + tileMap.gameTile.column);
			});
		};
	};
});