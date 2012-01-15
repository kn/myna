
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
      var in_reply_to, in_reply_to_array, match, name, sliceFrom, speakable, text, _ref;
      text = tweet.text;
      speakable = tweet.user.name;
      if (text.match(/^OH[\s:]/)) {
        text = text.slice(3, text.length + 1 || 9e9).trim();
        console.log(text);
        speakable += " overheard";
      } else if (match = text.match(/^RT\s@(\w+):/)) {
        name = Myna._get_name_by_screen_name(tweet, match[1]);
        speakable += " retweeted a tweet of " + name;
        sliceFrom = 5 + match[1].length;
        text = text.slice(sliceFrom, text.length + 1 || 9e9).trim();
      } else if (text.match(/^RT[\s:]/)) {
        speakable += " retweeted";
        text = text.slice(3, text.length + 1 || 9e9).trim();
      } else {
        speakable += " tweeted";
      }
      if (((_ref = tweet.entities.user_mentions[0]) != null ? _ref.indices[0] : void 0) === 0) {
        in_reply_to_array = Myna._get_in_reply_to_array(tweet.entities.user_mentions);
        sliceFrom = tweet.entities.user_mentions[in_reply_to_array.length - 1].indices[1] + 2;
        text = text.slice(sliceFrom, text.length + 1 || 9e9);
        in_reply_to = Myna._en_and_join(in_reply_to_array);
        speakable += " in reply to " + in_reply_to;
      }
      speakable += ": ";
      if (match = text.match(/\sRT\s@(\w+):\s/)) {
        name = Myna._get_name_by_screen_name(tweet, match[1]);
        text = text.replace(/\sRT\s@\w+:\s/, " in reply to a tweet of " + name + ": ");
      }
      text = text.replace(/\sRT(\s|:\s)/, " in reply to: ");
      return speakable += text;
    };
    Myna._get_name_by_screen_name = function(tweet, sn) {
      var mention, _i, _len, _ref;
      _ref = tweet.entities.user_mentions;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        mention = _ref[_i];
        if (mention.screen_name === sn) return mention.name;
      }
    };
    Myna._en_and_join = function(items) {
      var ret;
      if (items.length === 1) {
        return items[0];
      } else if (items.length === 2) {
        return "" + items[0] + " and " + items[1];
      } else if (items.length > 2) {
        ret = items.slice(0, (items.length - 2) + 1 || 9e9).join(", ");
        return "" + ret + " and " + items[items.length - 1];
      }
    };
    Myna._spacify = function(text) {
      text = text.replace(/([A-Z])/g, " $1");
      return text.trim();
    };
    return Myna._get_in_reply_to_array = function(mentions) {
      var arr, lastIndex, mention, _i, _len;
      arr = [];
      if (mentions) {
        lastIndex = 0;
        for (_i = 0, _len = mentions.length; _i < _len; _i++) {
          mention = mentions[_i];
          if (mention.indices[0] - lastIndex < 3) {
            arr.push(mention.name);
            lastIndex = mention.indices[1];
          } else {
            break;
          }
        }
      }
      return arr;
    };
  }).call(this);
