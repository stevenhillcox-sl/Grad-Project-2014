define(['jQuery', 'knockout', 'game/Tile', 'game/TileType', 'game/Grid', 'game/Direction', 'game/GUI', 'TouchSwipe'], function($, ko, Tile, TileType, Grid, Direction, GUI) {
	return function Game(viewModel, players) {

		var players = [{
			playerName: players[0].user.userName,
			tileType: TileType.RED,
			score: 0,
			viewModelScore: gameViewModel.redScore
		}, {
			playerName: players[1].user.userName,
			tileType: TileType.BLUE,
			score: 0,
			viewModelScore: gameViewModel.blueScore
		}];

		var gameTick = 200;
		var gamePlayer = getPlayerByPlayerName(viewModel.userName);

		var getCurrentPlayer = function() {
			return players[currentPlayerTurn];
		};

		var getPlayerByTileType = function(tileType) {
			return players.filter(function(player) {
				return player.tileType == tileType;
			})[0];
		};

		var getPlayerByPlayerName = function(playerName) {
			return players.filter(function(player) {
				return player.playerName == playerName;
			})[0];
		};

		var advancePlayerTurn = function() {
			currentPlayerTurn = (currentPlayerTurn + 1) % players.length;
			gameViewModel.playerTurnName(getCurrentPlayer().playerName);
			gameWait = false;
		};

		var setScore = function(player, score) {
			player.score = score;
			player.viewModelScore(score);
		};

		var resetGame = function() {
			gui.clear();
			grid.clear();
			players.forEach(function(player) {
				setScore(player, 0);
			});
		};

		var gui = new GUI($(".tile-container"), gameTick);
		var grid = new Grid(4, gui);

		var currentPlayerTurn = 0;
		gameViewModel.playerTurnName(getCurrentPlayer().playerName);

		grid.onTileMerge = function(tile) {
			var tilePlayer = getPlayerByTileType(tile.tileType);
			if (tilePlayer == getCurrentPlayer()) {
				setScore(tilePlayer, tilePlayer.score + 1);
			}
		};

		self.addTile = function(position) {
			grid.addTile(position, getCurrentPlayer().tileType);
		};

		self.move = function(direction) {
			grid.move(direction, getCurrentPlayer().tileType);
			advancePlayerTurn();
		};

		self.makeMove = function(direction) {
			if (self.getCurrentPlayer() == gamePlayer) {
				self.move(direction);
				var newTilePosition = grid.getRandomEmptyCell();
				self.addTile(newTilePosition)

				viewModel.sendMove(direction);
				viewModel.sendTile(newTilePosition);
			}
		};

		$(window).swipe({
			swipeLeft: function() {
				self.makeMove(Direction.LEFT);
			},
			swipeRight: function() {
				self.makeMove(Direction.RIGHT);
			},
			swipeDown: function() {
				self.makeMove(Direction.DOWN);
			},
			swipeUp: function() {
				self.makeMove(Direction.UP);
			}
		});

		$(window).keydown(function(event) {
			var KEYLEFT = 37;
			var KEYUP = 38;
			var KEYRIGHT = 39;
			var KEYDOWN = 40;

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
				self.makeMove(direction);
			}
		});
	};
});