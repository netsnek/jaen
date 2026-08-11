import {
  Button,
  Icon,
  IconButton,
  Input,
  Menu,
  Stack,
  Text,
  Portal
} from '@chakra-ui/react'
import {useState} from 'react'
import {FaGlobe} from 'react-icons/fa'
import * as SIIcons from 'react-icons/si'
import {useDebouncedCallback} from 'use-debounce'

export const SIIconKeys = Object.keys(SIIcons) as Array<keyof typeof SIIcons>

interface IconChooserProps {
  isEditing?: boolean
  icon?: keyof typeof SIIcons
  setIcon: (icon: string) => void
}
export const IconChooser: React.FC<IconChooserProps> = props => {
  const [icon, setIcon] = useState<keyof typeof SIIcons | 'FaGlobe'>(
    props.icon || 'FaGlobe'
  )

  const [searchQuery, setSearchQuery] = useState<string>('')

  // Filter icons based on search query and limit the rendering to 10 items
  const filteredIcons = SIIconKeys.filter(key =>
    key.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 10)

  const handleFilterChange = useDebouncedCallback((value: string) => {
    setSearchQuery(value)
  }, 300)

  if (!props.isEditing) {
    return (
      <IconButton variant="ghost" aria-label="Icon">
        <Icon as={icon === 'FaGlobe' ? FaGlobe : SIIcons[icon]} boxSize="6" />
      </IconButton>
    )
  }

  return (
    <Menu.Root lazyMount unmountOnExit>
      <Menu.Trigger asChild>
        <Button w="3xs" variant="outline">
          <Icon as={icon === 'FaGlobe' ? FaGlobe : SIIcons[icon]} />
          <Text>{icon.replace('Si', '')}</Text>
        </Button>
      </Menu.Trigger>
      <Portal>
        <Menu.Positioner>
          <Menu.Content>
            <Stack>
              <Input
                w="unset"
                size="sm"
                mx="2"
                placeholder="Search icons..."
                onChange={e => {
                  handleFilterChange(e.target.value)
                }}
              />
              <Stack maxH="xs" overflow="auto">
                {filteredIcons.length === 0 && <Text>No icons found</Text>}

                {filteredIcons.map(key => {
                  const IconComponent = SIIcons[key]
                  return (
                    <Menu.Item
                      key={key}
                      onSelect={() => {
                        setIcon(key)
                        props.setIcon(key)
                      }}
                      // every item needs its own value, otherwise Ark
                      // highlights the whole list at once on hover
                      value={key}>
                      {/* v2's `icon` prop wrapped the glyph in a 0.8em span
                          with a 0.75rem end margin; v3 dropped that slot, so
                          the two carry over onto the icon itself */}
                      <Icon as={IconComponent} fontSize="0.8em" me="0.75rem" />
                      {key.replace('Si', '')}
                    </Menu.Item>
                  )
                })}
              </Stack>
            </Stack>
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  )
}
