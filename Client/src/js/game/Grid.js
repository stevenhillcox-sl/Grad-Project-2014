define(['./Tile', './TileType', './Direction', './Position'], function(Tile, TileType, Direction, Position) {
    return function Grid(gridSize) {

        var self = this;
        var grid = [];

        self.onTileMerge = null;

        for (var i = 0; i < gridSize; i++) {
            grid.push([]);
            for (var j = 0; j < gridSize; j++) {
                grid[i][j] = [];
            }
        }

        // Returns a copy of a row
        var getRow = function(rowNumber) {
            return grid[rowNumber].slice(0);
        };

        // Returns a copy of a column
        var getColumn = function(columnNumber) {
            var column = [];
            for (var i = 0; i < grid.length; i++) {
                column.push(grid[i][columnNumber]);
            }
            return column;
        };

        // Sets a row in the grid to match a given row
        var setRow = function(rowNumber, row) {
            grid[rowNumber] = row;
        };

        // Sets a column in the grid to match a given column
        var setColumn = function(columnNumber, column) {
            for (var i = 0; i < grid.length; i++) {
                grid[i][columnNumber] = column[i];
            }
        };

        // Pushes tiles in a row, moving tiles into the furthest empty one or
        // adding it to a cell if that cell contains same typed tiles
        var pushRow = function(row) {
            for (var i = row.length - 2; i >= 0; i--) {
                var currentCell = row[i];

                if (currentCell.length > 0) {
                    var nextOpenCell = currentCell;
                    for (var j = i + 1; j < row.length; j++) {
                        var candidateCell = row[j];
                        if (candidateCell.length === 0) {
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

        // Pulls a row by pushing in the opposite direction
        var pullRow = function(row) {
            row.reverse();
            pushRow(row);
            row.reverse();
        };


        // Updates the positions stored in the tiles to match the grid
        var updateTiles = function() {
            for (var i = 0; i < grid.length; i++) {
                for (var j = 0; j < grid[i].length; j++) {
                    for (var k = 0; k < grid[i][j].length; k++) {
                        grid[i][j][k].setPosition(new Position(i, j));
                    }

                }
            }
        };

        // Collapses the grid, merging together tiles of the same type in the same cell
        var collapse = function() {
            for (var i = 0; i < grid.length; i++) {
                for (var j = 0; j < grid[i].length; j++) {
                    var gridCell = grid[i][j];
                    var mergedTiles = [];
                    while (gridCell.length > 1) {
                        mergedTiles.push(gridCell.pop());
                    }
                    if (mergedTiles.length > 0) {
                        if (self.onTileMerge) {
                            self.onTileMerge(mergedTiles);
                        }
                    }
                }
            }
        };

        // Clears out the grid
        self.clear = function() {
            for (var i = 0; i < grid.length; i++) {
                for (var j = 0; j < grid[i].length; j++) {
                    grid[i][j] = [];
                }
            }
            return grid;
        };

        // Searches the grid for an open slot and returns a random position
        // Returns null if the grid is full
        self.getRandomEmptyCell = function(exceptedPositions) {
            var openRows = [];
            if (!exceptedPositions) {
                exceptedPositions = [];
            }

            for (var i = 0; i < grid.length; i++) {
                for (var k = 0; k < grid[i].length; k++) {
                    if (grid[i][k].length === 0) {
                        openRows.push(i);
                        break;
                    }
                }
            }
            if (openRows.length === 0) {
                return null;
            }
            var randomRow = openRows[Math.floor(Math.random() * (openRows.length))];

            var openColumns = [];
            for (var j = 0; j < grid[randomRow].length; j++) {
                if (grid[randomRow][j].length === 0) {
                    openColumns.push(j);
                }
            }
            exceptedPositions.forEach(function(position) {
                if (position.row == randomRow && openColumns.indexOf(position.column) != -1) {
                    openColumns.splice(openColumns.indexOf(position.column), 1);
                }
            });

            var randomColumn = openColumns[Math.floor(Math.random() * (openColumns.length))];

            return new Position(randomRow, randomColumn);
        };

        // Adds a tile to the grid
        self.addTile = function(tile) {
            grid[tile.position.row][tile.position.column].push(tile);
        };

        // Shunts the grid in a given direction
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
                    for (var j = 0; j < grid.length; j++) {
                        var pushedColumn = getColumn(j);
                        pushRow(pushedColumn);
                        setColumn(j, pushedColumn);
                    }
                    break;

                case Direction.LEFT:
                    for (var k = 0; k < grid.length; k++) {
                        var pulledRow = getRow(k);
                        pullRow(pulledRow);
                        setRow(k, pulledRow);
                    }
                    break;

                case Direction.UP:
                    for (var l = 0; l < grid.length; l++) {
                        var pulledColumn = getColumn(l);
                        pullRow(pulledColumn);
                        setColumn(l, pulledColumn);
                    }
                    break;
            }

            updateTiles();
            collapse();
        };
    };
});