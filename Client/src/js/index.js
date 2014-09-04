require.config({
    paths: {
        'jQuery': 'lib/jquery-2.1.1.min',
        'knockout': 'lib/knockout-3.2.0',
        'TouchSwipe': 'lib/jquery.touchSwipe.min'
    },
    shim: {
        'jQuery': {
            exports: '$'
        },
        'knockout': {
            exports: 'ko'
        },
        'TouchSwipe': ['jQuery']
    }
});

require(['jQuery', 'knockout', 'game/Tile', 'game/TileType', 'game/Grid', 'game/Direction', 'game/GUI', 'viewmodels/IndexViewModel', 'viewmodels/GameViewModel', 'TouchSwipe'], function($, ko, Tile, TileType, Grid, Direction, GUI, IndexViewModel, GameViewModel) {

    var self = this;

    ko.bindingHandlers.stopBinding = {
        init: function(element, valueAccessor) {
            return {
                controlsDescendantBindings: true
            };
        }
    };

    self.gameViewModel = new GameViewModel();
    ko.applyBindings(self.gameViewModel, $(".game-view-container").get(0));

    self.indexViewModel = new IndexViewModel()
    ko.applyBindings(self.indexViewModel);

    var gameTick = 200;
    var gameWait = false;

    var players = [{
        playerName: 'Red',
        tileType: TileType.RED,
        score: 0,
        viewModelScore: self.gameViewModel.redScore
    }, {
        playerName: 'Blue',
        tileType: TileType.BLUE,
        score: 0,
        viewModelScore: self.gameViewModel.blueScore
    }];

    var getCurrentPlayer = function() {
        return players[currentPlayerTurn];
    };

    var getPlayerByTileType = function(tileType) {
        return players.filter(function(player) {
            return player.tileType == tileType;
        })[0];
    };

    var advancePlayerTurn = function() {
        currentPlayerTurn = (currentPlayerTurn + 1) % players.length;
        self.gameViewModel.playerTurnName(getCurrentPlayer().playerName);
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
    self.gameViewModel.playerTurnName(getCurrentPlayer().playerName);

    players.forEach(function(player) {
        grid.addTile(player.tileType);
    });

    grid.onTileMerge = function(tile) {
        var tilePlayer = getPlayerByTileType(tile.tileType);
        if (tilePlayer == getCurrentPlayer()) {
            setScore(tilePlayer, tilePlayer.score + 1);
        }
    };

    var makeMove = function(direction) {
        if (!gameWait) {
            gameWait = true;
            grid.move(direction, getCurrentPlayer().tileType);
            grid.addTile(getCurrentPlayer().tileType);

            setTimeout(function() {
                gameWait = false;
                advancePlayerTurn();
            }, gameTick + 10);
        }
    };

    $(window).swipe({
        swipeLeft: function() {
            makeMove(Direction.LEFT);
        },
        swipeRight: function() {
            makeMove(Direction.RIGHT);
        },
        swipeDown: function() {
            makeMove(Direction.DOWN);
        },
        swipeUp: function() {
            makeMove(Direction.UP);
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
            makeMove(direction);
        }
    });
});