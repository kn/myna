describe "myna", ->
  tweet = {}
  
  beforeEach ->
    Myna = window.Myna
    entities = {
      "urls": [],
      "hashtags": [],
      "user_mentions": []
    }
    user = {
      "id": 29733,
      "name": "Katsuya Noguchi",
      "screen_name": "kn"
    }
    tweet = {
      "text": "",
      "user": user,
      "entities": entities
    }
  
  it "has Myna.compile defined as a function", ->
    expect(typeof Myna.compile).toEqual 'function'
  
  describe "In case of no entities", ->
    beforeEach ->
      tweet.text = "I am testing Myna."
      
    it "adds 'user.name tweeted' at the beginning", ->
      compiledText = "Katsuya Noguchi tweeted: #{tweet.text}" 
      expect(Myna.compile(tweet)).toEqual compiledText
    
    it "replaces 'OH' at the beginning to 'overheard'", ->
      compiledText = "Katsuya Noguchi overheard: #{tweet.text}"
      tweet.text = "OH #{tweet.text}"
      expect(Myna.compile(tweet)).toEqual compiledText
      
    it "replaces 'OH:' at the beginning to 'overheard'", ->
      compiledText = "Katsuya Noguchi overheard: #{tweet.text}"
      tweet.text = "OH: #{tweet.text}"
      expect(Myna.compile(tweet)).toEqual compiledText
    
    it "replaces 'RT' at the begining to 'retweeted", ->
      compiledText = "Katsuya Noguchi retweeted: #{tweet.text}"
      tweet.text = "RT #{tweet.text}"
      expect(Myna.compile(tweet)).toEqual compiledText
    
    it "replaces 'RT:' at the begining to 'retweeted", ->
      compiledText = "Katsuya Noguchi retweeted: #{tweet.text}"
      tweet.text = "RT: #{tweet.text}"
      expect(Myna.compile(tweet)).toEqual compiledText
    
    it "replaces 'RT' in the tweet to 'Retweeted:'", ->
      compiledText = "Katsuya Noguchi tweeted: Passed! in reply to: #{tweet.text}"
      tweet.text = "Passed! RT #{tweet.text}"
      expect(Myna.compile(tweet)).toEqual compiledText
    
    it "replaces 'RT:' in the tweet to 'Retweeted:'", ->
      compiledText = "Katsuya Noguchi tweeted: Passed! in reply to: #{tweet.text}"
      tweet.text = "Passed! RT: #{tweet.text}"
      expect(Myna.compile(tweet)).toEqual compiledText
  
  describe "In case of mentions", ->
    beforeEach ->
      tweet.text = "I am testing Myna."
    
    it "replaces 'RT @screen_name:' at the beginning to 'retweeted a tweet of name'", ->
      mentions = [{
        "name": "Jack Dorsey",
        "id": 15473839,
        "indices": [4, 8],
        "screen_name": "jack"
      }]
      tweet.entities.user_mentions = mentions
      compiledText = "Katsuya Noguchi retweeted a tweet of Jack Dorsey: #{tweet.text}"
      tweet.text = "RT @jack: #{tweet.text}"
      expect(Myna.compile(tweet)).toEqual compiledText

    it "replaces 'RT @screen_name:' in the tweet to 'in reply to a tweet of name'", ->
      mentions = [{
        "name": "Jack Dorsey",
        "id": 15473839,
        "indices": [11, 15],
        "screen_name": "jack"
      }]
      tweet.entities.user_mentions = mentions
      compiledText = "Katsuya Noguchi tweeted: Passed! in reply to a tweet of Jack Dorsey: #{tweet.text}"
      tweet.text = "Passed! RT @jack: #{tweet.text}"
      expect(Myna.compile(tweet)).toEqual compiledText
    
    it "replaces reply mentions at the beginning to array of names", ->
      mentions = [{
        "name": "Jack Dorsey",
        "id": 15473839,
        "indices": [0, 4],
        "screen_name": "jack"
      }, {
        "name": "Dick Costolo",
        "id": 15473840,
        "indices": [6, 10],
        "screen_name": "dick"
      }, {
        "name": "Michael Jackson",
        "id": 154737777,
        "indices": [12, 14],
        "screen_name": "mj"
      }]
      tweet.entities.user_mentions = mentions
      compiledText = "Katsuya Noguchi tweeted in reply to Jack Dorsey, Dick Costolo and Michael Jackson: #{tweet.text}"
      tweet.text = "@jack @dick @mj #{tweet.text}"
      expect(Myna.compile(tweet)).toEqual compiledText