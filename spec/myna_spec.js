
  describe("myna", function() {
    beforeEach(function() {
      var Myna;
      return Myna = window.Myna;
    });
    return it("should have Myna defined", function() {
      return expect(typeof Myna.compile).toEqual('function');
    });
  });
