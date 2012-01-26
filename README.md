Myna
====

Myna is a js library that takes a tweet object and compiles it to machine speakable text. This speakable text can be easily spoken by text-to-speech engine.

Usage
=====

Download myna-min.js file.

Add following tag into your html file:

    <script type="text/javascript" src="public/javascripts/myna-min.js"></script>

Compile a tweet object to speakable text with urls removed:

    speakable = Myna.compile(tweet);

Compile a tweet object to speakable text with urls included:

    speakable = Myna.compile(tweet, {withURL: true})

That's it!

Compilation Detail
==================

- OH -> "Over heard"
- RT -> "Retweeted"
- HT -> "Heard through"
- @screenname -> "Full Name"
- #HashTag -> "Hash Tag"
- #Hash_Tag -> "Hash Tag"
- url -> "" (This is configurable)
- w/ -> "with"
- :) -> ""
- & -> "and"
- and more smart compilation!

Examples
========

    tweet = {
      "text": "Myna is awesome!",
      "user": {
        "id": 29733,
        "name": "Katsuya Noguchi",
        "screen_name": "kn"
      },
      "entities": { "urls": [], "hashtags": [], "user_mentions": [] }
    };

    Myna.compile(tweet);
    
returns "Katsuya Noguchi tweeted: Myna is awesome"

    tweet = {
      "text": "OH: Myna is awesome!",
      "user": {
        "id": 29733,
        "name": "Katsuya Noguchi",
        "screen_name": "kn"
      },
      "entities": { "urls": [], "hashtags": [], "user_mentions": [] }
    };

    Myna.compile(tweet);

returns "Katsuya Noguchi overheard: Myna is awesome!"

    tweet = {
      "text": "Here's @BarcelonaFC preparing for the big game against @RealMadrid",
      "user": {
        "id": 29733,
        "name": "Katsuya Noguchi",
        "screen_name": "kn"
      },
      "entities": { "urls": [], "hashtags": [],
      "user_mentions": [{
        "name": "Barcelona FC",
        "id": 15473839,
        "indices": [7, 18],
        "screen_name": "BarcelonaFC"
      }, {
        "name": "Real Madrid",
        "id": 15473840,
        "indices": [59, 69],
        "screen_name": "RealMadrid"
      }] }
    };

    Myna.compile(tweet);

returns "Katsuya Noguchi tweeted: Here's Barcelona FC preparing for the big game against Real Madrid"

For more examples, please take a look at myna_spec.[coffee|js] file.