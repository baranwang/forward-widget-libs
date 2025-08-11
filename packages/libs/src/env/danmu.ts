interface BaseDanmuParams {
  /**
   * TMDB ID
   */
  tmdbId?: string;
  /**
   * 类型
   */
  type: 'tv' | 'movie';
  /**
   * 搜索关键词
   */
  title: string;
  /**
   * 剧名
   */
  seriesName?: string;
  /**
   * 集名
   */
  episodeName?: string;
  /**
   * 播出日期
   */
  airDate?: string;
  /**
   * 时长
   */
  runtime?: string;
  /**
   * 季
   */
  season?: string;
  /**
   * 集
   */
  episode?: string;
  /**
   * 链接
   */
  link?: string;
  /**
   * 视频链接
   */
  videoUrl?: string;
}
