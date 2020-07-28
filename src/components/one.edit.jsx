import React, { useState, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'

import { DrawerContent, Box, FormGroup, Button, Icon } from 'admin-bro'
import { useRecord } from 'admin-bro'
import { BasePropertyComponent } from 'admin-bro'
import isEqual from 'lodash/isequal';

const filterProperties = (properties, originalResourceId) => {
  return properties
    .filter(p => p.type !== 'one')
    .filter(p => p.type !== 'reference' || p.reference !== originalResourceId)
}

const RecordEdit = (props) => {
  const { record: initialRecord, resource, parentResourceId, onChange } = props
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
      </Box>
    </FormGroup>
  )
}

const Edit = (props) => {
  const { record: initialRecord, property: relatedProperty, resource: parentResource, onChange } = props
  const toResourceId = relatedProperty?.custom?.resourceId || relatedProperty.name

  const isInitialRender = useRef(true)
  const resources = useSelector((state) => state.resources)
  const targetResource = resources.find(r => r.id === toResourceId)
  const item = initialRecord.populated[relatedProperty.name] || {params: {}, errors: {}}

  const [record, setRecord] = useState(item)

  const handleRecordChange = (record) => {
    setRecord(record)
  }

  useEffect(() => {
    // Skip first render
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return
    }
    onChange(relatedProperty.name, record?.params)
  }, [record])

  useEffect(() => {
    // Skip first render
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return
    }

    setRecord({...record, errors: initialRecord?.errors[relatedProperty.name] || {}})
  }, [initialRecord?.errors])

  return (
    <FormGroup>
      <RecordEdit key={record?.id} record={record} parentResourceId={parentResource.id} resource={targetResource} onChange={handleRecordChange} />
    </FormGroup>
  )
}

export default Edit
