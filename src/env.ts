declare let WidgetMetadata: WidgetMetadata;

interface WidgetMetadata {
  /** Widget 唯一标识符 */
  id: string;
  /** Widget 显示标题 */
  title: string;
  /** Widget 描述 */
  description?: string;
  /** 作者 */
  author?: string;
  /** 网站地址 */
  site?: string;
  /** Widget 版本 */
  version?: string;
  /** 所需 ForwardWidget 版本 */
  requiredVersion?: string;
  /**
   * 详情数据缓存时长，单位：秒
   * @default 60
   */
  detailCacheDuration?: number;
  /** 功能模块列表 */
  modules: WidgetModule[];
  /** 搜索功能配置 */
  search?: {
    /** 搜索标题 */
    title: string;
    /** 搜索函数名 */
    functionName: string;
    /** 搜索参数配置 */
    params: WidgetModuleParam[];
  };
}

interface WidgetModule {
  /** 模块唯一标识符 */
  id: string;
  /** 模块标题 */
  title: string;
  /** 模块描述 */
  description?: string;
  /** 是否需要 WebView */
  requiresWebView?: boolean;
  /** 处理函数名 */
  functionName: string;
  /** 是否支持分段模式 */
  sectionMode?: boolean;
  /**
   * 缓存时长，单位：秒
   * @default 3600
   */
  cacheDuration?: number;
  /** 参数配置 */
  params?: WidgetModuleParam[];
}

interface WidgetModuleParam {
  /** 参数名 */
  name: string;
  /** 参数显示标题 */
  title: string;
  /** 参数类型 */
  type: 'input' | 'constant' | 'enumeration' | 'count' | 'page' | 'offset' | 'language';
  /** 参数描述 */
  description?: string;
  /** 默认值 */
  value?: string;
  /** 当符合该条件时才会触发该参数 */
  belongTo?: {
    /** 所属参数的子参数 */
    paramName: string;
    /** 所属参数包含的值 */
    value: string[];
  };
  /** 占位符选项 */
  placeholders?: Array<{
    title: string;
    value: string;
  }>;
  /** 枚举选项 */
  enumOptions?: Array<{
    title: string;
    value: string;
  }>;
}

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
}

/**
 * 视频项目的元数据接口
 */
interface VideoItem extends VideoItemChild {
  /** 子项目列表(最多一层) */
  childItems?: VideoItemChild[];
}

declare const Widget: typeof import('./widget-adaptor').WidgetAdaptor;
