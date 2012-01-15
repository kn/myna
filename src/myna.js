
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
      var hashtag, hashtags, in_reply_to, in_reply_to_array, match, name, regex, sliceFrom, speakable, text, _i, _len, _ref;
      text = tweet.text;
      speakable = tweet.user.name;
      if (text.match(/^OH[\s:]/)) {
        text = text.slice(3, text.length + 1 || 9e9).trim();
        console.log(text);
        speakable += " overheard";
      } else if (match = text.match(/^RT\s@(\w+):/)) {
        name = Myna._get_name_by_screen_name(tweet.entities.user_mentions, match[1]);
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
        name = Myna._get_name_by_screen_name(tweet.entities.user_mentions, match[1]);
        text = text.replace(/\sRT\s@\w+:\s/, " in reply to a tweet of " + name + ": ");
      }
      text = text.replace(/\sRT(\s|:\s)/, " in reply to: ");
      text = Myna._replace_mentions_with_name(tweet.entities.user_mentions, text);
      hashtags = text.match(/#\w+/g);
      if (hashtags != null) {
        for (_i = 0, _len = hashtags.length; _i < _len; _i++) {
          hashtag = hashtags[_i];
          regex = new RegExp(hashtag);
          text = text.replace(regex, Myna._spacify(hashtag.slice(1, (hashtag.length - 1) + 1 || 9e9)));
        }
      }
      return speakable += text;
    };
    Myna._get_name_by_screen_name = function(mentions, sn) {
      var mention, _i, _len;
      for (_i = 0, _len = mentions.length; _i < _len; _i++) {
        mention = mentions[_i];
        if (mention.screen_name === sn) return mention.name;
      }
    };
    Myna._replace_mentions_with_name = function(mentions, text) {
      var mention, regex, _i, _len;
      for (_i = 0, _len = mentions.length; _i < _len; _i++) {
        mention = mentions[_i];
        regex = new RegExp("@" + mention.screen_name);
        text = text.replace(regex, mention.name);
      }
      return text;
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
      text = text.replace(/_/g, " ");
      text = text.replace(/([A-Z][a-z]+)/g, " $1 ");
      text = text.replace(/\s\s/g, " ");
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
