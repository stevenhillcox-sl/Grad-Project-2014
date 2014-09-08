define(['jQuery', 'knockout', 'game/Tile', 'game/TileType', 'game/Grid', 'game/Direction', 'game/GUI', 'TouchSwipe'], function($, ko, Tile, TileType, Grid, Direction, GUI) {
	return function Game(viewModel, userNames) {

		var self = this;

		self.players = [{
			playerName: userNames[0],
			tileType: TileType.RED,
			score: 0,
			viewModelScore: viewModel.redScore
		}, {
			playerName: userNames[1],
			tileType: TileType.BLUE,
			score: 0,
			viewModelScore: viewModel.blueScore
		}];

		var getCurrentPlayer = function() {
			return self.players[currentPlayerTurn];
		};

		var getPlayerByTileType = function(tileType) {
			return self.players.filter(function(player) {
				return player.tileType == tileType;
			})[0];
		};

		var getPlayerByPlayerName = function(playerName) {
			return self.players.filter(function(player) {
				return player.playerName == playerName;
			})[0];
		};

		var advancePlayerTurn = function() {
			currentPlayerTurn = (currentPlayerTurn + 1) % self.players.length;
			viewModel.playerTurnName(getCurrentPlayer().playerName);
		};

		var setScore = function(player, score) {
			player.score = score;
			player.viewModelScore(score);
		};
		
		var count = 0;
		
		var startTurn = function(){
			
			if(count++ == 3){
				viewModel.endGame();
			}
			
			var newTilePosition = grid.getRandomEmptyCell();
			if(newTilePosition){
				viewModel.sendTile(newTilePosition);
			} else {
				viewModel.endGame();
			}
		};
		
		var gameTick = 200;
		var gamePlayer = getPlayerByPlayerName(viewModel.userName());

		var gui = new GUI($(".tile-container"), gameTick);
		var grid = new Grid(4, gui);

		var currentPlayerTurn = 0;
		viewModel.playerTurnName(getCurrentPlayer().playerName);
		
		if(getCurrentPlayer() == gamePlayer){
			startTurn();
		}

		grid.onTileMerge = function(tile) {
			var tilePlayer = getPlayerByTileType(tile.tileType);
			if (tilePlayer == getCurrentPlayer()) {
				setScore(tilePlayer, tilePlayer.score + 1);
			}
		};
		
		self.clear = function() {
			gui.clear();
			grid.clear();
			self.players.forEach(function(player) {
				setScore(player, 0);
			});
		};

		self.addTile = function(position) {
			grid.addTile(position, getCurrentPlayer().tileType);
		};

		self.move = function(direction) {
			grid.move(direction, getCurrentPlayer().tileType);
			advancePlayerTurn();
			if(getCurrentPlayer() == gamePlayer){
				startTurn();
			}
		};

		self.makeMove = function(direction) {
			if (getCurrentPlayer() == gamePlayer && viewModel.gameActive()) {
				viewModel.sendMove(direction);
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