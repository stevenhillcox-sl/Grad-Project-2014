require.config({
    paths: {
        'jQuery': 'lib/jquery-2.1.1.min'
    },
    shim: {
        'jQuery': {
            exports: '$'
        }
    }
});

require(['jQuery', 'game/Tile', 'game/TileType', 'game/Grid', 'game/Direction', 'game/GUI'], function($, Tile, TileType, Grid, Direction, GUI) {

    var self = this;

    var gameWait = false;
    var tileOrder = [TileType.RED, TileType.BLUE];
    var currentTileType = 0;

    var getNextTileType = function() {
        return tileOrder[(currentTileType++) % (tileOrder.length)];
    };

    var gui = new GUI();
    var grid = new Grid(4, gui);

    grid.clear();
    grid.addTile(getNextTileType());
    grid.print();

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

        if (direction && !gameWait) {
            gameWait = true;
            grid.move(direction);
            setTimeout(function() {
                grid.addTile(getNextTileType());
                //grid.print();
                gameWait = false;
            }, 400);
        }
    });
});