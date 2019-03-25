import { pullTwitterApi } from './twitter-api-pull';
import { generateFbPermanentPageToken } from './facebook-auth';
import { pullInstagramApi } from './instagram-api-pull';
import { approveInstagramPosts, approveTwitterPosts } from './approve-post';

exports.pullTwitterApi = pullTwitterApi;
exports.pullInstagramApi = pullInstagramApi;
exports.generateFbPermanentPageToken = generateFbPermanentPageToken;
exports.approveInstagramPosts = approveInstagramPosts;
exports.approveTwitterPosts = approveTwitterPosts;