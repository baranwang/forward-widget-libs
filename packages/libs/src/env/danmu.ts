interface AnimeItem {
  animeId: string | number;
  animeTitle: string;
}

interface GetDetailResponseItem {
  /**
   * 透传给 getComments 的 commentId
   */
  episodeId: string | number;
  episodeTitle: string;
}

interface EpisodeItem {
  commentId: string;
}

interface CommentItem {
  cid?: number | string;
  p: `${number},${1 | 4 | 5},${number},${string}`;
  m: string;
}

interface GetCommentsResponse {
  count: number;
  comments: Array<CommentItem>;
}

interface GetDanmuWithSegmentTimeParams extends BaseParams, AnimeItem, EpisodeItem {
  /**
   * 分段时间
   */
  segmentTime: number;
}

interface GetDanmuWithSegmentTimeResponse extends GetCommentsResponse {}
