window['CMS_MANUAL_INIT'] = true

// import { StrictMode } from 'react'
// import * as ReactDOM from 'react-dom'
// import * as React from 'react'
import { default as CMS, init } from 'netlify-cms'
// import App from './app/app'

import { default as NetlifyCmsWidgetConditional } from 'netlify-cms-widget-conditional'

CMS.registerWidget(
  'conditional',
  NetlifyCmsWidgetConditional.controlComponent,
  NetlifyCmsWidgetConditional.previewComponent
)
// ({ value, onChange, ...args }) => {
//   console.log(args);
//   return (
//     <React.Fragment>
//       <input defaultValue={'value'} onChange={onChange} />
//     </React.Fragment>
//   );
// });
init({
  config: {
    backend: {
      name: 'test-repo',
      login: false
    },
    //publish_mode: "editorial_workflow",
    media_folder: 'public/media',
    // media_library: {
    //   name: 'Test',
    // },
    collections: [
      {
        label: 'Test',
        name: 'test',
        create: true,
        folder: '../public',
        fields: [
          { label: 'Title', name: 'title', widget: 'string' },
          { label: 'Name', name: 'name', widget: 'string' },
          {
            label: 'Choose Kind',
            name: 'kind',
            widget: 'conditional',
            options: [
              {
                value: 'x',
                label: 'X',
                fields: [
                  {
                    label: 'Date',
                    name: 'date',
                    widget: 'date'
                  }
                ]
              },
              {
                value: 'y',
                label: 'Y',
                fields: [
                  {
                    label: 'Chromosom',
                    name: 'chromosom',
                    widget: 'string'
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
})
