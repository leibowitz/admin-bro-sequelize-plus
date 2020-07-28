import React from 'react'
import { Icon, useTranslation } from 'admin-bro'

const AddNewItemButton = (props) => {
  const { resource, property } = props
  const { translateProperty, translateButton } = useTranslation()
  const label = translateProperty(
    `${property.name}.addNewItem`,
    resource.id, {
      defaultValue: translateButton('addNewItem', resource.id),
    },
  )

  return (
    <>
      <Icon icon="Add" />
      {label}
    </>
  )
}

export default AddNewItemButton
