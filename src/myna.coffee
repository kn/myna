( ->
  root = this
  previousMyna = root.Myna

  Myna = {}
  if typeof exports != 'undefined'
    Myna = exports
  else
    Myna = root.Myna = {}

  Myna.VERSION = '0.2.0'

  Myna.noConflict = ->
    root.Myna = previousMyna
    @

  ###
  # Compiles tweet text to machine speakable text.
  ###
  Myna.compile = (tweet, args) ->
    text = tweet.text
    speakable = tweet.user.name
    mentions = tweet.entities.user_mentions
    hashtags = tweet.entities.hashtags

    text = Myna._handle_special_cases text

    startContext = " #{Myna._get_start_context mentions, text}: \""
    text = Myna._slice_context text
    endContext = Myna._get_end_context text

    text = Myna._replace_ht_with_speakable text

    text = Myna._replace_rt_with_speakable mentions, text

    text = Myna._replace_mentions_with_speakable mentions, text

    text = Myna._replace_hashtags_with_speakable hashtags, text

    if args && args.withURL
      text = Myna._replace_urls_with_speakable tweet.entities.urls, text
    else
      text = Myna._remove_urls tweet.entities.urls, text

    speakable += "#{startContext}#{text}#{endContext}"

  Myna._get_start_context = (mentions, text) ->
    if text.match /^OH[\s:]/
      "overheard"
    else if match = text.match /^RT\s@(\w+):/
      name = Myna._get_name_by_screen_name mentions, match[1]
      "retweeted a tweet of #{name}"
    else if text.match /^RT[\s:]/
      "retweeted"
    else if text.match /^(@\w+\s)+/
      in_reply_to_array = Myna._get_in_reply_to_array mentions
      in_reply_to = Myna._en_and_join in_reply_to_array
      "tweeted in reply to #{in_reply_to}"
    else
      "tweeted"

  Myna._get_end_context = (text) ->
    "\""

  Myna._slice_context = (text) ->
    text.replace(/^(OH[\s:]|RT\s@(\w+):|RT[\s:]|(@\w+\s)+)/, "").trim()

  Myna._replace_rt_with_speakable = (mentions, text) ->
    if match = text.match /\sRT\s@(\w+):\s/
      name = Myna._get_name_by_screen_name mentions, match[1]
      text = text.replace /\sRT\s@\w+:\s/, " in reply to a tweet of #{name}: "
    text.replace /\sRT(\s|:\s)/, " in reply to: "

  Myna._replace_ht_with_speakable = (text) ->
    text.replace /HT:?/, "Heard through"

  Myna._replace_hashtags_with_speakable = (hashtags, text) ->
    hashtags = text.match /#\w+/g
    if hashtags?
      for hashtag in hashtags
        regex = new RegExp hashtag
        text = text.replace regex, Myna._spacify(hashtag[1..hashtag.length-1])
    text

  Myna._replace_urls_with_speakable = (urls, text) ->
    for url in urls
      if url.display_url
        readableUrl = url.display_url
      else if url.expanded_url
        readableUrl = url.expanded_url
      else
        readableUrl = url.url
      readableUrl = readableUrl.replace /^https?:\/\//, ""
      readableUrl = readableUrl.replace /^([^\/]+)\/.*$/, "$1"
      readableUrl = readableUrl.replace /\./g, " dot "
      regex = new RegExp "#{url.display_url}|#{url.url}"
      text = text.replace regex, "(Link to #{readableUrl})"
    text
  
  Myna._remove_urls = (urls, text) ->
    for url in urls
      regex = new RegExp "\s?(#{url.display_url}|#{url.url})\s?"
      text = text.replace regex, " "
    text.trim()

  Myna._replace_mentions_with_speakable = (mentions, text) ->
    for mention in mentions
      regex = new RegExp "@#{mention.screen_name}", "i"
      text = text.replace regex, mention.name
    text

  Myna._handle_special_cases = (text) ->
    # Users sometimes uses . at the begining to publish replies.
    text = text.replace /^\./, ""
    # Replace w/ with 'with'
    text = text.replace /\sw\/\s/, " with "
    # Remove smiley faces
    text = text.replace /\s?:=?[)pD]\s?/g, " "
    text

  Myna._get_name_by_screen_name = (mentions, sn) ->
    for mention in mentions
      return mention.name if mention.screen_name == sn

  Myna._en_and_join = (items) ->
    if items.length== 1
      items[0]
    else if items.length == 2
      "#{items[0]} and #{items[1]}"
    else if items.length > 2
      ret = items[0..items.length-2].join ", "
      "#{ret} and #{items[items.length-1]}"

  # Spacify continuous text. e.g. ILoveTwitter -> I Love Twitter
  Myna._spacify = (text) ->
    text = text.replace /_/g, " "
    text = text.replace /([A-Z][a-z]+)/g, " $1 "
    text = text.replace /\s\s/g, " "
    text.trim()

  # Returns array of in reply to names. Assumes mentions are ordered by its indices.
  Myna._get_in_reply_to_array = (mentions) ->
    arr = []
    if mentions
      lastIndex = 0
      for mention in mentions
        if mention.indices[0] - lastIndex < 3
          arr.push mention.name
          lastIndex = mention.indices[1]
        else
          break
    arr

).call @