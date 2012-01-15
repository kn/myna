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
      name = Myna._get_name_by_screen_name(tweet, match[1])
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
      name = Myna._get_name_by_screen_name(tweet, match[1])
      text = text.replace /\sRT\s@\w+:\s/, " in reply to a tweet of #{name}: "
    text = text.replace /\sRT(\s|:\s)/, " in reply to: "
    
    speakable += text
  
  Myna._get_name_by_screen_name = (tweet, sn) ->
    for mention in tweet.entities.user_mentions
      return mention.name if mention.screen_name == sn
  
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
    text = text.replace /([A-Z])/g, " $1"
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