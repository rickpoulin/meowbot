import fetch from 'node-fetch';
import Response from 'node-fetch';

export const findRedditThreads = (sub: string, range: string = 'week', limit: number = 100): Promise<Reddit.Thread[]> => new Promise((resolve: Function, reject: Function) => {
    fetch(`https://jsonp.afeld.me/?url=https://www.reddit.com/r/${sub}/top.json%3Ft=${range}%26limit=${limit}`)
    .then((response: Response) => response.json())
    .then((json: Reddit.Listing) => resolve(json.data.children))
    .catch(error => reject(error));
});

// Reddit response typedef below
export declare module Reddit {

    export interface MediaEmbed {
    }

    export interface RedditVideo {
        fallback_url: string;
        height: number;
        width: number;
        scrubber_media_url: string;
        dash_url: string;
        duration: number;
        hls_url: string;
        is_gif: boolean;
        transcoding_status: string;
    }

    export interface SecureMedia {
        reddit_video: RedditVideo;
    }

    export interface SecureMediaEmbed {
    }

    export interface Gildings {
        gid_2: number;
        gid_1?: number;
        gid_3?: number;
    }

    export interface Source {
        url: string;
        width: number;
        height: number;
    }

    export interface Resolution {
        url: string;
        width: number;
        height: number;
    }

    export interface Variants {
    }

    export interface Image {
        source: Source;
        resolutions: Resolution[];
        variants: Variants;
        id: string;
    }

    export interface RedditVideoPreview {
        fallback_url: string;
        height: number;
        width: number;
        scrubber_media_url: string;
        dash_url: string;
        duration: number;
        hls_url: string;
        is_gif: boolean;
        transcoding_status: string;
    }

    export interface Preview {
        images: Image[];
        enabled: boolean;
        reddit_video_preview: RedditVideoPreview;
    }

    export interface ResizedIcon {
        url: string;
        width: number;
        height: number;
    }

    export interface ResizedStaticIcon {
        url: string;
        width: number;
        height: number;
    }

    export interface AllAwarding {
        giver_coin_reward?: number;
        subreddit_id?: any;
        is_new: boolean;
        days_of_drip_extension: number;
        coin_price: number;
        id: string;
        penny_donate?: number;
        award_sub_type: string;
        coin_reward: number;
        icon_url: string;
        days_of_premium: number;
        resized_icons: ResizedIcon[];
        icon_width: number;
        static_icon_width: number;
        start_date?: number;
        is_enabled: boolean;
        description: string;
        end_date?: any;
        subreddit_coin_reward: number;
        count: number;
        static_icon_height: number;
        name: string;
        resized_static_icons: ResizedStaticIcon[];
        icon_format: string;
        icon_height: number;
        penny_price?: number;
        award_type: string;
        static_icon_url: string;
    }

    export interface RedditVideo2 {
        fallback_url: string;
        height: number;
        width: number;
        scrubber_media_url: string;
        dash_url: string;
        duration: number;
        hls_url: string;
        is_gif: boolean;
        transcoding_status: string;
    }

    export interface Media {
        reddit_video: RedditVideo2;
    }

    export interface ThreadData {
        approved_at_utc?: any;
        subreddit: string;
        selftext: string;
        author_fullname: string;
        saved: boolean;
        mod_reason_title?: any;
        gilded: number;
        clicked: boolean;
        title: string;
        link_flair_richtext: any[];
        subreddit_name_prefixed: string;
        hidden: boolean;
        pwls: number;
        link_flair_css_class: string;
        downs: number;
        thumbnail_height: number;
        top_awarded_type: string;
        hide_score: boolean;
        name: string;
        quarantine: boolean;
        link_flair_text_color: string;
        upvote_ratio: number;
        author_flair_background_color: string;
        subreddit_type: string;
        ups: number;
        total_awards_received: number;
        media_embed: MediaEmbed;
        thumbnail_width: number;
        author_flair_template_id?: any;
        is_original_content: boolean;
        user_reports: any[];
        secure_media: SecureMedia;
        is_reddit_media_domain: boolean;
        is_meta: boolean;
        category?: any;
        secure_media_embed: SecureMediaEmbed;
        link_flair_text: string;
        can_mod_post: boolean;
        score: number;
        approved_by?: any;
        author_premium: boolean;
        thumbnail: string;
        edited: boolean;
        author_flair_css_class: string;
        author_flair_richtext: any[];
        gildings: Gildings;
        post_hint: string;
        content_categories?: any;
        is_self: boolean;
        mod_note?: any;
        created: number;
        link_flair_type: string;
        wls: number;
        removed_by_category?: any;
        banned_by?: any;
        author_flair_type: string;
        domain: string;
        allow_live_comments: boolean;
        selftext_html?: any;
        likes?: any;
        suggested_sort?: any;
        banned_at_utc?: any;
        url_overridden_by_dest: string;
        view_count?: any;
        archived: boolean;
        no_follow: boolean;
        is_crosspostable: boolean;
        pinned: boolean;
        over_18: boolean;
        preview: Preview;
        all_awardings: AllAwarding[];
        awarders: any[];
        media_only: boolean;
        can_gild: boolean;
        spoiler: boolean;
        locked: boolean;
        author_flair_text: string;
        treatment_tags: any[];
        visited: boolean;
        removed_by?: any;
        num_reports?: any;
        distinguished?: any;
        subreddit_id: string;
        mod_reason_by?: any;
        removal_reason?: any;
        link_flair_background_color: string;
        id: string;
        is_robot_indexable: boolean;
        report_reasons?: any;
        author: string;
        discussion_type?: any;
        num_comments: number;
        send_replies: boolean;
        whitelist_status: string;
        contest_mode: boolean;
        mod_reports: any[];
        author_patreon_flair: boolean;
        author_flair_text_color: string;
        permalink: string;
        parent_whitelist_status: string;
        stickied: boolean;
        url: string;
        subreddit_subscribers: number;
        created_utc: number;
        num_crossposts: number;
        media: Media;
        is_video: boolean;
        link_flair_template_id: string;
        author_cakeday?: boolean;
    }

    export interface Thread {
        kind: string;
        data: ThreadData;
    }

    export interface ListingData {
        modhash: string;
        dist: number;
        children: Thread[];
        after: string;
        before?: any;
    }

    export interface Listing {
        kind: string;
        data: ListingData;
    }

}