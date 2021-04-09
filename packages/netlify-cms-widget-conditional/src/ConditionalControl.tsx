import * as React from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { ClassNames } from '@emotion/core'
import {
  ObjectWidgetTopBar,
  lengths,
  colors,
  reactSelectStyles
} from 'netlify-cms-ui-default'

import { Map, List, fromJS } from 'immutable'
import find from 'lodash/find'
import findIndex from 'lodash/findIndex'
import Select from 'react-select'

function optionToString(option: any) {
  return option && option.value ? option.value : null
}

function getSelectedValue({
  value,
  options /*isMultiple*/
}: {
  value: string
  options: { value: string }[]
}) {
  const index = findIndex(options, ['value', value])
  const selectedValue = find(options, ['value', value])
  return index >= 0 ? { index, selectedValue } : null
}

const styleStrings = {
  nestedObjectControl: `
    padding: 6px 14px 14px;
    border-top: 0;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  `,
  objectWidgetTopBarContainer: `
    padding: ${lengths.objectWidgetTopBarContainerPadding};
  `,
  collapsedObjectControl: `
    display: none;
  `
}

type ControlProps = {
  field: any
  value: any
  forID: any
  forList: any
  hasError: any
  classNameWrapper: any
  onChangeObject: any
  setActiveStyle: any
  setInactiveStyle: any
  t: any
  options: { fields: any }[]
  onValidateObject: any
  clearFieldErrors: any
  metadata: any
  fieldsErrors: any
  editorControl: any
  controlRef: any
  parentIds: any
  isFieldDuplicate: any
  isFieldHidden: any
}

export const name = 'conditional'

export class ConditionalControl extends React.Component<
  ControlProps,
  { collapsed: boolean }
