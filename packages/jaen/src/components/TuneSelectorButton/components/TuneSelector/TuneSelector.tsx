import {
  BoxProps,
  HStack,
  Icon,
  IconButton,
  Input,
  InputGroup,
  Text,
  VStack,
  Wrap,
  WrapItem
} from '@chakra-ui/react'
import {useState} from 'react'
import {FaSearch} from '@react-icons/all-files/fa/FaSearch'

interface BaseTune {
  name: string
  label?: string
  props?: BoxProps & Record<string, any>
  requiredProps?: string[]
  onTune?: () => void
  Icon: React.ComponentType<{}>
  isDisableOnActive?: boolean
  isHiddenOnActive?: boolean
}

export interface Tune extends BaseTune {
  type: 'tune'
  label: string
}

interface GroupTune {
  type: 'groupTune'
  name: string
  label: string
  tunes: BaseTune[]
}

export type TuneOption = Tune | GroupTune

export interface TuneSelectorProps {
  tunes: TuneOption[]
  activeTunes?: Array<{
    name: string
    groupName?: string
  }>
  onTune: (info: {name: string; groupName?: string; isActive: boolean}) => void
  onClose: () => void
}

export const TuneSelector: React.FC<TuneSelectorProps> = ({
  tunes,
  activeTunes = [],
  onTune,
  onClose
}) => {
  const [searchTerm, setSearchTerm] = useState('')

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
  }

  const filteredTunes = tunes.filter(tune => {
    if ('type' in tune && tune.type === 'groupTune') {
      return tune.tunes.some(
        subTune =>
          subTune.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          subTune.label?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    } else {
      return (
        tune.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tune.label.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
  })

  const handleTune = (info: {
    tune: BaseTune
    group?: GroupTune
    isActive: boolean
  }) => {
    info.tune.onTune?.()

    onTune({
      name: info.tune.name,
      groupName: info.group?.name,
      isActive: info.isActive
    })

    onClose()
  }

  return (
    <VStack
      p="3"
      rounded="xl"
      bg="white"
      w="48"
      maxW="300px"
      shadow="lg"
      border="1px"
      borderColor="gray.100">
      {/* v2's InputGroup fed size and variant to the Input through context and
          v3's is a plain Group, so size sits on the Input now, which is where
          v3 reads it. `filled` has no v3 counterpart at all and the ported
          theme did not add one; the bg, _hover and _focus below were already
          overriding everything filled contributed except its transparent
          border, so the box gains outline's 1px edge and nothing else. */}
      <InputGroup rounded="md" startElement={<FaSearch color="gray.300" />}>
        <Input
          size="sm"
          placeholder="Search"
          value={searchTerm}
          onChange={handleSearch}
          px="10"
          py="1"
          bg="gray.50"
          _hover={{
            bg: 'gray.100'
          }}
          _focus={{
            bg: 'gray.100',
            // v2 resolved `outline` against Chakra's own shadow scale, which
            // v3 does not ship and the ported theme did not replace, so this
            // now draws nothing. Left standing rather than swapped for the
            // theme's `focus`, which is a different ring: picking the
            // replacement is the theme's call, not this file's.
            boxShadow: 'outline'
          }}
        />
      </InputGroup>
      <VStack w="100%" align="flex-start" gap="1" maxH="xs" overflowY="auto">
        {filteredTunes.map((tune, index) => {
          if ('type' in tune && tune.type === 'groupTune') {
            return (
              <VStack key={index} w="full">
                <Text fontSize="sm" asChild>
                  <b>{tune.label}</b>
                </Text>
                <Wrap gap="1">
                  {tune.tunes.map((subTune, subIndex) => {
                    const isActive = activeTunes.some(
                      activeTune =>
                        activeTune.name === subTune.name &&
                        activeTune.groupName === tune.name
                    )

                    const isDisabled = isActive && subTune.isDisableOnActive

                    const isHidden = isActive && subTune.isHiddenOnActive

                    return (
                      <WrapItem
                        key={subIndex}
                        display={isHidden ? 'none' : 'flex'}>
                        <IconButton
                          size="sm"
                          variant="ghost"
                          aria-label={`${subTune.name}`}
                          {...(isActive && {
                            bg: 'gray.100',
                            cursor: 'pointer'
                          })}
                          disabled={isDisabled}
                          onClick={() => {
                            handleTune({tune: subTune, group: tune, isActive})
                          }}>
                          <Icon asChild>
                            <subTune.Icon />
                          </Icon>
                        </IconButton>
                      </WrapItem>
                    )
                  })}
                </Wrap>
              </VStack>
            )
          }

          if ('type' in tune && tune.type === 'tune') {
            const isActive = activeTunes.some(
              activeTune => activeTune.name === tune.name
            )

            const isDisabled = isActive && tune.isDisableOnActive

            const isHidden = isActive && tune.isHiddenOnActive

            return (
              <HStack
                key={index}
                display={isHidden ? 'none' : 'flex'}
                rounded="md"
                w="100%"
                p="2"
                transition="all 0.2s"
                _hover={{
                  bg: 'gray.100'
                }}
                {...(isActive && {
                  bg: 'gray.100',
                  cursor: 'pointer'
                })}
                {...(isDisabled && {
                  opacity: 0.5,
                  cursor: 'not-allowed'
                })}
                onClick={() => {
                  if (!isDisabled) {
                    handleTune({tune, isActive})
                  }
                }}>
                {tune.Icon && (
                  <Icon asChild>
                    <tune.Icon />
                  </Icon>
                )}
                <Text fontSize="sm">{tune.name}</Text>
              </HStack>
            )
          }

          return null
        })}
      </VStack>
    </VStack>
  )
}
