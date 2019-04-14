
export interface Instagram {
    media_url: string,
    caption: string,
    id: string,
    children: InstagramChildren,
}

export interface InstagramChildren {
    data: Instagram[],
}