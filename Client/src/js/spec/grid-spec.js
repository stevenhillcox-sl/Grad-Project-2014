/* global describe, it, expect, beforeEach */
define(['../game/Grid', '../game/Tile', '../game/TileType', '../game/Position', '../game/Direction'], function(Grid, Tile, TileType, Position, Direction) {
	describe("Grid", function() {
		var gridSize = 2;
		var grid;

		beforeEach(function() {
			grid = new Grid(gridSize);
		});

		describe("isEmpty", function() {
			it("is not full when created", function() {
				expect(grid.isEmpty()).toBe(true);
			});
		});

		describe("isFull", function() {
			it("correctly identifies a full grid", function() {
				grid.addTile(new Tile(TileType.RED, {
					row: 0,
					column: 0
				}));
				grid.addTile(new Tile(TileType.BLUE, {
					row: 0,
					column: 1
				}));
				grid.addTile(new Tile(TileType.GREEN, {
					row: 1,
					column: 0
				}));
				grid.addTile(new Tile(TileType.YELLOW, {
					row: 1,
					column: 1
				}));
				expect(grid.isFull()).toBe(true);
			});
		});

		describe("isGridLocked", function() {
			it("identifies a gridlocked grid", function() {
				grid.addTile(new Tile(TileType.RED, {
					row: 0,
					column: 0
				}));
				grid.addTile(new Tile(TileType.BLUE, {
					row: 0,
					column: 1
				}));
				grid.addTile(new Tile(TileType.GREEN, {
					row: 1,
					column: 0
				}));
				grid.addTile(new Tile(TileType.YELLOW, {
					row: 1,
					column: 1
				}));

				expect(grid.isFull()).toBe(true);
				expect(grid.isGridLocked()).toBe(true);
			});

			it("won't consider a grid with avaliale moves gridlocked", function() {
				grid.addTile(new Tile(TileType.RED, {
					row: 0,
					column: 0
				}));
				grid.addTile(new Tile(TileType.RED, {
					row: 0,
					column: 1
				}));
				grid.addTile(new Tile(TileType.GREEN, {
					row: 1,
					column: 0
				}));
				grid.addTile(new Tile(TileType.YELLOW, {
					row: 1,
					column: 1
				}));

				expect(grid.isFull()).toBe(true);
				expect(grid.isGridLocked()).toBe(false);
			});
		});

		describe("clear", function() {
			it("clears the grid", function() {
				grid.addTile(new Tile(TileType.RED, {
					row: 0,
					column: 0
				}));
				grid.addTile(new Tile(TileType.RED, {
					row: 0,
					column: 1
				}));
				grid.addTile(new Tile(TileType.GREEN, {
					row: 1,
					column: 0
				}));
				grid.addTile(new Tile(TileType.YELLOW, {
					row: 1,
					column: 1
				}));

				expect(grid.isFull()).toBe(true);
				grid.clear();
				expect(grid.isFull()).toBe(false);
				expect(grid.isEmpty()).toBe(true);
			});
		});

		describe("getRandomEmptyCell", function() {
			it("will pick a position from an empty grid", function() {
				var position = grid.getRandomEmptyCell();
				expect(position instanceof Position).toBe(true);
				expect(position.row).toBeGreaterThan(-1);
				expect(position.row).toBeLessThan(gridSize);
				expect(position.column).toBeGreaterThan(-1);
				expect(position.column).toBeLessThan(gridSize);
			});

			it("will return null for a full grid", function() {
				grid.addTile(new Tile(TileType.RED, {
					row: 0,
					column: 0
				}));
				grid.addTile(new Tile(TileType.RED, {
					row: 0,
					column: 1
				}));
				grid.addTile(new Tile(TileType.GREEN, {
					row: 1,
					column: 0
				}));
				grid.addTile(new Tile(TileType.YELLOW, {
					row: 1,
					column: 1
				}));

				var position = grid.getRandomEmptyCell();
				expect(position).toBeNull();
			});
		});

		describe("move", function() {

			var tileRed = null;
			var tileBlue = null;

			beforeEach(function() {
				tileRed = new Tile(TileType.RED, {
					row: 0,
					column: 0
				});

				tileBlue = new Tile(TileType.BLUE, {
					row: 1,
					column: 1
				});

				grid.addTile(tileRed);
				grid.addTile(tileBlue);
			});

			it("correctly moves a grid to the right", function() {
				grid.move(Direction.RIGHT);
				expect(tileRed.position).toEqual(new Position(0, 1));
				expect(tileBlue.position).toEqual(new Position(1, 1));
			});

			it("correctly moves a grid to the left", function() {
				grid.move(Direction.LEFT);
				expect(tileRed.position).toEqual(new Position(0, 0));
				expect(tileBlue.position).toEqual(new Position(1, 0));
			});

			it("correctly moves a grid down", function() {
				grid.move(Direction.DOWN);
				expect(tileRed.position).toEqual(new Position(1, 0));
				expect(tileBlue.position).toEqual(new Position(1, 1));
			});

			it("correctly moves a grid up", function() {
				grid.move(Direction.UP);
				expect(tileRed.position).toEqual(new Position(0, 0));
				expect(tileBlue.position).toEqual(new Position(0, 1));
			});

			it("correctly merges tiles together", function() {
				var tileRed2 = new Tile(TileType.RED, {
					row: 0,
					column: 1
				});
				grid.addTile(tileRed2);
				var mergedTiles = [];
				grid.onTileMerge = function(tiles) {
					mergedTiles = tiles;
				};

				grid.move(Direction.RIGHT);
				expect(tileRed2.position).toEqual(new Position(0, 1));
				expect(tileBlue.position).toEqual(new Position(1, 1));
				expect(tileRed.position).toEqual(new Position(0, 1));

				expect(mergedTiles.length).toBe(1);
				expect(mergedTiles[0]).toEqual(tileRed);
			});

			it("correctly merges multiple tiles together", function() {
				grid = new Grid(3);
				tileRed1 = new Tile(TileType.RED, {
					row: 0,
					column: 0
				});

				tileRed2 = new Tile(TileType.RED, {
					row: 0,
					column: 1
				});

				tileRed3 = new Tile(TileType.RED, {
					row: 0,
					column: 2
				});

				grid.addTile(tileRed1);
				grid.addTile(tileRed2);
				grid.addTile(tileRed3);

				var mergedTiles = [];
				grid.onTileMerge = function(tiles) {
					mergedTiles = tiles;
				};

				grid.move(Direction.RIGHT);
				expect(tileRed1.position).toEqual(new Position(0, 2));
				expect(tileRed2.position).toEqual(new Position(0, 2));
				expect(tileRed3.position).toEqual(new Position(0, 2));

				expect(mergedTiles.length).toBe(2);
				expect(mergedTiles[0]).toEqual(tileRed1);
				expect(mergedTiles[1]).toEqual(tileRed2);
			});
		});
	});
});