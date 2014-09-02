define(['./Tile', './TileType', './Direction'], function(Tile, TileType, Direction) {
    return function Grid(gridSize, gui) {

        var self = this;
        var grid = [];

        for (var i = 0; i < gridSize; i++) {
            grid.push([]);
            for (var j = 0; j < gridSize; j++) {
                grid[i][j] = [];
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
                var currentCell = row[i];

                if (currentCell.length > 0) {
                    var nextOpenCell = currentCell;
                    for (var j = i + 1; j < row.length; j++) {
                        var candidateCell = row[j];
                        if (candidateCell.length == 0) {
                            nextOpenCell = candidateCell;
                        } else if (candidateCell[0].tileType == currentCell[0].tileType) {
                            nextOpenCell = candidateCell;
                            break;
                        } else {
                            break;
                        }
                    }

                    if (nextOpenCell != currentCell) {
                        while (currentCell.length > 0) {
                            nextOpenCell.push(currentCell.pop());
                        }
                    }
                }
            }
        };

        var mergeTile = function(tile) {
            if (self.onTileMerge) {
                self.onTileMerge(tile);
            }
            gui.removeTile(tile);
        }

        var pullRow = function(row) {
            row.reverse();
            pushRow(row);
            row.reverse();
        };

        var updateTiles = function() {
            for (var i = 0; i < grid.length; i++) {
                for (var j = 0; j < grid[i].length; j++) {
                    for (var k = 0; k < grid[i][j].length; k++) {
                        grid[i][j][k].move(i, j);
                    }

                }
            }
        }

        var collapse = function() {
            for (var i = 0; i < grid.length; i++) {
                for (var j = 0; j < grid[i].length; j++) {
                    var gridCell = grid[i][j];
                    while (gridCell.length > 1) {
                        mergeTile(gridCell.pop());
                    }
                }
            }
        }

        self.clear = function() {
            for (var i = 0; i < grid.length; i++) {
                for (var j = 0; j < grid[i].length; j++) {
                    grid[i][j] = [];
                }
            }
            return grid;
        };

        self.addTile = function(tileType) {
            var openRows = [];

            for (var i = 0; i < grid.length; i++) {
                for (var k = 0; k < grid[i].length; k++) {
                    if (grid[i][k].length == 0) {
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
                if (grid[randomRow][j].length == 0) {
                    openColumns.push(j);
                }
            }
            var randomColumn = openColumns[Math.floor(Math.random() * (openColumns.length))];

            var newTile = new Tile(tileType);
            grid[randomRow][randomColumn].push(newTile);
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

            updateTiles();
            gui.updateUI();
            collapse();
        };

        self.onTileMerge = null;

        self.print = function() {
            var outText = '';
            for (var i = 0; i < grid.length; i++) {
                for (var j = 0; j < grid[i].length; j++) {
                    outText += grid[i][j][0] ? grid[i][j][0].tileType : TileType.EMPTY;
                }
                outText += "\n";
            }
            console.log(outText);
        };

    };
});