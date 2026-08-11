import {
  As,
  Button,
  CreateToastFnReturn,
  Icon,
  Input,
  NativeSelect,
  Stack,
  Text,
  useToast,
  Dialog,
  Portal
} from '@chakra-ui/react'
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useRef,
  useState
} from 'react'

enum ModalType {
  Alert,
  Confirm,
  Prompt
}

interface OpenerFn {
  (
    args: {
      icon?: As
      title: string
      message: string
      options?: Array<{
        id: string
        label: string
      }>
      confirmText?: string
      cancelText?: string
      placeholder?: string
    },
    defaultValue?: string
  ): Promise<any>
}

export interface Notifications {
  alert: OpenerFn
  confirm: OpenerFn
  prompt: OpenerFn
  toast: CreateToastFnReturn
}

const defaultContext: Notifications = {
  alert() {
    throw new Error('<NotificationsProvider> is missing')
  },
  confirm() {
    throw new Error('<NotificationsProvider> is missing')
  },
  prompt() {
    throw new Error('<NotificationsProvider> is missing')
  },
  toast: {} as CreateToastFnReturn
}

const Context = createContext<Notifications>(defaultContext)

interface AnyEvent {
  preventDefault: () => void
}

export const NotificationsProvider = ({children}: {children: ReactNode}) => {
  const toast = useToast({
    position: 'bottom',
    duration: 2000,
    isClosable: true,
    variant: 'subtle'
  })

  const [modal, setModal] = useState<ReactNode | null>(null)
  const input = useRef<HTMLInputElement | HTMLSelectElement>(null)
  const ok = useRef<HTMLButtonElement>(null)

  // const jaenTheme = useJaenTheme()

  const createOpener = useCallback(
    (type: ModalType) =>
      async (...props: Parameters<OpenerFn>) =>
        await new Promise(resolve => {
          const [args, defaultValue] = props

          const handleClose = (e?: AnyEvent) => {
            e?.preventDefault()
            setModal(null)
            resolve(null)
          }

          const handleCancel = (e?: AnyEvent) => {
            e?.preventDefault()
            setModal(null)
            if (type === ModalType.Prompt) resolve(null)
            else resolve(false)
          }

          const handleOK = (e?: AnyEvent) => {
            e?.preventDefault()
            setModal(null)
            if (type === ModalType.Prompt) resolve(input.current?.value)
            else resolve(true)
          }

          const Content = () => {
            const [inputValue, setInputValue] = useState(defaultValue || '')

            return (
              <>
                <Dialog.Header>
                  <Stack direction="row" alignItems="center">
                    {args.icon && (
                      <Icon
                        bg="brand.100"
                        color="brand.500"
                        borderRadius="full"
                        boxSize="10"
                        p="2"
                        asChild>
                        <args.icon />
                      </Icon>
                    )}
                    <Text>{args.title}</Text>
                  </Stack>
                </Dialog.Header>
                <Dialog.Body mt="0" mb={2}>
                  <Stack gap={5}>
                    <Text>{args.message}</Text>
                    {type === ModalType.Prompt && (
                      <>
                        {args.options ? (
                          <NativeSelect.Root>
                            <NativeSelect.Field
                              ref={input as React.RefObject<HTMLSelectElement>}
                              placeholder={args.placeholder}
                              defaultValue={defaultValue}
                              onValueChange={e => setInputValue(e.target.value)}
                              value={inputValue}>
                              {args.options.map(option => (
                                <option key={option.id} value={option.id}>
                                  {option.label}
                                </option>
                              ))}
                            </NativeSelect.Field>
                            <NativeSelect.Indicator />
                          </NativeSelect.Root>
                        ) : (
                          <Input
                            ref={input as React.RefObject<HTMLInputElement>}
                            placeholder={args.placeholder}
                            defaultValue={defaultValue}
                            onValueChange={e => setInputValue(e.target.value)}
                            value={inputValue}
                          />
                        )}
                      </>
                    )}
                  </Stack>
                </Dialog.Body>
                <Dialog.Footer bg="bg.subtle" py="3">
                  {type !== ModalType.Alert && (
                    <Button mr={3} variant="outline" onClick={handleCancel}>
                      {args.cancelText || 'Cancel'}
                    </Button>
                  )}
                  <Button
                    onClick={handleOK}
                    ref={ok}
                    disabled={type === ModalType.Prompt && inputValue === ''}>
                    {args.confirmText || 'OK'}
                  </Button>
                </Dialog.Footer>
              </>
            )
          }

          setModal(
            <Dialog.Root
              open={true}
              initialFocusEl={() =>
                (type === ModalType.Prompt ? input : ok).current
              }
              onOpenChange={e => {
                if (!e.open) {
                  handleClose()
                }
              }}>
              <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                  <Dialog.Content
                    containerProps={{
                      id: 'momo'
                    }}
                    overflow="hidden">
                    <Content />
                  </Dialog.Content>
                </Dialog.Positioner>
              </Portal>
            </Dialog.Root>
          )
        }),
    [children]
  )

  return (
    <Context.Provider
      value={{
        alert: createOpener(ModalType.Alert),
        confirm: createOpener(ModalType.Confirm),
        prompt: createOpener(ModalType.Prompt),
        toast
      }}>
      {modal}

      {children}
    </Context.Provider>
  )
}

export const useNotificationsContext = () => useContext(Context)
