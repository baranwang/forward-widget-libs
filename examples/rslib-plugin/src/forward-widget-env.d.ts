/// <reference types='@forward-widget/libs/env' />
/** Params of Test Module */
interface TestFunctionParams {
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

/**
 * Test Module
 * @description Test Module Description
 * @param {TestFunctionParams} params
 * @returns {Promise<VideoItem[]>}
 */
function testFunction(params: TestFunctionParams): Promise<VideoItem[]>;

/** Test Module */
type TestFunctionType = typeof testFunction;

/** Params of Test Module 2 */
interface TestFunction2Params {
}

/**
 * Test Module 2
 * @description Test Module 2 Description
 * @param {TestFunction2Params} params
 * @returns {Promise<VideoItem[]>}
 */
function testFunction2(params: TestFunction2Params): Promise<VideoItem[]>;

/** Test Module 2 */
type TestFunction2Type = typeof testFunction2;
