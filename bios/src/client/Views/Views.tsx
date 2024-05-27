import { Optional } from '@tuval/core'
import {
  cLeading,
  HStack,
  Dropdown,
  ReactView,
  Text,
  VStack,
  FieldSettingsModel,
  ValidateRule,
  SecureFieldClass,
  SecureField,
} from '@tuval/forms'
import React from 'react'
import withReactContent from 'sweetalert2-react-content'
import Swal from 'sweetalert2'
import { TextField } from '@mui/material'

export interface IDropDownParams {
  label: string
  dataSource: any[]
  fields: FieldSettingsModel
  placeholder: string
  formFieldOptions: {
    fieldName: string
    rules: ValidateRule[]
  }
  onChange?: (e: any) => void
}

export interface ISecureInputParams {
  placeholder: string
  formFieldOptions: {
    fieldName: string
    rules: ValidateRule[]
  }
  value: string
  setValue: (value: string) => void
}

export namespace Views {
  export const MySwal = withReactContent(Swal)
  export const Toast = MySwal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,

    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    },
  })

  export const InputLabel = (label: string) =>
    Text(label).fontSize('12px').fontWeight('500').foregroundColor('#343a40')

  export const DropDown = (params: Optional<IDropDownParams>) =>
    VStack({ alignment: cLeading, spacing: 3 })(
      InputLabel(params.label).marginTop('8px'),
      Dropdown()
        .height('33px')
        .fontSize('13px')
        .floatlabel(false)
        .dataSource(params.dataSource)
        .fields(params.fields)
        .placeHolder(params.placeholder)
        .width('100%')
        .formField(
          params.formFieldOptions?.fieldName,
          params.formFieldOptions?.rules
        )
        .allowFiltering(true)
    ).height()

  export const SecureInput = (params: Optional<ISecureInputParams>) =>
    VStack({ alignment: cLeading, spacing: 3 })(
      InputLabel(params.placeholder).marginTop('8px'),
      SecureField()
        .height('33px')
        .width('100%')
        .value(params.value)
        .formField(
          params.formFieldOptions?.fieldName,
          params.formFieldOptions?.rules
        )
        .onChange(params.setValue)
    ).height()

  export const DefaultTextInput = ({
    label,
    name,
    isMultiline,
    value,
    isRequired,
    onChange,
    customProps,
    type = 'text',
    disabled = false,
    error = false,
    helperTextValue = 'Lütfen bu alanı doldurunuz ya da geçerli bir değer giriniz',
  }: {
    label: string
    name: string
    isMultiline?: boolean
    isRequired?: boolean
    value: string
    onChange: (e: any) => any
    customProps?: any
    disabled?: boolean
    type?: string
    error?: boolean
    helperTextValue?: string
  }) => (
    <TextField
      color="primary"
      label={label}
      name={name}
      variant="outlined"
      size="small"
      fullWidth
      {...(error && {
        error: true,
        helperText: helperTextValue,
      })}
      {...(isRequired && { required: true })}
      {...(isMultiline && { multiline: true, rows: 4, maxRows: 5 })}
      {...customProps}
      value={value}
      onChange={onChange}
      type={type}
      disabled={disabled}
    />
  )
}
