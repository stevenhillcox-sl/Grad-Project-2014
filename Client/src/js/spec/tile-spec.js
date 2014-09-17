/* global describe, it, expect, beforeEach */
define(['../game/Tile', '../game/TileType', '../game/Position'], function(Tile, TileType, Position) {
	describe("Tile", function() {
		it("can be contructed with a tileType and position", function() {
			var position = new Position(1, 2);
			var tile = new Tile(TileType.RED, position);
			expect(tile.tileType).toBe(TileType.RED);
			expect(tile.position).toBe(position);
		});

		it("will have a default position if created without one given", function() {
			var tile = new Tile(TileType.EMPTY);
			expect(tile.position).toEqual(new Position(0, 0));
		});

		describe("setPosition", function() {
			it("correctly updates positions", function() {
				var position = new Position(1, 2);
				var tile = new Tile(TileType.RED);
				expect(tile.position).toEqual(new Position(0, 0));
				tile.setPosition(position);
				expect(tile.position).toBe(position);
			});
		});
	});
});