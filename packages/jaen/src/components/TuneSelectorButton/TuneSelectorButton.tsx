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
          'field-highlighter-tooltip'
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
