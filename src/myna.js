
  (function() {
    var Myna, Regex, previousMyna, root;
    root = this;
    previousMyna = root.Myna;
    Myna = {};
    if (typeof exports !== 'undefined') {
      Myna = exports;
    } else {
      Myna = root.Myna = {};
    }
    Myna.noConflict = function() {
      root.Myna = previousMyna;
      return this;
    };
    /*
      # Regex used in Myna
    */
    Regex = Myna.Regex = {};
    Regex.buildRegex = function(regex, flags) {
      flags = flags != null ? flags : "";
      if (typeof regex !== "string") {
        if (regex.global && flags.indexOf("g") < 0) flags += "g";
        if (regex.ignoreCase && flags.indexOf("i") < 0) flags += "i";
        if (regex.multiline && flags.indexOf("m") < 0) flags += "m";
        regex = regex.source;
      }
      return new RegExp(regex.replace(/#\{(\w+)\}/g, function(match, name) {
        var newRegex;
        newRegex = Regex[name] || "";
        if (typeof newRegex !== "string") newRegex = newRegex.source;
        return newRegex;
      }), flags);
    };
    Regex.atSigns = "@＠";
    Regex.mention = Regex.buildRegex(/(^|[^a-zA-Z0-9_!#$%&*#{atSigns}])([#{atSigns}])([a-zA-Z0-9_]{1,20})/);
    Regex.oh_context = /^OH[\s:]/;
    Regex.rt_context = /^RT[\s:]/;
    Regex.rt_with_mention_context = Regex.buildRegex(/^RT#{mention}:/);
    Regex.reply_context = Regex.buildRegex(/^(#{mention})+/);
    Regex.rt_with_mention = /RT\s@(\w+):\s/;
    Regex.rt = /\sRT(\s|:\s)/;
    Regex.ht = /HT:?/;
    Regex["with"] = /\sw\/\s/g;
    Regex.smiley_face = /\s?:=?[)pD]\s?/g;
    Regex.and = /\s&\s/g;
    Regex.love = /\s(<3|&lt;3)\s/g;
    Regex.distractive_symbol = /[_;\^#]/g;
    Regex.double_spaces = /\s\s/g;
    Regex.hashtagBoundary = Regex.buildRegex(/(?:^|$|[^&\/a-z0-9_])/);
    Regex.hashtagAlphaNumeric = Regex.buildRegex(/[a-z0-9_]/i);
    Regex.hashtagAlpha = Regex.buildRegex(/[a-z_]/i);
    Regex.hashtags = Regex.buildRegex(/(#{hashtagBoundary})(#|＃)(#{hashtagAlphaNumeric}*#{hashtagAlpha}#{hashtagAlphaNumeric}*)/gi);
    /*
      # Compiles tweet text to machine speakable text.
    */
    Myna.compile = function(tweet, args) {
      var hashtags, media, mentions, speakable, startContext, text;
      text = tweet.text;
      speakable = tweet.user.name;
      mentions = tweet.entities.user_mentions;
      hashtags = tweet.entities.hashtags;
      media = tweet.entities.media;
      text = Myna._handle_special_cases(text);
      startContext = " " + (Myna._get_start_context(mentions, media, text)) + ": ";
      text = Myna._slice_context(text);
      text = Myna._remove_media_links(media, text);
      text = Myna._replace_ht_with_speakable(text);
      text = Myna._replace_rt_with_speakable(mentions, text);
      text = Myna._replace_mentions_with_speakable(mentions, text);
      text = Myna._replace_hashtags_with_speakable(hashtags, text);
      if (args && args.withURL) {
        text = Myna._replace_urls_with_speakable(tweet.entities.urls, text);
      } else {
        text = Myna._remove_urls(tweet.entities.urls, text);
      }
      text = Myna._remove_distractive_symbols(text);
      text = Myna._replace_symbols(text);
      return speakable += "" + startContext + text;
    };
    Myna._get_start_context = function(mentions, media, text) {
      var context, in_reply_to, in_reply_to_array, match, name;
      context = "";
      if (text.match(Regex.oh_context)) {
        context = "overheard";
      } else if (match = text.match(Regex.rt_with_mention_context)) {
        name = Myna._get_name_by_screen_name(mentions, match[3]);
        context = "retweeted a tweet of " + name;
      } else if (text.match(Regex.rt_context)) {
        context = "retweeted";
      } else if (text.match(Regex.reply_context)) {
        in_reply_to_array = Myna._get_in_reply_to_array(mentions);
        in_reply_to = Myna._en_and_join(in_reply_to_array);
        context = "tweeted in reply to " + in_reply_to;
      } else {
        context = "tweeted";
      }
      if (media && media.length > 0) context += " with " + media[0].type;
      return context;
    };
    Myna._slice_context = function(text) {
      text = text.replace(Regex.oh_context, "").trim();
      text = text.replace(Regex.rt_with_mention_context, "").trim();
      text = text.replace(Regex.rt_context, "").trim();
      text = text.replace(Regex.reply_context, "").trim();
      return text;
    };
    Myna._replace_rt_with_speakable = function(mentions, text) {
      var match, name;
      if (match = text.match(Regex.rt_with_mention)) {
        name = Myna._get_name_by_screen_name(mentions, match[1]);
        text = text.replace(match[0], "in reply to a tweet of " + name + ": ");
      }
      return text.replace(Regex.rt, " in reply to: ");
    };
    Myna._replace_ht_with_speakable = function(text) {
      return text.replace(Regex.ht, "Heard through");
    };
    Myna._replace_hashtags_with_speakable = function(hashtags, text) {
      var hashtag, regex, _i, _len;
      for (_i = 0, _len = hashtags.length; _i < _len; _i++) {
        hashtag = hashtags[_i];
        regex = new RegExp("#" + hashtag.text);
        text = text.replace(regex, Myna._spacify(hashtag.text));
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
    Myna._remove_media_links = function(media, text) {
      var m, regex, _i, _len;
      if (media) {
        for (_i = 0, _len = media.length; _i < _len; _i++) {
          m = media[_i];
          regex = new RegExp("\s?(" + m.display_url + "|" + m.url + ")\s?");
          text = text.replace(regex, " ");
        }
      }
      return text;
    };
    Myna._handle_special_cases = function(text) {
      text = text.replace(/^\./, "");
      return text;
    };
    Myna._replace_symbols = function(text) {
      text = text.replace(Regex["with"], " with ");
      text = text.replace(Regex.smiley_face, " ");
      text = text.replace(Regex.and, " and ");
      text = text.replace(Regex.love, " love ");
      return text;
    };
    Myna._remove_distractive_symbols = function(text) {
      text = text.replace(Regex.distractive_symbol, "");
      text = text.replace(Regex.double_spaces, " ");
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
