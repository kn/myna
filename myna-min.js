(function(){var g,i,h;h=this;i=h.Myna;g={};g="undefined"!==typeof exports?exports:h.Myna={};g.VERSION="0.0.0";g.noConflict=function(){h.Myna=i;return this};g.compile=function(a){var e,c,f,d,b,h,i;b=a.text;d=a.user.name;b.match(/^OH[\s:]/)?(b=b.slice(3,b.length+1||9E9).trim(),console.log(b),d+=" overheard"):(c=b.match(/^RT\s@(\w+):/))?(f=g._get_name_by_screen_name(a.entities.user_mentions,c[1]),d+=" retweeted a tweet of "+f,c=5+c[1].length,b=b.slice(c,b.length+1||9E9).trim()):b.match(/^RT[\s:]/)?(d+=
" retweeted",b=b.slice(3,b.length+1||9E9).trim()):d+=" tweeted";if(0===(null!=(e=a.entities.user_mentions[0])?e.indices[0]:void 0))e=g._get_in_reply_to_array(a.entities.user_mentions),c=a.entities.user_mentions[e.length-1].indices[1]+2,b=b.slice(c,b.length+1||9E9),e=g._en_and_join(e),d+=" in reply to "+e;d+=": ";if(c=b.match(/\sRT\s@(\w+):\s/))f=g._get_name_by_screen_name(a.entities.user_mentions,c[1]),b=b.replace(/\sRT\s@\w+:\s/," in reply to a tweet of "+f+": ");b=b.replace(/\sRT(\s|:\s)/," in reply to: ");
b=g._replace_mentions_with_name(a.entities.user_mentions,b);c=b.match(/#\w+/g);if(null!=c)for(h=0,i=c.length;h<i;h++)e=c[h],f=RegExp(e),b=b.replace(f,g._spacify(e.slice(1,e.length-1+1||9E9)));b=g._replace_urls_with_speakable_text(a.entities.urls,b);return d+b};g._get_name_by_screen_name=function(a,e){var c,f,d;for(f=0,d=a.length;f<d;f++)if(c=a[f],c.screen_name===e)return c.name};g._replace_mentions_with_name=function(a,e){var c,f,d,b;for(d=0,b=a.length;d<b;d++)c=a[d],f=RegExp("@"+c.screen_name),e=
e.replace(f,c.name);return e};g._replace_urls_with_speakable_text=function(a,e){var c,f,d,b;for(d=0,b=a.length;d<b;d++)c=a[d],f=c.display_url.replace(/^([^\/]+)\/.*$/,"Link to $1"),c=RegExp(""+c.display_url+"|"+c.url),e=e.replace(c,f);return e};g._en_and_join=function(a){var e;if(1===a.length)return a[0];if(2===a.length)return""+a[0]+" and "+a[1];if(2<a.length)return e=a.slice(0,a.length-2+1||9E9).join(", "),""+e+" and "+a[a.length-1]};g._spacify=function(a){a=a.replace(/_/g," ");a=a.replace(/([A-Z][a-z]+)/g,
" $1 ");a=a.replace(/\s\s/g," ");return a.trim()};return g._get_in_reply_to_array=function(a){var e,c,f,d,b;e=[];if(a){c=0;for(d=0,b=a.length;d<b;d++)if(f=a[d],3>f.indices[0]-c)e.push(f.name),c=f.indices[1];else break}return e}}).call(this);
