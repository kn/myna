
  describe("myna", function() {
    var tweet;
    tweet = {};
    beforeEach(function() {
      var Myna, entities, user;
      Myna = window.Myna;
      entities = {
        "urls": [],
        "hashtags": [],
        "user_mentions": []
      };
      user = {
        "id": 29733,
        "name": "Katsuya Noguchi",
        "screen_name": "kn"
      };
      return tweet = {
        "text": "I am testing Myna.",
        "user": user,
        "entities": entities
      };
    });
    it("has Myna.compile defined as a function", function() {
      return expect(typeof Myna.compile).toEqual('function');
    });
    describe("Tweet with no entities", function() {
      it("adds 'user.name tweeted' at the beginning", function() {
        var compiledText;
        compiledText = "Katsuya Noguchi tweeted: \"" + tweet.text + "\"";
        return expect(Myna.compile(tweet)).toEqual(compiledText);
      });
      it("replaces 'OH' at the beginning to 'overheard'", function() {
        var compiledText;
        compiledText = "Katsuya Noguchi overheard: \"" + tweet.text + "\"";
        tweet.text = "OH " + tweet.text;
        return expect(Myna.compile(tweet)).toEqual(compiledText);
      });
      it("replaces 'OH:' at the beginning to 'overheard'", function() {
        var compiledText;
        compiledText = "Katsuya Noguchi overheard: \"" + tweet.text + "\"";
        tweet.text = "OH: " + tweet.text;
        return expect(Myna.compile(tweet)).toEqual(compiledText);
      });
      it("replaces 'RT' at the begining to 'retweeted", function() {
        var compiledText;
        compiledText = "Katsuya Noguchi retweeted: \"" + tweet.text + "\"";
        tweet.text = "RT " + tweet.text;
        return expect(Myna.compile(tweet)).toEqual(compiledText);
      });
      it("replaces 'RT:' at the begining to 'retweeted", function() {
        var compiledText;
        compiledText = "Katsuya Noguchi retweeted: \"" + tweet.text + "\"";
        tweet.text = "RT: " + tweet.text;
        return expect(Myna.compile(tweet)).toEqual(compiledText);
      });
      it("replaces 'RT' in the tweet to 'Retweeted:'", function() {
        var compiledText;
        compiledText = "Katsuya Noguchi tweeted: \"Passed! in reply to: " + tweet.text + "\"";
        tweet.text = "Passed! RT " + tweet.text;
        return expect(Myna.compile(tweet)).toEqual(compiledText);
      });
      return it("replaces 'RT:' in the tweet to 'Retweeted:'", function() {
        var compiledText;
        compiledText = "Katsuya Noguchi tweeted: \"Passed! in reply to: " + tweet.text + "\"";
        tweet.text = "Passed! RT: " + tweet.text;
        return expect(Myna.compile(tweet)).toEqual(compiledText);
      });
    });
    describe("Tweet with mentions", function() {
      it("replaces mentions in the tweet to name", function() {
        var compiledText, mentions;
        mentions = [
          {
            "name": "Barcelona FC",
            "id": 15473839,
            "indices": [7, 18],
            "screen_name": "BarcelonaFC"
          }, {
            "name": "Real Madrid",
            "id": 15473840,
            "indices": [59, 69],
            "screen_name": "RealMadrid"
          }
        ];
        tweet.entities.user_mentions = mentions;
        compiledText = "Katsuya Noguchi tweeted: \"Here's Barcelona FC preparing for the big game against Real Madrid\"";
        tweet.text = "Here's @BarcelonaFC preparing for the big game against @RealMadrid";
        return expect(Myna.compile(tweet)).toEqual(compiledText);
      });
      it("replaces 'RT @screen_name:' at the beginning to 'retweeted a tweet of name'", function() {
        var compiledText, mentions;
        mentions = [
          {
            "name": "Jack Dorsey",
            "id": 15473839,
            "indices": [4, 8],
            "screen_name": "jack"
          }
        ];
        tweet.entities.user_mentions = mentions;
        compiledText = "Katsuya Noguchi retweeted a tweet of Jack Dorsey: \"" + tweet.text + "\"";
        tweet.text = "RT @jack: " + tweet.text;
        return expect(Myna.compile(tweet)).toEqual(compiledText);
      });
      it("replaces 'RT @screen_name:' in the tweet to 'in reply to a tweet of name'", function() {
        var compiledText, mentions;
        mentions = [
          {
            "name": "Jack Dorsey",
            "id": 15473839,
            "indices": [11, 15],
            "screen_name": "jack"
          }
        ];
        tweet.entities.user_mentions = mentions;
        compiledText = "Katsuya Noguchi tweeted: \"Passed! in reply to a tweet of Jack Dorsey: " + tweet.text + "\"";
        tweet.text = "Passed! RT @jack: " + tweet.text;
        return expect(Myna.compile(tweet)).toEqual(compiledText);
      });
      return it("replaces reply mentions at the beginning to array of names", function() {
        var compiledText, mentions;
        mentions = [
          {
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
          }
        ];
        tweet.entities.user_mentions = mentions;
        compiledText = "Katsuya Noguchi tweeted in reply to Jack Dorsey, Dick Costolo and Michael Jackson: \"" + tweet.text + "\"";
        tweet.text = "@jack @dick @mj " + tweet.text;
        return expect(Myna.compile(tweet)).toEqual(compiledText);
      });
    });
    describe("Tweet with hashtags", function() {
      return it("replaces hashtags with the equivalent spacified word", function() {
        var compiledText, hashtags;
        hashtags = [
          {
            "text": "",
            "indices": []
          }
        ];
        tweet.entities.hashtags = hashtags;
        compiledText = "Katsuya Noguchi tweeted: \"I am testing Myna I Love SF and I Love NY\"";
        tweet.text = "I am testing #Myna #ILoveSF and #I_Love_NY";
        return expect(Myna.compile(tweet)).toEqual(compiledText);
      });
    });
    describe("Tweet with urls", function() {
      it("removes urls", function() {
        var compiledText, urls;
        urls = [
          {
            "url": "http://t.co/0JG5Mcq",
            "display_url": "display.twitter.com/2011/05/twitte…",
            "expanded_url": "http://blog.twitter.com/2011/05/twitter-for-mac-update.html",
            "indices": [84, 103]
          }
        ];
        tweet.entities.urls = urls;
        compiledText = "Katsuya Noguchi tweeted: \"Twitter for Mac is now easier and faster, and you can open multiple windows at once\"";
        tweet.text = "Twitter for Mac is now easier and faster, and you can open multiple windows at once http://t.co/0JG5Mcq";
        return expect(Myna.compile(tweet)).toEqual(compiledText);
      });
      return describe("with withURL option", function() {
        it("replaces urls with display_url if it is available", function() {
          var compiledText, urls;
          urls = [
            {
              "url": "http://t.co/0JG5Mcq",
              "display_url": "display.twitter.com/2011/05/twitte…",
              "expanded_url": "http://blog.twitter.com/2011/05/twitter-for-mac-update.html",
              "indices": [84, 103]
            }
          ];
          tweet.entities.urls = urls;
          compiledText = "Katsuya Noguchi tweeted: \"Twitter for Mac is now easier and faster, and you can open multiple windows at once (Link to display dot twitter dot com)\"";
          tweet.text = "Twitter for Mac is now easier and faster, and you can open multiple windows at once http://t.co/0JG5Mcq";
          return expect(Myna.compile(tweet, {
            withURL: true
          })).toEqual(compiledText);
        });
        it("replaces urls with expanded_url if it is display_url is not available", function() {
          var compiledText, urls;
          urls = [
            {
              "url": "http://t.co/0JG5Mcq",
              "expanded_url": "http://expanded.twitter.com/2011/05/twitter-for-mac-update.html",
              "indices": [84, 103]
            }
          ];
          tweet.entities.urls = urls;
          compiledText = "Katsuya Noguchi tweeted: \"Twitter for Mac is now easier and faster, and you can open multiple windows at once (Link to expanded dot twitter dot com)\"";
          tweet.text = "Twitter for Mac is now easier and faster, and you can open multiple windows at once http://t.co/0JG5Mcq";
          return expect(Myna.compile(tweet, {
            withURL: true
          })).toEqual(compiledText);
        });
        return it("replaces urls with host name of url if display_url and expanded_url are not available", function() {
          var compiledText, urls;
          urls = [
            {
              "url": "http://t.co/0JG5Mcq",
              "indices": [84, 103]
            }
          ];
          tweet.entities.urls = urls;
          compiledText = "Katsuya Noguchi tweeted: \"Twitter for Mac is now easier and faster, and you can open multiple windows at once (Link to t dot co)\"";
          tweet.text = "Twitter for Mac is now easier and faster, and you can open multiple windows at once http://t.co/0JG5Mcq";
          return expect(Myna.compile(tweet, {
            withURL: true
          })).toEqual(compiledText);
        });
      });
    });
    return describe("special cases", function() {
      return it("removes dot at the begining", function() {
        var compiledText, mentions;
        mentions = [
          {
            "name": "Jack Dorsey",
            "id": 15473839,
            "indices": [1, 5],
            "screen_name": "jack"
          }
        ];
        tweet.entities.user_mentions = mentions;
        compiledText = "Katsuya Noguchi tweeted in reply to Jack Dorsey: \"" + tweet.text + "\"";
        tweet.text = ".@jack " + tweet.text;
        return expect(Myna.compile(tweet)).toEqual(compiledText);
      });
    });
  });
