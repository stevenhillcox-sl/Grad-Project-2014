define(['./Tile', './TileType', './Direction'], function(Tile, TileType, Direction) {
    return function Grid(gridSize, gui) {

        var self = this;
        var grid = [];

        for (var i = 0; i < gridSize; i++) {
            grid.push([]);
            for (var j = 0; j < gridSize; j++) {
                grid[i][j] = null;
            }
        }

        var getRow = function(rowNumber) {
            return grid[rowNumber].slice(0);
        };

        var getColumn = function(columnNumber) {
            var column = [];
            for (var i = 0; i < grid.length; i++) {
                column.push(grid[i][columnNumber]);
            }
            return column;
        };

        var setRow = function(rowNumber, row) {
            grid[rowNumber] = row;
        };

        var setColumn = function(columnNumber, column) {
            for (var i = 0; i < grid.length; i++) {
                grid[i][columnNumber] = column[i];
            }
        };

        var pushRow = function(row) {
            for (var i = row.length - 2; i >= 0; i--) {
                var currentTile = row[i];
                if (currentTile.tileType != TileType.EMPTY) {
                    var nextOpenCell = i;
                    for (var j = i + 1; j < row.length; j++) {
                        if (row[j].tileType == TileType.EMPTY) {
                            nextOpenCell = j;
                        } else if (row[j].tileType == currentTile.tileType) {
                            nextOpenCell = j;
                            break;
                        } else {
                            break;
                        }
                    }

                    if (i != nextOpenCell) {
                        currentTileRow = currentTile.row;
                        currentTileColumn = currentTile.column;
                        currentTile.move(row[nextOpenCell].row, row[nextOpenCell].column);
                        if (row[nextOpenCell].tileType == currentTile.tileType) {
                            destroyTile(row[nextOpenCell]);
                        }
                        row[nextOpenCell] = currentTile;
                        row[i] = new Tile(TileType.EMPTY);
                        row[i].move(currentTileRow, currentTileColumn);
                    }
                }
            }
        };

        var destroyTile = function(tile) {
            gui.removeTile(tile);
        }

        var pullRow = function(row) {
            row.reverse();
            pushRow(row);
            row.reverse();
        };

        self.clear = function() {
            for (var i = 0; i < grid.length; i++) {
                for (var j = 0; j < grid[i].length; j++) {
                    var newTile = new Tile(TileType.EMPTY);
                    newTile.move(i, j);
                    grid[i][j] = newTile;
                }
            }
            return grid;
        };

        self.addTile = function(tileType) {
            var openRows = [];

            for (var i = 0; i < grid.length; i++) {
                for (var k = 0; k < grid[i].length; k++) {
                    if (grid[i][k].tileType == TileType.EMPTY) {
                        openRows.push(i);
                        break;
                    }
                }
            }
            if (openRows.length === 0) {
                return false;
            }
            var randomRow = openRows[Math.floor(Math.random() * (openRows.length))];

            var openColumns = [];
            for (var j = 0; j < grid[randomRow].length; j++) {
                if (grid[randomRow][j].tileType == TileType.EMPTY) {
                    openColumns.push(j);
                }
            }
            var randomColumn = openColumns[Math.floor(Math.random() * (openColumns.length))];

            var newTile = new Tile(tileType);
            grid[randomRow][randomColumn] = newTile;
            newTile.move(randomRow, randomColumn);

            gui.addTile(newTile);
        };

        self.move = function(direction) {
            switch (direction) {
                case Direction.RIGHT:
                    for (var i = 0; i < grid.length; i++) {
                        var pushedRow = getRow(i);
                        pushRow(pushedRow);
                        setRow(i, pushedRow);
                    }
                    break;

                case Direction.DOWN:
                    for (var i = 0; i < grid.length; i++) {
                        var pushedColumn = getColumn(i);
                        pushRow(pushedColumn);
                        setColumn(i, pushedColumn);
                    }
                    break;

                case Direction.LEFT:
                    for (var i = 0; i < grid.length; i++) {
                        var pulledRow = getRow(i);
                        pullRow(pulledRow);
                        setRow(i, pulledRow);
                    }
                    break;

                case Direction.UP:
                    for (var i = 0; i < grid.length; i++) {
                        var pulledColumn = getColumn(i);
                        pullRow(pulledColumn);
                        setColumn(i, pulledColumn);
                    }
                    break;
            }

            gui.updateUI();
        };

        self.print = function() {
            var outText = '';
            for (var i = 0; i < grid.length; i++) {
                for (var j = 0; j < grid[i].length; j++) {
                    outText += grid[i][j].tileType;
                }
                outText += "\n";
            }
            console.log(outText);
        };

    };
});