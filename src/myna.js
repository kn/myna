
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
    Myna.VERSION = '0.2.0';
    Myna.noConflict = function() {
      root.Myna = previousMyna;
      return this;
    };
    /*
      # Compiles tweet text to machine speakable text.
    */
    Myna.compile = function(tweet, args) {
      var endContext, hashtags, mentions, speakable, startContext, text;
      text = tweet.text;
      speakable = tweet.user.name;
      mentions = tweet.entities.user_mentions;
      hashtags = tweet.entities.hashtags;
      text = Myna._handle_special_cases(text);
      startContext = " " + (Myna._get_start_context(mentions, text)) + ": \"";
      text = Myna._slice_context(text);
      endContext = Myna._get_end_context(text);
      text = Myna._replace_ht_with_speakable(text);
      text = Myna._replace_rt_with_speakable(mentions, text);
      text = Myna._replace_mentions_with_speakable(mentions, text);
      text = Myna._replace_hashtags_with_speakable(hashtags, text);
      if (args && args.withURL) {
        text = Myna._replace_urls_with_speakable(tweet.entities.urls, text);
      } else {
        text = Myna._remove_urls(tweet.entities.urls, text);
      }
      return speakable += "" + startContext + text + endContext;
    };
    Myna._get_start_context = function(mentions, text) {
      var in_reply_to, in_reply_to_array, match, name;
      if (text.match(/^OH[\s:]/)) {
        return "overheard";
      } else if (match = text.match(/^RT\s@(\w+):/)) {
        name = Myna._get_name_by_screen_name(mentions, match[1]);
        return "retweeted a tweet of " + name;
      } else if (text.match(/^RT[\s:]/)) {
        return "retweeted";
      } else if (text.match(/^(@\w+\s)+/)) {
        in_reply_to_array = Myna._get_in_reply_to_array(mentions);
        in_reply_to = Myna._en_and_join(in_reply_to_array);
        return "tweeted in reply to " + in_reply_to;
      } else {
        return "tweeted";
      }
    };
    Myna._get_end_context = function(text) {
      return "\"";
    };
    Myna._slice_context = function(text) {
      return text.replace(/^(OH[\s:]|RT\s@(\w+):|RT[\s:]|(@\w+\s)+)/, "").trim();
    };
    Myna._replace_rt_with_speakable = function(mentions, text) {
      var match, name;
      if (match = text.match(/\sRT\s@(\w+):\s/)) {
        name = Myna._get_name_by_screen_name(mentions, match[1]);
        text = text.replace(/\sRT\s@\w+:\s/, " in reply to a tweet of " + name + ": ");
      }
      return text.replace(/\sRT(\s|:\s)/, " in reply to: ");
    };
    Myna._replace_ht_with_speakable = function(text) {
      return text.replace(/HT:?/, "Heard through");
    };
    Myna._replace_hashtags_with_speakable = function(hashtags, text) {
      var hashtag, regex, _i, _len;
      hashtags = text.match(/#\w+/g);
      if (hashtags != null) {
        for (_i = 0, _len = hashtags.length; _i < _len; _i++) {
          hashtag = hashtags[_i];
          regex = new RegExp(hashtag);
          text = text.replace(regex, Myna._spacify(hashtag.slice(1, (hashtag.length - 1) + 1 || 9e9)));
        }
      }
      return text;
    };
    Myna._replace_urls_with_speakable = function(urls, text) {
      var readableUrl, regex, url, _i, _len;
      for (_i = 0, _len = urls.length; _i < _len; _i++) {
        url = urls[_i];
        if (url.display_url) {
          readableUrl = url.display_url;
        } else if (url.expanded_url) {
          readableUrl = url.expanded_url;
        } else {
          readableUrl = url.url;
        }
        readableUrl = readableUrl.replace(/^https?:\/\//, "");
        readableUrl = readableUrl.replace(/^([^\/]+)\/.*$/, "$1");
        readableUrl = readableUrl.replace(/\./g, " dot ");
        regex = new RegExp("" + url.display_url + "|" + url.url);
        text = text.replace(regex, "(Link to " + readableUrl + ")");
      }
      return text;
    };
    Myna._remove_urls = function(urls, text) {
      var regex, url, _i, _len;
      for (_i = 0, _len = urls.length; _i < _len; _i++) {
        url = urls[_i];
        regex = new RegExp("\s?(" + url.display_url + "|" + url.url + ")\s?");
        text = text.replace(regex, " ");
      }
      return text.trim();
    };
    Myna._replace_mentions_with_speakable = function(mentions, text) {
      var mention, regex, _i, _len;
      for (_i = 0, _len = mentions.length; _i < _len; _i++) {
        mention = mentions[_i];
        regex = new RegExp("@" + mention.screen_name, "i");
        text = text.replace(regex, mention.name);
      }
      return text;
    };
    Myna._handle_special_cases = function(text) {
      text = text.replace(/^\./, "");
      text = text.replace(/\sw\/\s/, " with ");
      text = text.replace(/\s?:=?[)pD]\s?/g, " ");
      return text;
    };
    Myna._get_name_by_screen_name = function(mentions, sn) {
      var mention, _i, _len;
      for (_i = 0, _len = mentions.length; _i < _len; _i++) {
        mention = mentions[_i];
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
