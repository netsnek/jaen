import {
  Button,
  createToaster,
  Icon,
  Input,
  NativeSelect,
  Stack,
  Text,
  Toast,
  Toaster,
  Dialog,
  Portal
} from '@chakra-ui/react'
import {
  createContext,
  ElementType,
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
      icon?: ElementType
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

/**
 * What v2's useToast() took, narrowed to the keys the CMS passes.
 *
 * v3 replaces the hook with a store whose `create` reads `type` where v2 read
 * `status`, and which has no `isClosable` or `position` at all. Handing that
 * store out as `toast` would have meant rewriting some forty call sites across
 * five packages from `toast({...})` to `toaster.create({...})`, so `toast`
 * stays a function taking v2's options and this file does the translating.
 *
 * `position` is deliberately not the full v2 list. A v3 toaster fixes its
 * placement when the store is created, so only placements that have a store
 * below can be honoured, and a name with no store would silently come out
 * somewhere else. The two here are the two the repo asks for.
 */
export interface ToastOptions {
  title?: ReactNode
  description?: ReactNode
  status?: 'info' | 'success' | 'warning' | 'error' | 'loading'
  duration?: number
  isClosable?: boolean
  position?: 'bottom' | 'top-right'
}

export interface Notifications {
  alert: OpenerFn
  confirm: OpenerFn
  prompt: OpenerFn
  toast: (options: ToastOptions) => void
}

/**
 * One store per placement, created once for the module rather than per mount,
 * because a store that is recreated on render loses the toasts it is showing.
 *
 * The duration is v2's provider-wide 2000ms. v3 would otherwise use its own
 * per-type defaults, which are 5000ms for most types and forever for loading.
 */
const toasters = {
  bottom: createToaster({placement: 'bottom', duration: 2000}),
  'top-right': createToaster({placement: 'top-end', duration: 2000})
}

const toast = ({status, isClosable, position, ...rest}: ToastOptions) => {
  toasters[position ?? 'bottom'].create({
    ...rest,
    // Spelled out rather than passed through as undefined, because the store
    // merges the toast over its own defaults and an explicit undefined would
    // erase them. 'info' is what v2's Alert fell back to.
    type: status ?? 'info',
    // v2 set isClosable on the provider, so every toast carried a close button
    // unless a call site said otherwise. v3 decides per toast and defaults to
    // none.
    closable: isClosable ?? true
  })
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
  toast() {
    throw new Error('<NotificationsProvider> is missing')
  }
}

const Context = createContext<Notifications>(defaultContext)

interface AnyEvent {
  preventDefault: () => void
}

export const NotificationsProvider = ({children}: {children: ReactNode}) => {
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
                              onChange={e => setInputValue(e.target.value)}
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
                            onChange={e => setInputValue(e.target.value)}
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
              onOpenChange={(e: {open: boolean}) => {
                if (!e.open) {
                  handleClose()
                }
              }}>
              <Portal>
                <Dialog.Backdrop />
                {/* v2 hung id="momo" on the content's container here, because
                    the provider scoped its custom properties to that selector
                    and a portal lands outside the element that carries it. v3
                    emits them globally behind the `jaen` prefix, so the dialog
                    needs no root of its own, which is as well because v3 has no
                    containerProps to put one on. */}
                <Dialog.Positioner>
                  <Dialog.Content overflow="hidden">
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
      {/* v2's hook rendered its own container into the body; v3 draws nothing
          until a Toaster is mounted for the store, so each store needs one.
          The toast itself is v3's default shape, since the ported theme has no
          toast recipe and v2's `variant: 'subtle'` has no v3 counterpart to
          carry it to. */}
      <Portal>
        {Object.entries(toasters).map(([position, toaster]) => (
          <Toaster key={position} toaster={toaster}>
            {({title, description, closable}) => (
              <Toast.Root width={{md: 'sm'}}>
                <Toast.Indicator />
                <Stack gap="1" flex="1" maxWidth="100%">
                  {title && <Toast.Title>{title}</Toast.Title>}
                  {description && (
                    <Toast.Description>{description}</Toast.Description>
                  )}
                </Stack>
                {closable && <Toast.CloseTrigger />}
              </Toast.Root>
            )}
          </Toaster>
        ))}
      </Portal>

      {modal}

      {children}
    </Context.Provider>
  )
}

export const useNotificationsContext = () => useContext(Context)
