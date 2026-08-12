import {AddIcon} from './icons'
import {Box, Button, Menu, Spacer, Tabs, Portal} from '@chakra-ui/react'
import React, {useState} from 'react'

interface ComponentInfoProps {
  items: Array<{
    label: string
    onClick: () => void
  }>
}

export const ComponentInfo: React.FC<ComponentInfoProps> = ({items}) => (
  // Rebuilt by hand: the codemod turned every opening tag in this block into
  // Menu.Root while leaving the closing tags correct, so the file no longer
  // parsed. The closing tags are what told us what it meant.
  //
  // v2's `variant="link"` on the trigger button is v3's `plain`, and leftIcon
  // becomes a child.
  <Menu.Root>
    <Menu.Trigger asChild>
      <Button size="sm" variant="plain" mx="2">
        <AddIcon />
        Components
      </Button>
    </Menu.Trigger>

    <Portal>
      <Menu.Positioner>
        <Menu.Content>
          {items.map(item => (
            // value is the item's identity in v3, not a display string, so it
            // has to be unique per item rather than the codemod's 'item-0'.
            <Menu.Item
              key={item.label}
              value={item.label}
              onSelect={item.onClick}>
              {item.label}
            </Menu.Item>
          ))}
        </Menu.Content>
      </Menu.Positioner>
    </Portal>
  </Menu.Root>
)

export interface TabsProps {
  tabs: Array<{
    label: React.ReactNode
    content: React.ReactNode
  }>
  selectedTab: number
  componentsInfo?: ComponentInfoProps['items']
  /**
   * Health of the document currently in the editor, as vfile-statistics
   * reports it. The built-in template only shows it as a badge on the preview
   * label, but a custom template needs the raw numbers to react to them, for
   * instance by outlining the editor while the source parses.
   */
  stats?: {
    fatal: number
    warn: number
    info: number
    total: number
  }
}

const TabsTemplate: React.FC<TabsProps> = props => {
  const [selectedTab, setSelectedTab] = useState(props.selectedTab)

  // v3 addresses tabs by string value where v2 addressed them by index. The
  // index stays the currency of TabsProps, which is exported from the package,
  // so the translation happens here instead of in the public type.
  const handleTabChange = (details: {value: string}) => {
    setSelectedTab(Number(details.value))
  }

  return (
    <Box position="relative">
      <Tabs.Root
        value={String(selectedTab)}
        onValueChange={handleTabChange}
        pos="relative"
        size="sm">
        {/* Stays a literal var() rather than becoming bg="bg.canvas". A style
            prop compiles against the nearest provider, and this editor mounts
            both inside the CMS (jaen's system) and inline on a site page
            (the site's), where bg.canvas need not exist — netsnek.com's system
            defines no `canvas`, so the token form would emit the unresolvable
            literal `background: bg.canvas` there. jaen's provider is mounted at
            the root on every route and its variables are global in v3, so the
            var() resolves in both places, which is exactly what v2 got out of
            cssVarsRoot="#momo". Only the prefix changes. */}
        <Tabs.List
          pos="sticky"
          top="0"
          zIndex="1"
          bg="var(--jaen-colors-bg-canvas)">
          {props.tabs.map((tab, i) => (
            <Tabs.Trigger key={i} value={String(i)}>
              {tab.label}
            </Tabs.Trigger>
          ))}
          <Spacer />
          <ComponentInfo items={props.componentsInfo || []} />
        </Tabs.List>

        <Tabs.ContentGroup>
          {props.tabs.map((tab, i) => (
            <Tabs.Content key={i} value={String(i)} p="0">
              {tab.content}
            </Tabs.Content>
          ))}
        </Tabs.ContentGroup>
      </Tabs.Root>
    </Box>
  )
}

export default TabsTemplate
