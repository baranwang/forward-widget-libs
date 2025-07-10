WidgetMetadata = {
  id: 'test-widget',
  title: 'Test Widget',
  modules: [
    {
      id: 'test-module',
      title: 'Test Module',
      functionName: 'testFunction',
      description: 'Test Module Description',
      params: [
        {
          name: 'foo',
          title: 'Foo',
          type: 'input',
        },
        {
          name: 'bar',
          title: 'Bar',
          type: 'enumeration',
          enumOptions: [
            {
              title: 'Option 1',
              value: 'option1',
            },
            {
              title: 'Option 2',
              value: 'option2',
            },
            {
              title: 'Option 3',
              value: 'option3',
            },
          ],
        },
        {
          name: 'baz',
          title: 'Baz',
          description: 'Baz Description',
          type: 'constant',
          value: 'test-value',
        },
      ],
    },
    {
      id: 'test-module-2',
      title: 'Test Module 2',
      functionName: 'testFunction2',
      description: 'Test Module 2 Description',
      params: [],
    },
  ],
};

export function testFunction(params: TestFunctionParams) {
  console.log(params);
}
