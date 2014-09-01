/* global Tile */
var self = this;

var Direction = {
    UP : 'UP',
    DOWN : 'DOWN',
    LEFT : 'LEFT',
    RIGHT : 'RIGHT'
};

var TileType = {
    EMPTY : '*',
    RED : 'R',
    BLUE : 'B',
    GREEN :'G',
    YELLOW : 'Y'
};

var TileClass = {
    '*' : '',
    R : 'tile-red',
    B : 'tile-blue',
    G : 'tile-green',
    Y : 'tile-yellow'
};

function Tile(type){
    this.type = type;
    this.cssClass = TileClass[type];
    this.x = 0;
    this.y = 0;
    this.id = null;
}

var tileCount = 0;

var tileOrder = [TileType.RED, TileType.BLUE];
var currentTileType = 0;

var getNextTileType = function(){
    return tileOrder[(currentTileType++)%(tileOrder.length)];
};

var createGrid = function(gridSize){
    var grid = [];
    
    for(var i = 0; i < gridSize; i++) {
        grid.push([]);
        for(var j = 0; j < gridSize; j++) {
            grid[i][j] = null;
        }
    }
    
    return grid;
};

var clearGrid = function(grid){
    
    for(var i = 0; i < grid.length; i++) {
        for(var j = 0; j < grid[i].length; j++) {
            grid[i][j] = new Tile(TileType.EMPTY);
        }
    }
    
    return grid;
};

var getRow = function(grid, rowNumber){
    return grid[rowNumber].slice(0);
};

var getColumn = function(grid, columnNumber){
    var column = [];
    for(var i = 0; i < grid.length; i++){
        column.push(grid[i][columnNumber]);
    }
    return column;
};

var setRow = function(grid, rowNumber, row){
    grid[rowNumber] = row;
};

var setColumn = function(grid, columnNumber, column){
    for(var i = 0; i < grid.length; i++){
        grid[i][columnNumber] = column[i];
    }
};

var pushRow = function(row){
    for(var i = row.length - 2; i >= 0; i--){
        var currentTile = row[i];
        var destroy = false;
        if(currentTile.type != TileType.EMPTY){
            var nextOpenCell = i;
            for(var j = i+1; j < row.length; j++){
                if(row[j].type == TileType.EMPTY){
                    nextOpenCell = j;
                } else if(row[j].type == currentTile.type){
                    destroy = true;
                    nextOpenCell = j;
                    break;
                } else {
                    break;
                }
            }
            
            row[i] = new Tile(TileType.EMPTY);
            
            if(destroy){
                removeUITile(row[nextOpenCell]);
            }
            
            row[nextOpenCell] = currentTile;
            
        }
    }
};

var pullRow = function(row){
    row.reverse();
    pushRow(row);
    row.reverse();
};

var addTile = function(grid, tileType){
    var openRows = [];
    
    for(var i = 0; i < grid.length; i++){
        for(var k = 0; k < grid[i].length; k++){
            if(grid[i][k].type == TileType.EMPTY){
                openRows.push(i);
                break;
            }
        }
    }
    
    if(openRows.length === 0){
        return;
    }
    
    var randomRow = openRows[Math.floor(Math.random()*(openRows.length))];
    
    var openColumns = [];
    for(var j = 0; j < grid[randomRow].length; j++){
        if(grid[randomRow][j].type == TileType.EMPTY){
            openColumns.push(j);
        }
    }
    
    var randomColumn = openColumns[Math.floor(Math.random()*(openColumns.length))];

    var newTile = new Tile(tileType);
    newTile.id = 'tile-'+(tileCount ++);

    grid[randomRow][randomColumn] = newTile;
    
    addUITile(newTile, randomColumn, randomRow);
};

var moveGrid = function(grid, direction){
    switch(direction){
        case Direction.RIGHT:
            for(var i = 0; i < grid.length; i++){
                var pushedRow = getRow(grid, i);
                pushRow(pushedRow);
                setRow(grid, i, pushedRow);
            }
            break;
            
        case Direction.DOWN:
            for(var i = 0; i < grid.length; i++){
                var pushedColumn = getColumn(grid, i);
                pushRow(pushedColumn);
                setColumn(grid, i, pushedColumn);
            }
            break;
            
        case Direction.LEFT:
            for(var i = 0; i < grid.length; i++){
                var pulledRow = getRow(grid, i);
                pullRow(pulledRow);
                setRow(grid, i, pulledRow);
            }
            break;
        
        case Direction.UP:
            for(var i = 0; i < grid.length; i++){
                var pulledColumn = getColumn(grid, i);
                pullRow(pulledColumn);
                setColumn(grid, i, pulledColumn);
            }
            break;
    }
    updateUIGrid(self.grid);
};

var removeUITile = function(tile){
    $('#'+tile.id).remove();
};

var addUITile = function(tile, x, y){
    var $newTile = $("<div>", { class: "tile", id : tile.id });
    $newTile.addClass(tile.cssClass);
    $newTile.css({top: y * 121.25 , left: x * 121.25});
    $(".tile-container").append($newTile);
    $newTile.css({width: 0, height:0});
    $newTile.animate({width: 106.25, height:106.25});
};

var updateUIGrid = function(grid){
    for(var i = 0; i < grid.length; i++){
        for(var j = 0; j < grid[i].length; j++){
            var tile = grid[i][j];
            // $('#'+tile.id).css({top: i * 121.25 , left: j * 121.25});
            $('#'+tile.id).animate({ top : i * 121.25, left : j * 121.25});
        }
    }
};

var printGrid = function(grid){
    var outText = '';
    for(var i = 0; i < grid.length; i++){
        for(var j = 0; j < grid[i].length; j++){
            outText += grid[i][j].type;
        }
        outText += "\n";
    }
    console.log(outText);
};

$(window).keydown(function (event){
    var KEYLEFT = 37;
    var KEYUP = 38;
    var KEYRIGHT = 39;
    var KEYDOWN = 40;
    
    var direction = null;
    
    switch(event.keyCode){
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
    
    if(direction){
        moveGrid(self.grid, direction);
        addTile(self.grid, getNextTileType());
        updateUIGrid(self.grid);
    }
});


// Testing
var grid = createGrid(4);
clearGrid(grid);
addTile(grid, getNextTileType());
addTile(grid, getNextTileType());