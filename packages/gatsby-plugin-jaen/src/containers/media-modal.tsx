import {CloseButton, Dialog, Portal} from '@chakra-ui/react'
import {JaenPage, MediaNode, PageProvider, useMediaModal} from 'jaen'
import {useEffect, useState} from 'react'

import Media from './media'

export interface MediaSelectorProps {
  isSelector?: boolean
  defaultSelected?: string
  jaenPageId?: string
  onSelect: (mediaNode: MediaNode) => void
}

const MediaModal: React.FC<MediaSelectorProps> = props => {
  const context = useMediaModal({
    id: 'MediaModal'
  })

  const [jaenPage, setJaenPage] = useState<
    {
      id: string
    } & Partial<JaenPage>
  >({
    id: 'JaenPage /cms/media/'
  })

  useEffect(() => {
    const fn = async () => {
      // load jaenPage
      const data = await fetch('/page-data/cms/media/page-data.json')

      const json = await data.json()

      setJaenPage(json.result.data.jaenPage as JaenPage)
    }

    if (context.isOpen) {
      fn()
    }
  }, [context.isOpen])

  return (
    <Dialog.Root
      open={context.isOpen}
      onOpenChange={e => {
        if (!e.open) {
          context.toggleModal()
        }
      }}>
      <Portal>
        <Dialog.Backdrop />
        {/*
          v2 reached the content container through ModalContent's containerProps
          and hung id="momo" on it, because the provider scoped its variables to
          that selector and a portal lands outside the header that carries it.
          v3 emits them globally behind the `jaen` prefix instead (see
          gatsby/wrap-root-element), so nothing here needs a root of its own —
          the same call DrawerLeft, DrawerRight and jaen's notifications already
          made.

          The id must not be re-homed onto the positioner: zag owns that
          element's id (`dialog:<uid>:positioner`) and looks the node back up
          with getElementById to write `--layer-index` and `--z-index` onto it.
          Overriding it points that lookup at JaenFrame's header, the first
          #momo in document order, so the real positioner never gets its layer
          index — which matters here because MediaPreview opens a second dialog
          on top of this one.
        */}
        <Dialog.Positioner>
          <Dialog.Content maxW="96rem">
            {/* <ModalHeader>Modal Title</ModalHeader> */}
            {/* v3's CloseTrigger renders whatever it is handed and nothing
                otherwise, where v2's ModalCloseButton brought its own X.
                size="xs" is v3's 32px, the size v2's CloseButton drew at its
                default `md`, and the gray palette keeps the hover neutral
                against the brand one jaen's button recipe pins in `base`. */}
            <Dialog.CloseTrigger asChild>
              <CloseButton size="xs" colorPalette="gray" />
            </Dialog.CloseTrigger>
            <Dialog.Body p="1">
              <PageProvider jaenPage={jaenPage}>
                <Media
                  isSelector={props.isSelector}
                  onSelect={props.onSelect}
                  defaultSelected={props.defaultSelected}
                  jaenPageId={props.jaenPageId}
                />
              </PageProvider>
            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}

export default MediaModal
