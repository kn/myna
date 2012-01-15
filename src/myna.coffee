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
      text = text[3..text.length]
      speakable += " overheard"
    else if match = text.match /^RT\s@(\w+):/
      speakable += " retweeted a tweet of #{spacify(match[1])}"
      sliceFrom = 5 + match[1].length
      text = text[sliceFrom..text.length]
    else if text.match /^RT[\s:]/
      speakable += " retweeted"
      text = text[3..text.length]
    else
      speakable += " tweeted"

    if tweet.in_reply_to_user_id
      in_reply_to_array = get_in_reply_to_array(tweet.entities.user_mentions)
      sliceFrom = tweet.entities.user_mentions[in_reply_to_array.length-1].indices[1] + 2
      text = text[sliceFrom..text.length]
      in_reply_to = in_reply_to_array.join(" and ")
      speakable += " in reply to #{in_reply_to}"
    
    speakable += ": "
    
    # Case when RT is in the middle of a tweet.
    text.replace /\sRT\s@(\w+):/, "Retweeted a tweet of #{spacify($1)}"
    text.replace /\sRT[\s:]/, " Retweeted, "
  
  # Spacify continuous text. e.g. ILoveTwitter -> I Love Twitter
  spacify: (text) ->
    text.replace /[A-Z]/, " $1"
    text = text[1..text.length] if text[0] == ' '
    text
    
  # Returns array of in reply to names. Assumes mentions are ordered by its indices.
  get_in_reply_to_array: (mentions) ->
    arr = []
    if mentions
      lastIndex = 0
      for mention in mentions
        if mention.indices[0] - lastIndex < 2
          arr.push mention.name
          lastIndex = mention.indices[1]
        else
          break
    arr
).call @