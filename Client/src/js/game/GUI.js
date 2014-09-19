define(['jQuery', './Tile', './TileType', './Position', './Direction'], function($, Tile, TileType, Position, Direction) {
	return function GUI(gameTick) {
		var self = this;

		var tileMaps = [];
		var $tileContainer = $(".tile-container");
		var $gameContainer = $('.game-container');

		self.onInput = null;

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

		// Add a score indicator
		self.addScorePopUp = function(tile, score) {
			var $newScorePopUp = $("<div>", {
				class: "score-pop-up"
			});

			$newScorePopUp.addClass('tile-position-' + tile.position.row + '-' + tile.position.column);
			$newScorePopUp.text(score);

			setTimeout(function() {
				$tileContainer.append($newScorePopUp);
			}, gameTick);

			setTimeout(function() {
				$newScorePopUp.remove();
			}, 6 * gameTick);
		};

		// Displays an overlay informing the user of a win/loss
		self.displayEndGameOverlay = function(status, gridFull) {

			var $endGameOverlay = $("<div>", {
				class: "end-game-overlay"
			});
			
			var $endGameOverlayContainer = $("<div>", {
				class: "end-game-overlay-container"
			});

			var statusString = "";

			if (gridFull) {
				statusString += "The grid is full! ";
			}

			switch (status) {
				case "win":
					statusString += "You win!";
					break;
				case "loss":
					statusString += "You lose";
					break;
				case "draw":
					statusString += "It's a Draw";
					break;
			}

			$endGameOverlay.text(statusString);
			$endGameOverlayContainer.insertAfter($('.middle-column .game-title-lobby'));
			$endGameOverlayContainer.append($endGameOverlay);
		};

		// Creates a new gui tile and maps it to a given game tile
		self.addTile = function(tile) {
			var $newTile = $("<div>", {
				class: "tile"
			});

			$newTile.addClass(tile.tileType.classString);
			$newTile.addClass('tile-new');
			$newTile.addClass('tile-position-' + tile.position.row + '-' + tile.position.column);

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
		self.clear = function() {
			tileMaps.forEach(function(tileMap) {
				tileMap.$uiTile.remove();
			});
			tileMaps = [];

			$endGameOverlay = $('.end-game-overlay');
			if ($endGameOverlay) {
				$endGameOverlay.remove();
			}
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

		$(window).swipe({
			swipeLeft: function() {
				if (self.onInput) {
					self.onInput(Direction.LEFT);
				}
			},
			swipeRight: function() {
				if (self.onInput) {
					self.onInput(Direction.RIGHT);
				}
			},
			swipeDown: function() {
				if (self.onInput) {
					self.onInput(Direction.DOWN);
				}
			},
			swipeUp: function() {
				if (self.onInput) {
					self.onInput(Direction.UP);
				}
			}
		});

		var KEYLEFT = 37;
		var KEYUP = 38;
		var KEYRIGHT = 39;
		var KEYDOWN = 40;

		$(window).keydown(function(event) {
			if (event.keyCode == KEYLEFT ||
				event.keyCode == KEYUP ||
				event.keyCode == KEYRIGHT ||
				event.keyCode == KEYDOWN)
				event.preventDefault();
		});

		$(window).keyup(function(event) {


			var direction = null;

			switch (event.keyCode) {
				case KEYLEFT:
					direction = Direction.LEFT;
					break;

				case KEYRIGHT:
					direction = Direction.RIGHT;
					break;

				case KEYDOWN:
					direction = Direction.DOWN;
					break;

				case KEYUP:
					direction = Direction.UP;
					break;
			}
			if (direction !== null) {
				if (self.onInput) {
					self.onInput(direction);
				}
			}
		});
	};
});