import * as React from 'react'
import { WidgetPreviewContainer } from 'netlify-cms-ui-default'

export const ConditionPreview: React.FC<{ field: any }> = ({ field }) => (
  <WidgetPreviewContainer>{(field && field.get('fields')) || field.get('field') || null}</WidgetPreviewContainer>
)
