# netlify-cms-widget-conditional

A Conditional Widget for NetlifyCMS
Just an Select Widget that offer conditional fields after a choice has done...

## Installation

```
yarn add @jfa/netlify-cms-widget-conditional@https://github.com/jfabraxas/netlify-cms-widget-conditional
```

##

```yml
collections:
  - label: Posts
    label_singular: Post
    name: posts
    folder: _posts
    create: true
    fields:
      - label: Choose Kind
        name: kind
        widget: conditional
        options:
          - value: x
            label: X
            fields:
              - label: Date
                name: date
                widget: date
          - value: y
            label: Y
            fields:
              - label: Chromosom
                name: chromosom
                widget: string
```
