Myna
====

Myna is a JS library that takes a tweet object and compiles it to machine speakable text. This speakable text can be easily spoken by text-to-speech engine.

For example, following my tweet:

"OH: Myna is #SuperAwsome for #TTS and #TwitterBeginners! It is written by @kn bit.ly/ykbz6b"

compiles into plain English:

"Katsuya Noguchi overheard: Myna is Super Awesome for TTS and Twitter Beginners! It is written by Katsuya Noguchi"

Usage
=====

Download myna-min.js file.

Add following tag into your html file:

    <script type="text/javascript" src="public/javascripts/myna-min.js"></script>

Compile a tweet object to speakable text with urls removed:

    speakable = Myna.compile(tweet);

Compile a tweet object to speakable text with urls included:

    speakable = Myna.compile(tweet, {withURL: true});

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

Test
====

To run a test, from the project root, run:

    rake test

Your default browser will open the test suite.

Packaging
=========

Official versions are kept in the `pkg/` directory.  To build a package run the following from project root:

    rake build

This will make a new file at `pkg/myna-version.js`.

Reporting Bugs
==============

Please direct bug reports to the [myna issue tracker on GitHub](http://github.com/katsuyan/myna/issues)

Copyright and License
====================

Copyright 2012 Katsuya Noguchi

Licensed under the MIT License
you may not use this work except in compliance with the License.

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
of the Software, and to permit persons to whom the Software is furnished to do
so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.