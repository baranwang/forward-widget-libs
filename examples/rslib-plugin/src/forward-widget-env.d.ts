/// <reference types='@forward-widget/libs/env' />
interface AnimeItem {
  animeId: number;
}

interface EpisodeItem {
  commentId: string;
}

interface GlobalParams {
  /**
   * Server
   * @default 'https://api.example.com'
   */
  server: 'https://api.example.com';
}

//#region test-module
/** Params of Test Module */
/**
 * @example
 * export function testFunction(params: TestFunctionParams): Promise<VideoItem[]>
 */
interface TestFunctionParams extends GlobalParams {
  /** Foo */
  foo: string;
  /** Bar */
  bar: 'option1' | 'option2' | 'option3';
  /**
   * Baz
   * @description Baz Description
   * @default 'test-value'
   */
  baz: 'test-value';
}
//#endregion test-module

//#region test-module-2
/** Params of Test Module 2 */
/**
 * @example
 * export function testFunction2(params: TestFunction2Params): Promise<VideoItem[]>
 */
interface TestFunction2Params extends GlobalParams {}
//#endregion test-module-2

//#region searchDanmu
/** Params of Get Comments */
/**
 * @example
 * export function searchDanmu(params: SearchDanmuParams): SearchDanmuReturnType
 */
interface SearchDanmuParams extends GlobalParams, BaseDanmuParams {}

interface SearchDanmuReturnType extends Promise<{ animes: Array<AnimeItem> }> {}
//#endregion searchDanmu

//#region getDetail
/** Params of Get Detail */
/**
 * @example
 * export function getDetail(params: GetDetailParams): GetDetailReturnType
 */
interface GetDetailParams extends GlobalParams, BaseDanmuParams, AnimeItem {}

interface GetDetailReturnType extends Promise<Array<EpisodeItem>> {}
//#endregion getDetail

//#region getComments
/** Params of Get Comments */
/**
 * @example
 * export function getComments(params: GetCommentsParams): GetCommentsReturnType
 */
interface GetCommentsParams extends GlobalParams, BaseDanmuParams, EpisodeItem {}

interface CommentItem {
  cid: number;
  p: string;
  m: string;
}

interface GetCommentsReturnType {
  /** 评论数量 */
  count: number;
  comments: Array<CommentItem>;
}
//#endregion getComments
