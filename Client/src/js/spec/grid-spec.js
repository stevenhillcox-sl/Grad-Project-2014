/* global describe, it, expect, beforeEach */
define(['../game/Grid', '../game/Tile', '../game/TileType'], function(Grid, Tile, TileType) {
	describe("Grid", function() {
		var grid;

		beforeEach(function() {
			grid = new Grid(2);
		});

		it("is not full when created", function() {
			expect(grid.isFull()).toBe(false);
		});

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
});