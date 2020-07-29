import React, { useState, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'

import { DrawerContent, Box, FormGroup, Section, Button, Icon } from 'admin-bro'
import { useRecord } from 'admin-bro'
import { BasePropertyComponent } from 'admin-bro'
import isEqual from 'lodash/isequal';

import AddNewItemButton from './add-new-item'

const findReferenceProperty = (properties, originalResourceId) => {
  return properties
    .find(p => p.type === 'reference' && p.reference === originalResourceId)
}

const filterProperties = (properties, originalResourceId) => {
  return properties
    .filter(p => p.type !== 'inline')
    .filter(p => p.type !== 'reference' || p.reference !== originalResourceId)
}

const RecordEdit = (props) => {
  const { record: initialRecord, resource, parentResourceId, onChange, onDelete } = props
  const initialObject = useRef(initialRecord?.params)

  const {
    record,
    handleChange,
  } = useRecord(initialRecord, resource.id)

  useEffect(() => {
    // Only trigger when values changed
    if (isEqual(initialObject.current, record.params)) {
      return
    }
    onChange(record)
  }, [record])

  return (
    <FormGroup>
      <Section mt="xl">
        <Box flex flexDirection="row" alignItems="top">
          <Box flexGrow={1}>
            {filterProperties(resource.editProperties, parentResourceId).map(property => (
              <BasePropertyComponent
                key={property.name}
                where="edit"
                onChange={handleChange}
                property={property}
                resource={resource}
                record={record}
              />
            ))}
          </Box>
          <Box flexShrink={0}>
            <Button
              ml="default"
              type="button"
              size="icon"
              onClick={(event) => onDelete(event)}
              variant="danger"
            >
              <Icon icon="Delete" />
            </Button>
          </Box>
        </Box>
      </Section>
    </FormGroup>
  )
}

const updateRecords = (records, record) => {
  return records.map(r => r?.id === record.id ? record : r)
}

const InlineEdit = (props) => {
  const { record: initialRecord, property: inlineProperty, resource: parentResource, onChange } = props

  const isInitialRender = useRef(true)
  const resources = useSelector((state) => state.resources)
  const inlineResource = resources.find(r => r.id === inlineProperty.name)
  const items = initialRecord.populated[inlineProperty.name] || []
  const refProperty = findReferenceProperty(inlineResource.editProperties, parentResource.id)

  const [records, setRecords] = useState(items)

  const handleRecordChange = (record) => {
    setRecords(updateRecords(records, record))
  }

  const addNew = (event) => {
    const params = {}
    if (initialRecord.id) {
      params[refProperty.name] = initialRecord.id
    }
    setRecords(records.concat([{params: params, 'errors': {}, 'populated': {}}]))
    event.preventDefault()
    return false
  }

  const removeItem = (i, event) => {
    setRecords(records.filter((r, j) => j !== i))
    event.preventDefault()
    return false
  }

  useEffect(() => {
    // Skip first render
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return
    }
    onChange(inlineProperty.name, records.map(r => r?.params))
  }, [records])

  return (
    <FormGroup>
      {records.map((record, i) => (
          <RecordEdit key={record?.id || 'index' + i} record={record} parentResourceId={parentResource.id} resource={inlineResource} onChange={handleRecordChange} onDelete={(event) => removeItem(i, event)} />
        )
      )}
      <Button onClick={addNew} type="button" size="sm">
        <AddNewItemButton resource={parentResource} property={inlineProperty} />
      </Button>
    </FormGroup>
  )
}

export default InlineEdit
