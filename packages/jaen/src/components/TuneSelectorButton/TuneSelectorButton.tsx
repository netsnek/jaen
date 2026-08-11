import {Box, Flex, Icon, IconButton, IconButtonProps} from '@chakra-ui/react'
import {useState} from 'react'
import {FaBars} from '@react-icons/all-files/fa/FaBars'

import {TuneSelector, TuneSelectorProps} from './components/TuneSelector'

export interface TuneSelectorButtonProps extends IconButtonProps {
  tunes: TuneSelectorProps['tunes']
  onTune?: TuneSelectorProps['onTune']
  activeTunes?: TuneSelectorProps['activeTunes']
}

export const TuneSelectorButton: React.FC<TuneSelectorButtonProps> = ({
  tunes,
  onTune = () => {},
  activeTunes = [],
  children,
  ...iconButtonProps
}) => {
  const [isOpen, setIsOpen] = useState(false)

  const toggleOpen = () => {
    setIsOpen(!isOpen)
  }

  return (
    <Flex pos="relative">
      <IconButton
        variant={
          // This variant is declared in gatsby-plugin-jaen's button recipe.
          // Widening the type of `variant` beyond the names v3's own recipe
          // carries takes a `chakra typegen` run, which no package here has a
          // script for, so the name is asserted instead.
          'field-highlighter-tooltip' as IconButtonProps['variant']
        }
        onClick={toggleOpen}
        {...iconButtonProps}>
        {/* v2 took the glyph as `icon`, which v3 dropped in favour of children.
            TextField hands one over to label its text tunes with a serif T. */}
        {children ?? (
          <Icon asChild>
            <FaBars />
          </Icon>
        )}
      </IconButton>
      {isOpen && (
        <Box position="absolute" top="6" left="0" zIndex="popover" p="2">
          <TuneSelector
            tunes={tunes}
            onTune={onTune}
            activeTunes={activeTunes}
            onClose={() => {
              setIsOpen(false)
            }}
          />
        </Box>
      )}
    </Flex>
  )
}
