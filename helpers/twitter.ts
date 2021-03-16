import fetch from 'node-fetch';
import Response from 'node-fetch';

const getAuthToken = (): Promise<string> => new Promise((resolve: Function, reject: Function) => {
    const auth = 'Basic ' + new Buffer(process.env.TWITTER_KEY).toString('base64');
    fetch('https://api.twitter.com/oauth2/token?grant_type=client_credentials', { method: 'POST', headers: { Authorization: auth } } )
        .then((response: Response) => response.json())
        .then((json: any) => resolve(json.access_token))
        .catch((error: any) => { console.error(error); reject(error) });
});

export const getLatestTweets = (accountName: string, maxCount: number = 10): Promise<Twitter.Tweet[]> => new Promise((resolve: Function, reject: Function) => {
    const accountUrl = `https://api.twitter.com/1.1/statuses/user_timeline.json?count=${maxCount}&include_rts=false&exclude_replies=true&tweet_mode=extended&screen_name=${accountName}`;
    getAuthToken()
        .then((accessToken: string) => fetch(accountUrl, { headers: { Authorization: `Bearer ${accessToken}` }}) )
        .then((response: Response) => response.json())
        .then((json: any) => resolve(json))
        .catch(error => reject(error));
});

// Twitter response typedef below
export declare module Twitter {

    export interface Dimension {
        w: number;
        h: number;
        resize: string;
    }

    export interface Sizes {
        thumb: Dimension;
        medium: Dimension;
        small: Dimension;
        large: Dimension;
    }

    export interface Media {
        id: number;
        id_str: string;
        indices: number[];
        media_url: string;
        media_url_https: string;
        url: string;
        display_url: string;
        expanded_url: string;
        type: string;
        sizes: Sizes;
    }

    export interface Entities {
        hashtags: any[];
        symbols: any[];
        user_mentions: any[];
        urls: any[];
        media: Media[];
    }

    export interface ExtendedEntities {
        media: Media[];
    }

    export interface Url {
        url: string;
        expanded_url: string;
        display_url: string;
        indices: number[];
    }

    export interface UrlList {
        urls: Url[];
    }

    export interface Description {
        urls: Url[];
    }

    export interface UserEntities {
        url: UrlList;
        description: Description;
    }

    export interface User {
        id: number;
        id_str: string;
        name: string;
        screen_name: string;
        location: string;
        description: string;
        url: string;
        entities: UserEntities;
        protected: boolean;
        followers_count: number;
        friends_count: number;
        listed_count: number;
        created_at: string;
        favourites_count: number;
        utc_offset?: any;
        time_zone?: any;
        geo_enabled: boolean;
        verified: boolean;
        statuses_count: number;
        lang?: any;
        contributors_enabled: boolean;
        is_translator: boolean;
        is_translation_enabled: boolean;
        profile_background_color: string;
        profile_background_image_url?: any;
        profile_background_image_url_https?: any;
        profile_background_tile: boolean;
        profile_image_url: string;
        profile_image_url_https: string;
        profile_banner_url: string;
        profile_link_color: string;
        profile_sidebar_border_color: string;
        profile_sidebar_fill_color: string;
        profile_text_color: string;
        profile_use_background_image: boolean;
        has_extended_profile: boolean;
        default_profile: boolean;
        default_profile_image: boolean;
        following?: any;
        follow_request_sent?: any;
        notifications?: any;
        translator_type: string;
    }

    export interface Tweet {
        created_at: string;
        id: number;
        id_str: string;
        full_text: string;
        truncated: boolean;
        display_text_range: number[];
        entities: Entities;
        extended_entities?: ExtendedEntities;
        source: string;
        in_reply_to_status_id?: any;
        in_reply_to_status_id_str?: any;
        in_reply_to_user_id?: any;
        in_reply_to_user_id_str?: any;
        in_reply_to_screen_name?: any;
        user: User;
        geo?: any;
        coordinates?: any;
        place?: any;
        contributors?: any;
        is_quote_status: boolean;
        retweet_count: number;
        favorite_count: number;
        favorited: boolean;
        retweeted: boolean;
        possibly_sensitive: boolean;
        lang: string;
        quoted_status?: Tweet;
    }

}

