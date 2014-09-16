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
        var pushLine = function(row) {

            var movedTilesCount = 0;

            for (var i = row.length - 2; i >= 0; i--) {
                var currentCell = row[i];

                if (currentCell.length > 0) {
                    var nextOpenCell = currentCell;
                    for (var j = i + 1; j < row.length; j++) {
                        var candidateCell = row[j];
                        if (candidateCell.length === 0) {
                            nextOpenCell = candidateCell;
                            movedTilesCount ++;
                        } else if (candidateCell[0].tileType == currentCell[0].tileType) {
                            nextOpenCell = candidateCell;
                            movedTilesCount ++;
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

            return movedTilesCount;
        };

        // Pulls a row by pushing in the opposite direction
        var pullLine = function(row) {
            row.reverse();
            var movedTilesCount = pushLine(row);
            row.reverse();
            return movedTilesCount;
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
            var hasMerged = false;
            for (var i = 0; i < grid.length; i++) {
                for (var j = 0; j < grid[i].length; j++) {
                    var gridCell = grid[i][j];
                    var mergedTiles = [];
                    while (gridCell.length > 1) {
                        mergedTiles.push(gridCell.pop());
                        hasMerged = true;
                    }
                    if (mergedTiles.length > 0) {
                        if (self.onTileMerge) {
                            self.onTileMerge(mergedTiles);
                        }
                    }
                }
            }

            return hasMerged;
        };

        // Checks if the grid is full
        self.isFull = function() {
            for (var i = 0; i < grid.length; i++) {
                for (var j = 0; j < grid[i].length; j++) {
                    if (grid[i][j].length === 0) {
                        return false;
                    }
                }
            }
            return true;
        };

        // Checks if the grid id gridlocked
        self.isGridLocked = function() {
            if (!self.isFull()) {
                return false;
            }

            for (var i = 0; i < grid.length; i++) {
                var row = getRow(i);
                for (var j = 0; j < (row.length - 1); j++) {
                    if (row[j][0].tileType === row[j + 1][0].tileType) {
                        return false;
                    }
                }

                var column = getColumn(i);
                for (var k = 0; k < (column.length - 1); k++) {
                    if (column[k][0].tileType === column[k + 1][0].tileType) {
                        return false;
                    }
                }
            }

            return true;
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
        self.getRandomEmptyCell = function() {
            var openRows = [];

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

            var randomColumn = openColumns[Math.floor(Math.random() * (openColumns.length))];

            return new Position(randomRow, randomColumn);
        };

        // Adds a tile to the grid
        self.addTile = function(tile) {
            grid[tile.position.row][tile.position.column].push(tile);
        };

        // Shunts the grid in a given direction
        self.move = function(direction) {

            var movedTilesCount = 0;

            switch (direction) {
                case Direction.RIGHT:
                    for (var i = 0; i < grid.length; i++) {
                        var pushedRow = getRow(i);
                        movedTilesCount += pushLine(pushedRow);
                        setRow(i, pushedRow);
                    }
                    break;

                case Direction.DOWN:
                    for (var j = 0; j < grid.length; j++) {
                        var pushedColumn = getColumn(j);
                         movedTilesCount += pushLine(pushedColumn);
                        setColumn(j, pushedColumn);
                    }
                    break;

                case Direction.LEFT:
                    for (var k = 0; k < grid.length; k++) {
                        var pulledRow = getRow(k);
                         movedTilesCount += pullLine(pulledRow);
                        setRow(k, pulledRow);
                    }
                    break;

                case Direction.UP:
                    for (var l = 0; l < grid.length; l++) {
                        var pulledColumn = getColumn(l);
                        movedTilesCount +=  pullLine(pulledColumn);
                        setColumn(l, pulledColumn);
                    }
                    break;
            }

            updateTiles();
            var hasMerged = collapse();
            var hasMoved =  movedTilesCount > 0;
            return { 'hasMerged' : hasMerged, 'hasMoved' : hasMoved};
        };
    };
});