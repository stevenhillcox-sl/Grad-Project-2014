/* global describe, it, expect, beforeEach */
define(['../game/Game'], function(Game) {
	describe("Game", function() {

		var game = null;

		beforeEach(function() {
			game = new Game({
				userName: function() {
					return 'player1';
				},
				player1Score: function() {},
				player2Score: function() {},
				playerTurnName: function() {},
				sendTile: function(){},
				updateUserStats: function(){},
				nextTileClass : function(){}
			}, {
				clear: function() {},
				addTile: function() {}
			}, 0);
			game.initalise(['player1', 'player2']);
		});

		describe("checkWinStatus", function() {
			it("Detects a win", function() {
				var winStatus = null;
				// var viewModel ={};
				
				
				game.gui.displayEndGameOverlay = function(status) {
					winStatus = status;
				};

				game.players[0].score = 2;
				game.players[1].score = 3;

				game.checkWinStatus();

				expect(winStatus).toEqual("win");
			});

			it("Detects a loss", function() {
				var winStatus = null;
				game.gui.displayEndGameOverlay = function(status) {
					winStatus = status;
				};

				game.players[0].score = 3;
				game.players[1].score = 2;

				game.checkWinStatus();

				expect(winStatus).toEqual("loss");
			});

			it("Detects a draw", function() {
				var winStatus = null;
				game.gui.displayEndGameOverlay = function(status) {
					winStatus = status;
				};

				game.players[0].score = 3;
				game.players[1].score = 3;

				game.checkWinStatus();

				expect(winStatus).toEqual("draw");
			});
		});
	});
});