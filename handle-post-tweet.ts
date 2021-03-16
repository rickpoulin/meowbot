import { APIGatewayProxyHandler, APIGatewayProxyEvent } from 'aws-lambda';
import 'source-map-support/register';
import { getLatestTweets, Twitter } from './helpers/twitter';
import { discordPostTweet } from './helpers/discord';

interface CustomEvent extends APIGatewayProxyEvent {
  title?: string;
  feed?: string;
}

export const postTweet: APIGatewayProxyHandler = async (event: CustomEvent, _context) => {
  try {
    let postTitle: string = event.title || 'Consulting';
    let postFeed: string = event.feed || 'CrazyMgmtCons';
    console.log("Looking for tweets from account " + postFeed);
    let tweets: Twitter.Tweet[] = await getLatestTweets(postFeed, 50);
    let bestTweet: Twitter.Tweet = await findBestTweet(tweets);
    await discordPostTweet(postTitle, bestTweet);
    return { statusCode: 200, body: '' };
  } catch (error) {
    console.error("Oh noes!!");
    console.log(error);
  }
}

const oneDayMS = 24*60*60*1000;
const scanDaysAgo = 9;
const findBestTweet = (tweets: Twitter.Tweet[]): Promise<Twitter.Tweet> => new Promise((resolve: Function, reject: Function) => {
  if (tweets == null || tweets.length == 0) {
    reject(new Error("No tweets found in feed!"));
    return;
  }

  const dateMarker = new Date().getTime() - scanDaysAgo * oneDayMS; // 14 days ago
  let bestScore = 0;
  let bestTweet = null;

  tweets.every(tweet => {
    const tweetCreated = new Date(tweet.created_at);
    if (dateMarker > tweetCreated.getTime()) {
      console.log(`Stopping at ${tweetCreated.getTime()}`);
      return false;
    }

    const debugText = tweet.full_text.replace(/[\r\n]/g, " ");
    let tweetAge = scanDaysAgo + 1 + (dateMarker - tweetCreated.getTime()) / oneDayMS;
    const thisScore = ( tweet.favorite_count + tweet.retweet_count*2 ) / Math.log( tweetAge );
    console.log(tweet.favorite_count, tweet.retweet_count, tweetAge, thisScore, tweetCreated, debugText);
    if (thisScore > bestScore) {
      bestScore = thisScore;
      bestTweet = tweet;
    }

    return true;
  });

  console.log("WINNER: ", bestTweet.full_text);
  resolve(bestTweet);
});
