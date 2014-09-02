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

require(['jQuery', 'knockout', 'game/Tile', 'game/TileType', 'game/Grid', 'game/Direction', 'game/GUI', 'viewmodels/GameViewModel', 'TouchSwipe'], function($, ko, Tile, TileType, Grid, Direction, GUI, GameViewModel) {

    var self = this;

    this.viewModel = new GameViewModel();
    ko.applyBindings(self.viewModel);

    var gameWait = false;

    var players = [{
        playerName: 'Red',
        tileType: TileType.RED,
        score: 0,
        viewModelScore: self.viewModel.redScore
    }, {
        playerName: 'Blue',
        tileType: TileType.BLUE,
        score: 0,
        viewModelScore: self.viewModel.blueScore
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
        self.viewModel.playerTurnName(getCurrentPlayer().playerName);
    };

    var increaseScore = function(player) {
        player.score++;
        player.viewModelScore(player.viewModelScore() + 1);
    };

    var gui = new GUI($(".tile-container"));
    var grid = new Grid(4, gui);

    var currentPlayerTurn = 0;
    self.viewModel.playerTurnName(getCurrentPlayer().playerName);

    players.forEach(function(player) {
        grid.addTile(player.tileType);
    });

    grid.onTileMerge = function(tile) {
        var tilePlayer = getPlayerByTileType(tile.tileType);
        if (tilePlayer == getCurrentPlayer()) {
            increaseScore(tilePlayer);
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
            }, 410);
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