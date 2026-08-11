import {Button, Icon} from '@chakra-ui/react'
import React from 'react'
import {FaEdit} from '@react-icons/all-files/fa/FaEdit'

export interface EditButtonProps {
  isEditing: boolean
  onToggleEditing: () => void
}

export const EditButton: React.FC<EditButtonProps> = props => {
  const {isEditing, onToggleEditing} = props

  return (
    <Button
      size="sm"
      colorPalette={'brand'}
      variant={isEditing ? 'solid' : 'outline'}
      onClick={onToggleEditing}>
      <Icon color={isEditing ? 'white' : 'brand.500'} asChild>
        <FaEdit />
      </Icon>
      {isEditing ? 'Stop editing' : 'Edit'}
    </Button>
  )
}
