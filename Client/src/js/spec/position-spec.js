/* global describe, it, expect, beforeEach */
define(['../game/Position'], function(Position) {
	describe("Position", function() {
		it("will have a default position if created without any given values", function() {
			var position = new Position();
			expect(position.row).toBe(0);
			expect(position.column).toBe(0);
		});
	});
});