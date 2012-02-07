( ->
  root = this
  previousMyna = root.Myna

  Myna = {}
  if typeof exports != 'undefined'
    Myna = exports
  else
    Myna = root.Myna = {}

  Myna.noConflict = ->
    root.Myna = previousMyna
    @
  
  ###
  # Regex used in Myna
  ###

  Regex = Myna.Regex = {}

  Regex.buildRegex = (regex, flags) ->
    flags = flags ? ""
    if typeof regex != "string"
      if regex.global && flags.indexOf("g") < 0
        flags += "g"
      if regex.ignoreCase && flags.indexOf("i") < 0
        flags += "i"
      if regex.multiline && flags.indexOf("m") < 0
        flags += "m"
      regex = regex.source
    new RegExp(regex.replace(/#\{(\w+)\}/g, (match, name) ->
      newRegex = Regex[name] || ""
      if typeof newRegex != "string"
        newRegex = newRegex.source
      newRegex
      ), flags)

  Regex.atSigns = "@＠"
  Regex.mention = Regex.buildRegex /(^|[^a-zA-Z0-9_!#$%&*#{atSigns}])([#{atSigns}])([a-zA-Z0-9_]{1,20})/
  Regex.oh_context = /^OH[\s:]/
  Regex.rt_context = /^RT[\s:]/
  Regex.rt_with_mention_context = Regex.buildRegex /^RT#{mention}:/
  Regex.reply_context = Regex.buildRegex /^(#{mention})+/
  Regex.rt_with_mention = /RT\s@(\w+):\s/
  Regex.rt = /\sRT(\s|:\s)/
  Regex.ht = /HT:?/
  Regex.with = /\sw\/\s/g
  Regex.smiley_face = /\s?:=?[)pD]\s?/g
  Regex.and = /\s&\s/g
  Regex.love = /\s(<3|&lt;3)\s/g
  Regex.distractive_symbol = /[_;\^#]/g
  Regex.double_spaces = /\s\s/g
  
  ###
  # Compiles tweet text to machine speakable text.
  ###
  Myna.compile = (tweet, args) ->
    text = tweet.text
    speakable = tweet.user.name
    mentions = tweet.entities.user_mentions
    hashtags = tweet.entities.hashtags
    media = tweet.entities.media

    text = Myna._handle_special_cases text

    startContext = " #{Myna._get_start_context mentions, media, text}: "
    text = Myna._slice_context text
    
    text = Myna._remove_media_links media, text

    text = Myna._replace_ht_with_speakable text

    text = Myna._replace_rt_with_speakable mentions, text

    text = Myna._replace_mentions_with_speakable mentions, text

    text = Myna._replace_hashtags_with_speakable hashtags, text

    if args && args.withURL
      text = Myna._replace_urls_with_speakable tweet.entities.urls, text
    else
      text = Myna._remove_urls tweet.entities.urls, text
    
    text = Myna._remove_distractive_symbols text
    
    text = Myna._replace_symbols text

    speakable += "#{startContext}#{text}"

  Myna._get_start_context = (mentions, media, text) ->
    context = ""
    if text.match Regex.oh_context
      context = "overheard"
    else if match = text.match Regex.rt_with_mention_context
      name = Myna._get_name_by_screen_name mentions, match[3]
      context = "retweeted a tweet of #{name}"
    else if text.match Regex.rt_context
      context = "retweeted"
    else if text.match Regex.reply_context
      in_reply_to_array = Myna._get_in_reply_to_array mentions
      in_reply_to = Myna._en_and_join in_reply_to_array
      context = "tweeted in reply to #{in_reply_to}"
    else
      context = "tweeted"
    if media && media.length > 0
      context += " with #{media[0].type}"
    context

  Myna._slice_context = (text) ->
    text = text.replace(Regex.oh_context, "").trim()
    text = text.replace(Regex.rt_with_mention_context, "").trim()
    text = text.replace(Regex.rt_context, "").trim()
    text = text.replace(Regex.reply_context, "").trim()
    text

  Myna._replace_rt_with_speakable = (mentions, text) ->
    if match = text.match Regex.rt_with_mention
      name = Myna._get_name_by_screen_name mentions, match[1]
      text = text.replace match[0], "in reply to a tweet of #{name}: "
    text.replace Regex.rt, " in reply to: "

  Myna._replace_ht_with_speakable = (text) ->
    text.replace Regex.ht, "Heard through"

  Myna._replace_hashtags_with_speakable = (hashtags, text) ->
    for hashtag in hashtags
      regex = new RegExp "##{hashtag.text}"
      text = text.replace regex, Myna._spacify(hashtag.text)
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

  Myna._remove_media_links = (media, text) ->
    if media
      for m in media
        regex = new RegExp "\s?(#{m.display_url}|#{m.url})\s?"
        text = text.replace regex, " "
    text

  Myna._handle_special_cases = (text) ->
    # Users sometimes uses . at the begining to publish replies.
    text = text.replace /^\./, "" 
    text

  Myna._replace_symbols = (text) ->
    # Replace w/ with 'with'
    text = text.replace Regex.with, " with "
    # Remove smiley faces
    text = text.replace Regex.smiley_face, " "
    # Replace & with 'and'
    text = text.replace Regex.and, " and "
    # Replace <3 with 'love'
    text = text.replace Regex.love, " love "
    text

  Myna._remove_distractive_symbols = (text) ->
    text = text.replace Regex.distractive_symbol, ""
    text = text.replace Regex.double_spaces, " "
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