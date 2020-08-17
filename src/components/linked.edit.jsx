import React, { useState, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'

import { DrawerContent, Box, FormGroup } from 'admin-bro'
import { useRecord } from 'admin-bro'
import { BasePropertyComponent } from 'admin-bro'
import isEqual from 'lodash/isEqual';

import { findReferenceProperty, filterProperties } from './utils'

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
          {filterProperties('linked', resource.editProperties, parentResourceId).map(property => (
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
  const { record: initialRecord, property: linkedProperty, resource: parentResource, onChange } = props

  const isInitialRender = useRef(true)
  const resources = useSelector((state) => state.resources)
  const linkedResource = resources.find(r => r.id === linkedProperty.name)
  const item = initialRecord.populated[linkedProperty.name] || null
  const refProperty = findReferenceProperty(linkedResource.editProperties, parentResource.id)

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
    onChange(linkedProperty.name, record?.params)
  }, [record])

  return (
    <FormGroup>
      <RecordEdit record={record} parentResourceId={parentResource.id} resource={linkedResource} onChange={handleRecordChange} />
    </FormGroup>
  )
}

export default Edit
