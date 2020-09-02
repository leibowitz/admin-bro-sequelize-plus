import React, { useState } from 'react'
import { FormGroup, Label, ApiClient } from 'admin-bro'
import AsyncSelect from 'react-select/async'


const getResourceId = (property) => {
  return property.custom && property.custom.resourceId ? property.custom.resourceId : property.name
}

const getOptionFromRecord = (record, targetField) => {
  return ({value: targetField ? record.params[targetField] : record.id, label: record.title})
}

const getOptionsFromRecords = (records, targetField) => {
  return records.map(r => getOptionFromRecord(r, targetField))
}

const getItem = (record, name, targetField) => {
  if (record.populated && record.populated[name]) {
    return getOptionFromRecord(record.populated[name], targetField)
  }
  return null
}

const ResourceSelection = (props) => {
  const { onChange, name, selected: initialSelection, resourceId, targetField } = props
  const [options, setOptions] = useState([])
  const [selected, setSelected] = useState(initialSelection)
  const api = new ApiClient()

  const loadOptions = async (inputValue) => {
    const records = await api.searchRecords({ resourceId: resourceId, query: inputValue })
    const options = getOptionsFromRecords(records, targetField)
    setOptions(options)
    return options
  }

  const handleChange = (selectedOption) => {
    setSelected(selectedOption)
    onChange(name, selectedOption.value)
  }

  return (
    <AsyncSelect defaultOptions loadOptions={loadOptions} value={selected} onChange={handleChange} />
  )
}

const SelectEdit = (props) => {
  const { property, record, onChange } = props;
  const targetField = property.custom && property.custom.targetField ? property.custom.targetField : null

  const item = getItem(record, property.name, targetField)
  const items = item !== null ? [item] : []

  const resourceId = getResourceId(property)

  return (
    <FormGroup>
      <Label>{property.label}</Label>
      <ResourceSelection targetField={targetField} onChange={onChange} name={property.name} resourceId={resourceId} selected={items} />
    </FormGroup>
  )
}

export default SelectEdit
