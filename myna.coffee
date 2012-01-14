class Myna
  compile: (tweet) ->
    speakable = tweet.user.name + "tweeted"
    if tweet.in_reply_to_user_id
      in_reply_to = in_reply_to_array(tweet.entities.user_mentions).join(" and ")
      speakable += " #{in_reply_to}"
    speakable += ", "
    
  # Returns array of in reply to names. Assumes mentions are ordered by its indices.
  in_reply_to_array: (mentions) ->
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