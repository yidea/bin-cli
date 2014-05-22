var _ = require("underscore"),
  request = require("request"),
  NodeWeiboTwitter= require("node-weibo-twitter"),
  twitterKeys = require("../configs/twitterKeys"),
  weiboKeys = require("../configs/weiboKeys");

// CLI logic
var API_YAHOO_WEATHER = "https://query.yahooapis.com/v1/public/yql?q=select%20item%20from%20weather.forecast%20where%20woeid%3D%222455920%22%20and%20u%3D%22c%22&format=json";

request(API_YAHOO_WEATHER, function (error, response, json) {
  var result = {};
  if (!error) {
    try {
      json = JSON.parse(json);
    } catch (e) {
      console.log(e);
      return;
    }

    var item = json.query.results.channel.item;
    // extract info
    result.title = item.title;
    result.now = item.condition;
    result.forcast = item.forecast;

    var today = _.first(result.forcast);
    var msg = today.day + " " + today.date + " MV Weather : " + today.text + ", " + today.low + "-" + today.high;

    // post to twitter
    var twitter = NodeWeiboTwitter.create("twitter", twitterKeys);
    twitter.postTweet(msg + " @yidea", function (error, data) {
      if (error) {
        console.log(error);
      } {
        console.log("post tweet success");
      }
    });
  }
});

