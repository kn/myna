describe "myna", ->
  
  beforeEach ->
    Myna = window.Myna
  
  it "should have Myna defined", ->
    expect(typeof Myna.compile).toEqual 'function'