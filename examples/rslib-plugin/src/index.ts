WidgetMetadata = {
  id: 'test-widget',
  title: 'Test Widget',
  author: 'Baran',
  description: 'Test Widget Description',
  version: '0.0.0',
  requiredVersion: '0.0.2',
  globalParams: [
    {
      name: 'server',
      title: 'Server',
      type: 'constant',
      value: 'https://api.example.com',
    },
  ],
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
    {
      type: 'danmu',
      id: 'searchDanmu',
      functionName: 'searchDanmu',
      title: 'Get Comments',
      description: 'Get Comments Description',
      params: [],
    },
    {
      type: 'danmu',
      id: 'getDetail',
      functionName: 'getDetail',
      title: 'Get Detail',
      description: 'Get Detail Description',
      params: [],
    },
    {
      type: 'danmu',
      id: 'getComments',
      functionName: 'getComments',
      title: 'Get Comments',
      description: 'Get Comments Description',
      params: [],
    },
  ],
};

// testFunction = function testFunction() {
//   console.log('testFunction');
//   return [];
// };

// export function testFunction(params: TestFunctionParams): VideoItem[] {
//   return [];
// }

// export function searchDanmu(params: SearchDanmuParams): SearchDanmuReturnType {
//   return Promise.resolve({
//     animes: [
//       {
//         animeId: 1223,
//         bangumiId: 'string',
//         animeTitle: 'string',
//         type: 'tvseries',
//         typeDescription: 'string',
//         imageUrl: 'string',
//         startDate: '2025-08-08T13:25:11.189Z',
//         episodeCount: 12,
//         rating: 0,
//         isFavorited: true,
//       },
//     ],
//   });
// }

// export function getDetail(params: GetDetailParams) {
//   console.log(params);
// }

testFunction = async (params) => {
  console.log(params);
  return [];
};
