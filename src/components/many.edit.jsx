import React, { useState } from 'react'
import { FormGroup, Label, ApiClient } from 'admin-bro'
import Select from 'react-select/async'


const getResourceId = (property) => {
  return property.custom && property.custom.resourceId ? property.custom.resourceId : property.name
}

const getOptionsFromRecords = (records) => {
  return records.map(r => ({value: r.id, label: r.title}))
}

const getItems = (record, name) => {
  if (record.populated && record.populated[name]) {
    return getOptionsFromRecords(record.populated[name])
  }
  return []
}

const ResourceSelection = (props) => {
  const { onChange, name, selected: initialSelection, resourceId } = props
  const [options, setOptions] = useState([])
  const [selected, setSelected] = useState(initialSelection)
  const api = new ApiClient()

  const loadOptions = async (inputValue) => {
    const records = await api.searchRecords({ resourceId: resourceId, query: inputValue })
    const options = getOptionsFromRecords(records)
    setOptions(options)
    return options
  }

  const handleChange = (selectedOptions) => {
    setSelected(selectedOptions)
    onChange(name, selectedOptions.map(v => v.value))
  }

  return (
    <Select isMulti defaultOptions loadOptions={loadOptions} value={selected} onChange={handleChange} />
  )
}

const ManyToManyEdit = (props) => {
  const { property, record, onChange } = props;

  const items = getItems(record, property.name)

  const resourceId = getResourceId(property)

  return (
    <FormGroup>
      <Label>{property.label}</Label>
      <ResourceSelection onChange={onChange} name={property.name} resourceId={resourceId} selected={items} />
    </FormGroup>
  )
}

export default ManyToManyEdit
