define(['jQuery', 'knockout', 'game/Tile', 'game/TileType', 'game/Grid', 'game/Direction', 'game/GUI', 'TouchSwipe'], function($, ko, Tile, TileType, Grid, Direction, GUI) {
	return function Game(viewModel, userNames, $gameContainer) {

		var self = this;
		var scoreLimit = 10;
		var gameWait = false;
		var gameTick = 200;
		var gamePlayer = null;
		var currentPlayerTurn = 0;
		var gui = new GUI(gameTick);
		var grid = new Grid(4);

		// Gets the player whoes turn it is
		var getCurrentPlayer = function() {
			return self.players[currentPlayerTurn];
		};

		// Gets a player by thier tile type
		var getPlayerByTileType = function(tileType) {
			return self.players.filter(function(player) {
				return player.tileType == tileType;
			})[0];
		};

		// Gets a player by thier name
		var getPlayerByPlayerName = function(playerName) {
			return self.players.filter(function(player) {
				return player.playerName == playerName;
			})[0];
		};

		// Advances the turn counter
		var advancePlayerTurn = function() {
			currentPlayerTurn = (currentPlayerTurn + 1) % self.players.length;
			viewModel.playerTurnName(getCurrentPlayer().playerName);
		};

		// Sets a player's score
		var setScore = function(player, score) {
			player.score = score;
			player.viewModelScore(score);
		};

		// Adds a new tile for the player and checks for end game conditions 
		var startTurn = function() {
			var newTilePosition = grid.getRandomEmptyCell();
			var scoreLimitReached = false;
			self.players.forEach(function(player) {
				if (player.score <= 0) {
					scoreLimitReached = true;
				}
			});

			if (!newTilePosition || scoreLimitReached) {
				viewModel.endGame();
			} else {
				viewModel.sendTile(newTilePosition);
			}
		};

		self.players = [{
			playerName: userNames[0],
			tileType: TileType.RED,
			score: scoreLimit,
			viewModelScore: viewModel.redScore
		}, {
			playerName: userNames[1],
			tileType: TileType.BLUE,
			score: scoreLimit,
			viewModelScore: viewModel.blueScore
		}];

		// Define action to be taken when the grid merges tiles
		grid.onTileMerge = function(tiles) {
			var tilePlayer = getPlayerByTileType(tiles[0].tileType);
			if (tilePlayer == getCurrentPlayer()) {
				var scoreChange = tiles.length;
				setScore(tilePlayer, tilePlayer.score - scoreChange);
				gui.addScorePopUp(tiles[0], scoreChange);
			}

			tiles.forEach(function(tile) {
				gui.removeTile(tile);
			});
		};

		// Checks if the user has currently won or lost in an end game situation
		self.checkWinStatus = function() {
			var sortedPlayers = self.players.slice(0);
			sortedPlayers.sort(function(a, b) {
				return a.score - b.score;
			});
			if (gamePlayer == sortedPlayers[0]) {
				gui.displayEndGameOverlay(true);
			} else {
				gui.displayEndGameOverlay(false);
			}
		};

		// Resets the state of the game
		self.clear = function() {
			gui.clear();
			grid.clear();

			self.players.forEach(function(player) {
				setScore(player, scoreLimit);
			});

			currentPlayerTurn = 0;
		};

		// Initialises the game
		self.initalise = function() {

			self.clear();
			viewModel.playerTurnName(getCurrentPlayer().playerName);

			gamePlayer = getPlayerByPlayerName(viewModel.userName());

			if (getCurrentPlayer() == gamePlayer) {
				startTurn();
			}
		};

		// Adds a tile to the game
		self.addTile = function(position) {
			var newTile = grid.addTile(position, getCurrentPlayer().tileType);
			gui.addTile(newTile);
		};

		// Move the grid and update the game state/UI
		self.move = function(direction) {
			grid.move(direction, getCurrentPlayer().tileType);
			gui.updateUI();
			advancePlayerTurn();
			if (getCurrentPlayer() == gamePlayer) {
				startTurn();
			}
		};

		// Send a move to the server
		self.makeMove = function(direction) {
			if (getCurrentPlayer() == gamePlayer && viewModel.gameActive() && !viewModel.chatSelected() && !gameWait) {
				gameWait = true;
				viewModel.sendMove(direction);
				setTimeout(function() {
					gameWait = false;
				}, gameTick);
			}
		};

		$($gameContainer).swipe({
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

		$(window).keyup(function(event) {
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