> {
  componentValidate = {}

  static propTypes = {
    onChange: PropTypes.func.isRequired,
    value: PropTypes.node,
    forID: PropTypes.string.isRequired,
    classNameWrapper: PropTypes.string.isRequired,
    setActiveStyle: PropTypes.func.isRequired,
    setInactiveStyle: PropTypes.func.isRequired,
    field: ImmutablePropTypes.contains({
      options: ImmutablePropTypes.listOf(
        ImmutablePropTypes.contains({
          label: PropTypes.string.isRequired,
          value: PropTypes.string.isRequired,
          fields: ImmutablePropTypes.listOf(PropTypes.object)
        })
      ).isRequired
    })
  }

  static defaultProps = {
    value: Map()
  }

  constructor(props: any) {
    super(props)
    this.state = {
      collapsed: props.field.get('collapsed', false)
    }
  }

  /*
   * Always update so that each nested widget has the option to update. This is
   * required because ControlHOC provides a default `shouldComponentUpdate`
   * which only updates if the value changes, but every widget must be allowed
   * to override this.
   */
  shouldComponentUpdate() {
    return true
  }

  // isValid = () => {
  //   const { field, value, t } = this.props
  //   const min = field.get('min')
  //   const max = field.get('max')
  //   const minMaxError = (messageKey) => ({
  //     error: {
  //       message: t(`editor.editorControlPane.widget.${messageKey}`, {
  //         fieldLabel: field.get('label', field.get('name')),
  //         minCount: min,
  //         maxCount: max,
  //         count: min,
  //       }),
  //     },
  //   })

  //   if (!field.get('multiple')) {
  //     return { error: false }
  //   }
  //   if ([min, max].every(isNumber) && value?.size && (value.size < min || value.size > max)) {
  //     return minMaxError(min === max ? 'rangeCountExact' : 'rangeCount')
  //   } else if (isNumber(min) && min > 0 && value?.size && value.size < min) {
  //     return minMaxError('rangeMin')
  //   } else if (isNumber(max) && value?.size && value.size > max) {
  //     return minMaxError('rangeMax')
  //   }
  //   return { error: false }
  // }

  handleChange = (selectedOption: any) => {
    const { onChangeObject, field } = this.props
    const isMultiple = false // field.get("multiple", false)
    const isEmpty = isMultiple ? !selectedOption?.length : !selectedOption

    const onChange = (value: any) => onChangeObject(field, value)

    if (field.get('required') && isEmpty && isMultiple) {
      onChange(List())
    } else if (isEmpty) {
      onChange(null)
    } else if (isMultiple) {
      const options = selectedOption.map(optionToString)
      onChange(fromJS(options))
    } else {
      onChange(optionToString(selectedOption))
    }
  }

  componentDidMount() {
    const { field, onChangeObject, value } = this.props
    if (field.get('required') && field.get('multiple')) {
      const onChange = (value: any) => onChangeObject(field, value)
      if (value && !List.isList(value)) {
        onChange(fromJS([value]))
      } else if (!value) {
        onChange(fromJS([]))
      }
    }
  }

  /***
   * from object widget
   */

  // validate = () => {
  //   const { field } = this.props.options
  //   let fields = field.get('field') || field.get('fields')
  //   fields = List.isList(fields) ? fields : List([fields])
  //   fields.forEach((field) => {
  //     if (field.get('widget') === 'hidden') return
  //     this.componentValidate[field.get('name')]()
  //   })
  // }

  controlFor(field: any, key?: any) {
    const {
      value,
      onChangeObject,
      onValidateObject,
      clearFieldErrors,
      metadata,
      fieldsErrors,
      editorControl: EditorControl,
      controlRef,
      parentIds,
      isFieldDuplicate,
      isFieldHidden
    } = this.props

    if (field.get('widget') === 'hidden') {
      return null
    }
    const fieldName = field.get('name')
    const fieldValue = value && Map.isMap(value) ? value.get(fieldName) : value

    const isDuplicate = isFieldDuplicate && isFieldDuplicate(field)
    const isHidden = isFieldHidden && isFieldHidden(field)

    return (
      <EditorControl
        key={key}
        field={field}
        value={fieldValue}
        onChange={onChangeObject}
        clearFieldErrors={clearFieldErrors}
        fieldsMetaData={metadata}
        fieldsErrors={fieldsErrors}
        onValidate={onValidateObject}
        processControlRef={controlRef && controlRef.bind(this)}
        controlRef={controlRef}
        parentIds={parentIds}
        isDisabled={isDuplicate}
        isHidden={isHidden}
        isFieldDuplicate={isFieldDuplicate}
        isFieldHidden={isFieldHidden}
      />
    )
  }

  handleCollapseToggle = () => {
    this.setState({ collapsed: !this.state.collapsed })
  }

  renderFields = (multiFields: any, singleField: any) => {
    if (multiFields) {
      return multiFields.map((f: any, idx: any) => this.controlFor(f, idx))
    }
    return this.controlFor(singleField)
  }

  renderSelectedOption(option: any) {
    const { forID, classNameWrapper, forList, hasError } = this.props
    const field = option
    const collapsed = false // forList ? this.props.collapsed : this.state.collapsed
    const multiFields = field.get('fields')
    const singleField = field.get('field')

    if (multiFields || singleField) {
      return (
        <>
          <br />
          <ClassNames>
            {({ css, cx }) => (
              <div
                id={forID}
                className={cx(
                  classNameWrapper,
                  css`
                    ${styleStrings.objectWidgetTopBarContainer}
                  `,
                  {
                    [css`
                      ${styleStrings.nestedObjectControl}
                    `]: forList
                  },
                  {
                    [css`
                      border-color: ${colors.textFieldBorder};
                    `]: forList ? !hasError : false
                  }
                )}
              >
                {forList ? null : (
                  <ObjectWidgetTopBar
                    collapsed={collapsed}
                    onCollapseToggle={this.handleCollapseToggle}
                  />
                )}
                <div
                  className={cx({
                    [css`
                      ${styleStrings.collapsedObjectControl}
                    `]: collapsed
                  })}
                >
                  {this.renderFields(multiFields, singleField)}
                </div>
              </div>
            )}
          </ClassNames>
        </>
      )
    }

    return <h3>No field(s) defined for this widget</h3>
  }

  render() {
    const {
      field,
      value: objectValue,
      forID,
      classNameWrapper,
      setActiveStyle,
      setInactiveStyle
    } = this.props
    const fieldOptions = field.get('options')
    const isMultiple = false //field.get("multiple", false)
    const isClearable = !field.get('required', true) || isMultiple

    const keyName = field.get('name')
    const value = objectValue.get(keyName)

    if (!fieldOptions) {
      return (
        <div>
          Error rendering select control for {field.get('name')}: No options
        </div>
      )
    }

    const options: any[] = []

    fieldOptions?.forEach?.((value: any) => {
      const option = Map.isMap(value) ? value.toJS() : value
      console.log(option)
      options.push(option)
    })

    const selected = getSelectedValue({
      options,
      value
    })

    const selectedFields = selected
      ? field.get('options').get(selected.index)
      : null

    return (
      <React.Fragment>
        <Select
          {...{
            inputId: forID,
            value: selected?.selectedValue,
            onChange: this.handleChange,
            className: classNameWrapper,
            onFocus: setActiveStyle,
            onBlur: setInactiveStyle,
            options,
            styles: reactSelectStyles,
            isMulti: isMultiple,
            isClearable,
            placeholder: ''
          }}
        />
        {selectedFields && this.renderSelectedOption(selectedFields)}
      </React.Fragment>
    )
  }
}
