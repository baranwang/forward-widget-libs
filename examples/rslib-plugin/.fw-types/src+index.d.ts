/** Test Module */
export interface TestFunctionParams {
    /** Foo */
    foo: string;
    /** Bar */
    bar: 'option1' | 'option2';
}

/** Test Module */
export function testFunction(params: TestFunctionParams): Promise<VideoItem[]>;
