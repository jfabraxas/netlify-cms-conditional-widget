import { ConditionalControl } from './ConditionalControl'
import { ConditionPreview } from './ConditionalPreview'
import schema from './schema'

const Widget = (opts = {}) => ({
  name: 'object',
  controlComponent: ConditionalControl,
  previewComponent: ConditionPreview,
  schema,
  ...opts,
})

export const NetlifyCmsWidgetObject = {
  Widget,
  controlComponent: ConditionalControl,
  previewComponent: ConditionPreview,
}
export default NetlifyCmsWidgetObject
