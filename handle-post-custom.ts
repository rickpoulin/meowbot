import { APIGatewayProxyHandler, APIGatewayProxyEvent } from 'aws-lambda';
import 'source-map-support/register';
import { discordPostMessage } from './helpers/discord';

interface CustomEvent extends APIGatewayProxyEvent {
  content?: string;
}

export const postCustom: APIGatewayProxyHandler = async (event: CustomEvent, _context) => {
  try {
    let postContent = event.content;
    if (postContent !== null) {
        await discordPostMessage(postContent);
    }
    return { statusCode: 200, body: postContent };
  } catch (error) {
    console.error("Oh noes!!");
    console.log(error);
  }
}
