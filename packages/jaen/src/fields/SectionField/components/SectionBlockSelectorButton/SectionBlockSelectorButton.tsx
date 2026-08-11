import {Box, Flex, IconButton, IconButtonProps, Icon} from '@chakra-ui/react'
import React, {useRef, useState} from 'react'
import {FaPlus} from '@react-icons/all-files/fa/FaPlus'

import {
  SectionBlockSelector,
  SectionBlockSelectorProps,
  SelectorBlockType
} from '../SectionBlockSelector'

export interface SectionBlockSelectorButtonProps {
  blocks: SelectorBlockType[]
  onBlockAdd: SectionBlockSelectorProps['onBlockAdd']
  onlyAdd?: boolean
}

export const SectionBlockSelectorButton: React.FC<
  SectionBlockSelectorButtonProps
> = props => {
  const [isOpen, setIsOpen] = useState(false)

  const toggleOpen = () => {
    setIsOpen(!isOpen)
  }

  const handleBlockAdd: SectionBlockSelectorButtonProps['onBlockAdd'] = (
    ...args
  ) => {
    props.onBlockAdd(...args)
    setIsOpen(false)
  }

  const canClose = useRef(false)

  const handleMouseLeave = () => {
    canClose.current = true
    setTimeout(() => {
      if (canClose.current) {
        setIsOpen(false)
      }
    }, 1000)
  }

  const handleMouseEnter = () => {
    canClose.current = false
  }

  return (
    <Flex
      pos="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}>
      <IconButton
        variant={
          // This variant is declared in gatsby-plugin-jaen's button recipe.
          // Widening the type of `variant` beyond the names v3's own recipe
          // carries takes a `chakra typegen` run, which no package here has a
          // script for, so the name is asserted instead.
          'field-highlighter-tooltip' as IconButtonProps['variant']
        }
        ml={0.5}
        aria-label="Add"
        onClick={toggleOpen}>
        <Icon asChild>
          <FaPlus />
        </Icon>
      </IconButton>
      {isOpen && (
        <Box position="absolute" top="6" left="0" zIndex="popover" p="2">
          <SectionBlockSelector
            sectionTitle="Add block"
            sectionDescription="Select the type of block you want to add"
            blockTypes={props.blocks}
            onBlockAdd={handleBlockAdd}
            onlyAdd={props.onlyAdd}
          />
        </Box>
      )}
    </Flex>
  )
}
