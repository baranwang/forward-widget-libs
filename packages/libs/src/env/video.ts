interface VideoItemChild {
  /** 唯一标识符。对于 url 类型为 url 地址,对于 douban/imdb/tmdb 类型为对应 ID。tmdb ID 格式为 type.id,如 tv.123 */
  id: string;
  /** 类型标识 */
  type: 'url' | 'detail' | 'douban' | 'imdb' | 'tmdb';
  /** 标题 */
  title: string;
  /** 纵向封面图片地址 */
  posterPath?: string;
  /** 横向封面地址 */
  backdropPath?: string;
  /** 发布时间 */
  releaseDate?: string;
  /** 媒体类型 */
  mediaType?: 'tv' | 'movie';
  /** 评分 */
  rating?: string;
  /** 分类 */
  genreTitle?: string;
  /** 时长(秒) */
  duration?: number;
  /** 时长文本格式 */
  durationText?: string;
  /** 预览视频地址 */
  previewUrl?: string;
  /** 视频播放地址 */
  videoUrl?: string;
  /** 详情页地址 */
  link: string;
  /** 集数 */
  episode?: number;
  /** 描述 */
  description?: string;
  /** 播放器类型 */
  playerType?: 'system' | 'app';
}

/**
 * 视频项目的元数据接口
 */
interface VideoItem extends VideoItemChild {
  /** 子项目列表(最多一层) */
  childItems?: VideoItemChild[];
}

declare let loadDetail: (link: string) => Promise<Omit<VideoItem, 'videoUrl'> & Pick<Required<VideoItem>, 'videoUrl'>>;
