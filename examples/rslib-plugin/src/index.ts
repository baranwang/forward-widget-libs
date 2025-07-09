WidgetMetadata = {
  id: 'test-widget',
  title: 'Test Widget',
  modules: [
    {
      id: 'test-module',
      title: 'Test Module',
      functionName: 'testFunction',
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
          ],
        },
      ],
    },
  ],
};

// export const testFunction = (params) => {}
