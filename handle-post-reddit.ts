import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import { findRedditThreads, Reddit } from './helpers/reddit';
import { discordPostThread } from './helpers/discord';

const subs = [ 'dadjokes', 'showerthoughts', 'jokes', 'todayilearned', 'facts', 'puns', 'futurology' ];

export const postReddit: APIGatewayProxyHandler = async (event, _context) => {
  try {
      let feed = subs[new Date().getUTCDay()];
      console.log("Picking thread from " + feed);
      await doPostFrom(feed);
      return { statusCode: 200, body: '' };
  } catch (error) {
      console.error("Oh noes!!");
      console.log(error);
      try {
        await doPostFrom('dadjokes', 'day', 10);
        return { statusCode: 200, body: '' };
      } catch (error) {
        console.error("Double noes!!");
        console.log(error);
      }
  }
}

const doPostFrom = (feed: string, range: string = 'week', limit: number = 100): Promise<void> => new Promise((resolve: Function, reject: Function) => {
  findRedditThreads(feed, range, limit)
    .then((threads: Reddit.Thread[]) => findBestThread(feed, threads))
    .then((thread: Reddit.Thread) => discordPostThread(feed, thread))
    .then(() => resolve())
    .catch(error => reject(error));
});

const findBestThread = (feed: string, threads: Reddit.Thread[]): Promise<Reddit.Thread> => new Promise((resolve: Function, reject: Function) => {
  if (threads == null || threads.length == 0) {
    reject(new Error("No threads found in feed!"));
    return;
  }

  let goodThread = null;
  threads.every(thread => {
    // only want threads (should be always true?)
    if (thread.kind !== 't3') { return true; }
    let tdata = thread.data;
    let type = tdata.post_hint;
    console.log(`${tdata.title} ${tdata.is_self} ${type}`);
    // want a self-post or a link
    if (!tdata.is_self && type !== 'link') { return true; }
    // long titles don't work in discord
    if (tdata.title.length > 250) {
        console.log(`Title length: ${tdata.title.length}`);
        return true;
    }
    if (tdata.is_self && tdata.selftext.match(/\S/)) {
        if (feed !== 'facts' && tdata.selftext.match(/https?:\/\//)) {
            console.log(`Facts post without a link in body`);
            return true;
        }
        if (tdata.selftext.length > 1024) {
            console.log(`Content length: ${tdata.selftext.length}`);
            return true;
        }
    }
    console.log(`GOOD = ${tdata.id} : ${tdata.title} ${tdata.selftext}`);
    goodThread = thread;
    return false;
  });

  goodThread != null ? resolve(goodThread) : reject(new Error('No valid thread found'));
});
