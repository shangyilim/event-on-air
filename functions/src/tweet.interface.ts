
interface TweetMedia {
    id: Long,
    media_url_https: string,
    type: string,
}

interface Entities {
    media?: TweetMedia[],
}

interface TwitterUser {
    screen_name: string,
    profile_image_url_https: string,
    name: string,
}

export interface Tweet {
    created_at: string,
    id: Long,
    id_str: string,
    text: string,
    entities: Entities,
    user: TwitterUser,
}