var _ = require("underscore"),
  async = require("async"),
  NodeWeiboTwitter= require("node-weibo-twitter"),
  twitterKeys = require("../configs/twitterKeys"),
  weiboKeys = require("../configs/weiboKeys");

// CLI logic
var twitter = NodeWeiboTwitter.create("twitter", twitterKeys),
  weibo = NodeWeiboTwitter.create("weibo", weiboKeys);

twitter.getTweet("Real_CSS_Tricks", 5, function (error, json) {
  if (error) {
    console.log(error);
    return;
  }

  try {
    json = JSON.parse(json);
  } catch (e) {
    console.log(e);
    return;
  }

  // TODO: pick only needed field
  // filter by only today's tweet
  var now = new Date().toDateString();
  var result =_.filter(json, function (tweet) {
    if (_.has(tweet, "created_at")) {
      var createTime = new Date(tweet.created_at);
      createTime = createTime.toDateString();
      return createTime === now;
    }
  });

  // loop & post to weibo w async
  var msg;  
  if (!_.isEmpty(result)) {
    async.each(result, function (item, callback) {
      var url = _.first(item.entities.urls);
      msg = item.text.replace(url.url, url.expanded_url);
      weibo.postWeibo(msg, callback);

    }, function (error) {
      // callback when all task done
      if (error) {
        console.log(error);
      } else {
        console.log(result.length + " articles posted");
      }
    });
  } else {
    msg = "0 CSS-Tricks article found today - " + now;
    console.log(msg);
  }
});

