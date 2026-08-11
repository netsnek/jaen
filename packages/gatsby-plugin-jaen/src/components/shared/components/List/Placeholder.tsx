import {useColorModeValue} from 'jaen'
import {Box, BoxProps} from '@chakra-ui/react'

export const Placeholder: React.FC<BoxProps> = props => (
  <Box
    bg={useColorModeValue('gray.50', 'gray.700')}
    width="full"
    height="32"
    rounded="xl"
    {...props}
  />
)
