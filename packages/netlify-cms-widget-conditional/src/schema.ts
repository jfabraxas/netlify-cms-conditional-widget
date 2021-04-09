export default {
  properties: {
    options: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          label: { type: 'string' },
          value: { type: 'string' },
          fields: { type: 'object' },
        },
        required: ['label', 'value'],
      },
    },
    i18n: { type: 'boolean' },
  },
  required: ['options'],
}
