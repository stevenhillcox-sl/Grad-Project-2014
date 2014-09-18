define(['jQuery', 'knockout', './Tile', './TileType', './Grid', 'TouchSwipe'], function($, ko, Tile, TileType, Grid) {
	return function Game(viewModel, gui, gameTick) {

		var self = this;
		var scoreLimit = 5;
		var gameWait = false;
		var gamePlayer = null;
		var currentPlayerTurn = 0;
		var grid = new Grid(4);
		var tileOrder = [TileType.RED, TileType.BLUE, TileType.GREEN, TileType.YELLOW];
		var currentTileType = 0;

		self.players = null;
		self.gui = gui;

		// Gets the player whoes turn it is
		var getCurrentPlayer = function() {
			return self.players[currentPlayerTurn];
		};

		// Gets a player by thier name
		var getPlayerByPlayerName = function(playerName) {
			return self.players.filter(function(player) {
				return player.playerName == playerName;
			})[0];
		};

		// Gets the current tile type to be added to the grid
		var getCurrentTileType = function() {
			return tileOrder[currentTileType];
		};

		// Advances the turn counter
		var advancePlayerTurn = function() {
			currentPlayerTurn = (currentPlayerTurn + 1) % self.players.length;
			viewModel.playerTurnName(getCurrentPlayer().playerName);
		};

		// Advances the tile type
		var advanceTileType = function() {
			currentTileType = (currentTileType + 1) % tileOrder.length;
			viewModel.nextTileClass = tileOrder[(currentTileType + 1) % tileOrder.length].classString;
		};

		// Moves the player's turn back by one
		var resetPlayerTurn = function() {
			currentPlayerTurn = currentPlayerTurn === 0 ? self.players.length : currentPlayerTurn;
			currentPlayerTurn = (currentPlayerTurn - 1) % self.players.length;

			viewModel.playerTurnName(getCurrentPlayer().playerName);
		};

		// Sets a player's score
		var setScore = function(player, score) {
			player.score = score;
			player.viewModelScore(score);
		};

		// Checks for end game conditions and optionally adds a new tile
		var startTurn = function(addTile) {
			var scoreLimitReached = false;

			self.players.forEach(function(player) {
				if (player.score <= 0) {
					scoreLimitReached = true;
				}
			});

			if (scoreLimitReached) {
				viewModel.endGame();
			} else {
				if (addTile) {
					var newTilePosition = grid.getRandomEmptyCell();
					var tileType = getCurrentTileType();

					if (newTilePosition) {
						var newTile = new Tile(tileType, newTilePosition);

						//self.addTile(newTile);
						viewModel.sendTile(newTile);
					} else {
						viewModel.endGame();
					}
				}
			}
		};

		// Define action to be taken when the grid merges tiles
		grid.onTileMerge = function(tiles) {
			var tilePlayer = getCurrentPlayer();
			var scoreChange = tiles.length;
			setScore(tilePlayer, tilePlayer.score - scoreChange);
			self.gui.addScorePopUp(tiles[0], scoreChange);

			tiles.forEach(function(tile) {
				self.gui.removeTile(tile);
			});
		};

		// Checks if the user has currently won or lost in an end game situation
		self.checkWinStatus = function() {
			var gridFull = grid.isFull();
			// Check for a draw
			var draw = true;
			for (var i = 1; i < self.players.length; i++) {
				if (self.players[i].score !== self.players[0].score) {
					draw = false;
					break;
				}
			}
			if (draw) {
				self.gui.displayEndGameOverlay("draw", gridFull);
			} else {
				var sortedPlayers = self.players.slice(0);
				sortedPlayers.sort(function(a, b) {
					return a.score - b.score;
				});
				if (gamePlayer == sortedPlayers[0]) {
					viewModel.updateUserStats(gamePlayer.playerName, 1);
					self.gui.displayEndGameOverlay("win", gridFull);
				} else {
					self.gui.displayEndGameOverlay("loss", gridFull);
				}
			}
		};

		// Resets the state of the game
		self.clear = function() {
			self.gui.clear();
			grid.clear();

			self.players.forEach(function(player) {
				setScore(player, scoreLimit);
			});

			currentPlayerTurn = 0;
			currentTileType = 0;
		};

		// Initialises the game
		self.initalise = function(userNames) {

			self.players = [{
				playerName: userNames[0],
				tileType: TileType.RED,
				score: scoreLimit,
				viewModelScore: viewModel.player1Score

			}, {
				playerName: userNames[1],
				tileType: TileType.BLUE,
				score: scoreLimit,
				viewModelScore: viewModel.player2Score
			}];

			self.clear();
			viewModel.playerTurnName(getCurrentPlayer().playerName);

			gamePlayer = getPlayerByPlayerName(viewModel.userName());

			if (getCurrentPlayer() == gamePlayer) {
				startTurn(true);
			}
		};

		// Adds a tile to the game
		self.addTile = function(tile) {
			var tileTypeKey = Object.keys(TileType).filter(function(key) {
				return tile.tileType.string === TileType[key].string;
			})[0];
			var newTile = new Tile(TileType[tileTypeKey], tile.position);
			grid.addTile(newTile);
			self.gui.addTile(newTile);

			if (grid.isGridLocked()) {
				viewModel.endGame();
			}
		};

		// Move the grid and update the game state/UI
		self.move = function(direction) {
			var moveResult = grid.move(direction, getCurrentPlayer().tileType, hasMerged);
			var hasMoved = moveResult.hasMoved;
			var hasMerged = moveResult.hasMerged;

			if (hasMoved) {
				gui.updateUI();

				if (!hasMerged) {
					advancePlayerTurn();
					advanceTileType();
				}

				if (getCurrentPlayer() == gamePlayer) {
					startTurn(!hasMerged);
				}
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
	};
});