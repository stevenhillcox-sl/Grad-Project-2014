/* global describe, it, expect, beforeEach */
define(['../game/Grid', '../game/Tile', '../game/TileType', '../game/Position', '../game/Direction'], function(Grid, Tile, TileType, Position, Direction) {
	describe("Grid", function() {
		var gridSize = 2;
		var grid;

		beforeEach(function() {
			grid = new Grid(gridSize);
		});

		describe("isGridLocked", function() {
			it("is not full when created", function() {
				expect(grid.isFull()).toBe(false);
			});

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
				var gridStructure = grid._getGridStructure();
				expect(gridStructure).toEqual([
					[
						[],
						[]
					],
					[
						[],
						[]
					]
				]);
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

		describe("addTile", function() {
			it("correctly adds a tile to the grid", function() {
				var newTile = new Tile(TileType.RED, {
					row: 0,
					column: 0
				});
				grid.addTile(newTile);
				var gridStructure = grid._getGridStructure();
				expect(gridStructure).toEqual([
					[
						[newTile],
						[]
					],
					[
						[],
						[]
					]
				]);
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
				var gridStructure = grid._getGridStructure();
				expect(gridStructure).toEqual([
					[
						[],
						[tileRed]
					],
					[
						[],
						[tileBlue]
					]
				]);
			});

			it("correctly moves a grid to the left", function() {
				grid.move(Direction.LEFT);
				var gridStructure = grid._getGridStructure();
				expect(gridStructure).toEqual([
					[
						[tileRed],
						[]
					],
					[
						[tileBlue],
						[]
					]
				]);
			});

			it("correctly moves a grid down", function() {
				grid.move(Direction.DOWN);
				var gridStructure = grid._getGridStructure();
				expect(gridStructure).toEqual([
					[
						[],
						[]
					],
					[
						[tileRed],
						[tileBlue]
					]
				]);
			});

			it("correctly moves a grid up", function() {
				grid.move(Direction.UP);
				var gridStructure = grid._getGridStructure();
				expect(gridStructure).toEqual([
					[
						[tileRed],
						[tileBlue]
					],
					[
						[],
						[]
					]
				]);
			});

			it("correctly merges tiles together", function() {
				var tileRed2 = new Tile(TileType.RED, {
					row: 0,
					column: 1
				});
				grid.addTile(tileRed2);
				grid.move(Direction.RIGHT);
				var gridStructure = grid._getGridStructure();
				expect(gridStructure).toEqual([
					[
						[],
						[tileRed2]
					],
					[
						[],
						[tileBlue]
					]
				]);
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

				grid.move(Direction.RIGHT);
				var gridStructure = grid._getGridStructure();
				expect(gridStructure).toEqual([
					[
						[],
						[],
						[tileRed3]
					],
					[
						[],
						[],
						[]
					],
					[
						[],
						[],
						[]
					]
				]);
			});

			it("correctly updates tile positions", function(){

			});
		});
	});
});