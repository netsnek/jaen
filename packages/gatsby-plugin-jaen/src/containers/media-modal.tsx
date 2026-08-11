import {Dialog, Portal} from '@chakra-ui/react'
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
        <Dialog.Positioner>
          <Dialog.Content
            maxW="96rem"
            containerProps={{
              id: 'momo'
            }}>
            {/* <ModalHeader>Modal Title</ModalHeader> */}
            <Dialog.CloseTrigger />
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
