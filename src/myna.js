
  (function() {
    var Myna, previousMyna, root;
    root = this;
    previousMyna = root.Myna;
    Myna = {};
    if (typeof exports !== 'undefined') {
      Myna = exports;
    } else {
      Myna = root.Myna = {};
    }
    Myna.VERSION = '0.0.0';
    Myna.noConflict = function() {
      root.Myna = previousMyna;
      return this;
    };
    Myna.compile = function(tweet) {
      var in_reply_to, in_reply_to_array, match, sliceFrom, speakable, text;
      text = tweet.text;
      speakable = tweet.user.name;
      if (text.match(/^OH[\s:]/)) {
        text = text.slice(3, text.length + 1 || 9e9);
        speakable += " overheard";
      } else if (match = text.match(/^RT\s@(\w+):/)) {
        speakable += " retweeted a tweet of " + (spacify(match[1]));
        sliceFrom = 5 + match[1].length;
        text = text.slice(sliceFrom, text.length + 1 || 9e9);
      } else if (text.match(/^RT[\s:]/)) {
        speakable += " retweeted";
        text = text.slice(3, text.length + 1 || 9e9);
      } else {
        speakable += " tweeted";
      }
      if (tweet.in_reply_to_user_id) {
        in_reply_to_array = get_in_reply_to_array(tweet.entities.user_mentions);
        sliceFrom = tweet.entities.user_mentions[in_reply_to_array.length - 1].indices[1] + 2;
        text = text.slice(sliceFrom, text.length + 1 || 9e9);
        in_reply_to = in_reply_to_array.join(" and ");
        speakable += " in reply to " + in_reply_to;
      }
      speakable += ": ";
      text.replace(/\sRT\s@(\w+):/, "Retweeted a tweet of " + (spacify($1)));
      return text.replace(/\sRT[\s:]/, " Retweeted, ");
    };
    return {
      spacify: function(text) {
        text.replace(/[A-Z]/, " $1");
        if (text[0] === ' ') text = text.slice(1, text.length + 1 || 9e9);
        return text;
      },
      get_in_reply_to_array: function(mentions) {
        var arr, lastIndex, mention, _i, _len;
        arr = [];
        if (mentions) {
          lastIndex = 0;
          for (_i = 0, _len = mentions.length; _i < _len; _i++) {
            mention = mentions[_i];
            if (mention.indices[0] - lastIndex < 2) {
              arr.push(mention.name);
              lastIndex = mention.indices[1];
            } else {
              break;
            }
          }
        }
        return arr;
      }
    };
  }).call(this);
