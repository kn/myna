( ->
  root = this
  previousMyna = root.Myna

  Myna = {}
  if typeof exports != 'undefined'
    Myna = exports
  else
    Myna = root.Myna = {}
  
  Myna.VERSION = '0.0.0'
  
  Myna.noConflict = ->
    root.Myna = previousMyna
    @
  
  Myna.compile = (tweet) ->
    # Compose begining of speakable.
    text = tweet.text
    speakable = tweet.user.name
    if text.match /^OH[\s:]/
      text = text[3..text.length].trim()
      console.log text
      speakable += " overheard"
    else if match = text.match /^RT\s@(\w+):/
      name = Myna._get_name_by_screen_name(tweet.entities.user_mentions, match[1])
      speakable += " retweeted a tweet of #{name}"
      sliceFrom = 5 + match[1].length
      text = text[sliceFrom..text.length].trim()
    else if text.match /^RT[\s:]/
      speakable += " retweeted"
      text = text[3..text.length].trim()
    else
      speakable += " tweeted"

    if tweet.entities.user_mentions[0]?.indices[0] == 0
      in_reply_to_array = Myna._get_in_reply_to_array(tweet.entities.user_mentions)
      sliceFrom = tweet.entities.user_mentions[in_reply_to_array.length-1].indices[1] + 2
      text = text[sliceFrom..text.length]
      in_reply_to = Myna._en_and_join(in_reply_to_array)
      speakable += " in reply to #{in_reply_to}"
    
    speakable += ": "
    
    # Case when RT is in the middle of a tweet.
    if match = text.match /\sRT\s@(\w+):\s/
      name = Myna._get_name_by_screen_name tweet.entities.user_mentions, match[1]
      text = text.replace /\sRT\s@\w+:\s/, " in reply to a tweet of #{name}: "
    text = text.replace /\sRT(\s|:\s)/, " in reply to: "
    
    # Replace rest of the mentions
    text = Myna._replace_mentions_with_name tweet.entities.user_mentions, text
    
    # Replace hashtags with the equivalent spacified word
    hashtags = text.match /#\w+/g
    if hashtags?
      for hashtag in hashtags
        regex = new RegExp(hashtag)
        text = text.replace regex, Myna._spacify(hashtag[1..hashtag.length-1])
    
    # Replace link with just host domain
    text = Myna._replace_urls_with_speakable_text(tweet.entities.urls, text)
    
    speakable += text
  
  Myna._get_name_by_screen_name = (mentions, sn) ->
    for mention in mentions
      return mention.name if mention.screen_name == sn
  
  Myna._replace_mentions_with_name = (mentions, text) ->
    for mention in mentions
      regex = new RegExp("@#{mention.screen_name}")
      text = text.replace regex, mention.name
    text
  
  Myna._replace_urls_with_speakable_text = (urls, text) ->
    for url in urls
      replacement = url.display_url.replace(/^([^\/]+)\/.*$/, "(Link to $1)")
      replacement = replacement.replace /\./g, " dot "
      regex = new RegExp("#{url.display_url}|#{url.url}")
      text = text.replace regex, replacement
    text
  
  Myna._en_and_join = (items) ->
    if items.length== 1
      items[0]
    else if items.length == 2
      "#{items[0]} and #{items[1]}"
    else if items.length > 2
      ret = items[0..items.length-2].join(", ")
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