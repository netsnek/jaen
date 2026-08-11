import {useState} from 'react'
import {Controller, useForm} from 'react-hook-form'
import {
  Alert,
  Badge,
  Button,
  ButtonGroup,
  HStack,
  Input,
  Switch,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  VStack,
  useDisclosure,
  Separator,
  Field,
  Dialog,
  Portal
} from '@chakra-ui/react'

export interface SenderSmtpFormData {
  host: string
  port: number
  secure: boolean
  username: string
  password: string
}

export interface SenderFormData {
  address: string
  displayName?: string
  isDefault: boolean
  smtp: SenderSmtpFormData
}

export interface SenderItem {
  id: string
  address: string
  displayName?: string | null
  transport: string
  isDefault: boolean
  enabled: boolean
}

export interface SenderModalProps {
  senders: SenderItem[]
  /** Create an SMTP sender (emailwerk `senderCreate`). */
  onCreate: (data: SenderFormData) => Promise<void>
  /** Make a sender the org default (emailwerk `senderSetDefault`). */
  onSetDefault: (id: string) => Promise<void>
  /** Verify a sender's connectivity (emailwerk `senderVerify`). */
  onVerify: (id: string) => Promise<void>
  /** Delete a sender (emailwerk `senderDelete`). */
  onDelete: (id: string) => Promise<void>
}

/**
 * Sender management modal: lists the org's senders (default/enabled state,
 * set-default / verify / delete actions) and creates new SMTP senders.
 * Replaces the mailpress-era EmailSMTPModal (org-wide single mailbox).
 */
export function SenderModal({
  senders,
  onCreate,
  onSetDefault,
  onVerify,
  onDelete
}: SenderModalProps) {
  const {open, onOpen, onClose} = useDisclosure()
  const [error, setError] = useState<string | null>(null)
  const [busySenderId, setBusySenderId] = useState<string | null>(null)
  const {control, handleSubmit, reset, formState} = useForm<SenderFormData>({
    defaultValues: {
      address: '',
      displayName: '',
      isDefault: true,
      smtp: {
        host: '',
        port: 587,
        secure: false,
        username: '',
        password: ''
      }
    }
  })

  const onSubmitForm = async (data: SenderFormData) => {
    setError(null)
    try {
      data.smtp.port = Number(data.smtp.port)
      await onCreate(data)
      reset()
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || 'An error occurred while submitting the form.')
      } else {
        setError('An unknown error occurred.')
      }
    }
  }

  const runSenderAction = async (
    id: string,
    action: (id: string) => Promise<void>
  ) => {
    setError(null)
    setBusySenderId(id)
    try {
      await action(id)
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || 'Sender action failed.')
      } else {
        setError('An unknown error occurred.')
      }
    } finally {
      setBusySenderId(null)
    }
  }

  return (
    <>
      <Button
        onClick={onOpen}
        loading={formState.isSubmitting}
        variant="outline">
        Manage Senders
      </Button>

      <Dialog.Root
        open={isOpen}
        size="xl"
        onOpenChange={e => {
          if (!e.open) {
            onClose()
          }
        }}>
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>Senders</Dialog.Header>
              <Dialog.CloseTrigger />
              <form onSubmit={handleSubmit(onSubmitForm)}>
                <Dialog.Body>
                  <VStack gap={4} align="stretch">
                    {error && (
                      <Alert.Root status="error">
                        <Alert.Indicator />
                        <Alert.Title mr={2}>Error!</Alert.Title>
                        <Alert.Description>{error}</Alert.Description>
                      </Alert.Root>
                    )}

                    {senders.length > 0 ? (
                      <Table.Root size="sm">
                        <Table.Header>
                          <Table.Row>
                            <Table.ColumnHeader>Address</Table.ColumnHeader>
                            <Table.ColumnHeader>Transport</Table.ColumnHeader>
                            <Table.ColumnHeader></Table.ColumnHeader>
                          </Table.Row>
                        </Table.Header>
                        <Table.Body>
                          {senders.map(sender => (
                            <Table.Row key={sender.id}>
                              <Table.Cell>
                                <HStack>
                                  <Text>{sender.address}</Text>
                                  {sender.isDefault && (
                                    <Badge colorPalette="green">default</Badge>
                                  )}
                                  {!sender.enabled && (
                                    <Badge colorPalette="red">disabled</Badge>
                                  )}
                                </HStack>
                              </Table.Cell>
                              <Table.Cell>{sender.transport}</Table.Cell>
                              <Table.Cell>
                                <ButtonGroup size="xs" variant="outline">
                                  {!sender.isDefault && (
                                    <Button
                                      onClick={() =>
                                        runSenderAction(sender.id, onSetDefault)
                                      }>
                                      Make default
                                    </Button>
                                  )}
                                  <Button
                                    onClick={() =>
                                      runSenderAction(sender.id, onVerify)
                                    }
                                    disabled={busySenderId === sender.id}>
                                    Verify
                                  </Button>
                                  <Button
                                    colorPalette="red"
                                    onClick={() =>
                                      runSenderAction(sender.id, onDelete)
                                    }
                                    disabled={busySenderId === sender.id}>
                                    Delete
                                  </Button>
                                </ButtonGroup>
                              </Table.Cell>
                            </Table.Row>
                          ))}
                        </Table.Body>
                      </Table.Root>
                    ) : (
                      <Text color="gray.500">No senders configured yet.</Text>
                    )}

                    <Separator />

                    <Text fontWeight="semibold">Add SMTP sender</Text>

                    <Controller
                      name="address"
                      control={control}
                      rules={{required: 'Address is required'}}
                      render={({field, fieldState: {error}}) => (
                        <Field.Root invalid={!!error}>
                          <Field.Label>Email Address</Field.Label>
                          <Input {...field} placeholder="noreply@example.com" />
                          {error && (
                            <Text color="red.500">{error.message}</Text>
                          )}
                        </Field.Root>
                      )}
                    />
                    <Controller
                      name="displayName"
                      control={control}
                      render={({field}) => (
                        <Field.Root>
                          <Field.Label>Display Name</Field.Label>
                          <Input {...field} />
                        </Field.Root>
                      )}
                    />
                    <Controller
                      name="smtp.host"
                      control={control}
                      rules={{required: 'SMTP Host is required'}}
                      render={({field, fieldState: {error}}) => (
                        <Field.Root invalid={!!error}>
                          <Field.Label>SMTP Host</Field.Label>
                          <Input {...field} />
                          {error && (
                            <Text color="red.500">{error.message}</Text>
                          )}
                        </Field.Root>
                      )}
                    />
                    <Controller
                      name="smtp.port"
                      control={control}
                      rules={{required: 'SMTP Port is required'}}
                      render={({field, fieldState: {error}}) => (
                        <Field.Root invalid={!!error}>
                          <Field.Label>SMTP Port</Field.Label>
                          <Input {...field} type="number" />
                          {error && (
                            <Text color="red.500">{error.message}</Text>
                          )}
                        </Field.Root>
                      )}
                    />
                    <Controller
                      name="smtp.secure"
                      control={control}
                      render={({field: {onChange, value, ref}}) => (
                        <Field.Root display="flex" alignItems="center">
                          <Field.Label htmlFor="secure" mb="0">
                            Secure
                          </Field.Label>
                          <Switch
                            id="secure"
                            onValueChange={onChange}
                            checked={value}
                            ref={ref}
                          />
                        </Field.Root>
                      )}
                    />
                    <Controller
                      name="smtp.username"
                      control={control}
                      rules={{required: 'SMTP Username is required'}}
                      render={({field, fieldState: {error}}) => (
                        <Field.Root invalid={!!error}>
                          <Field.Label>SMTP Username</Field.Label>
                          <Input {...field} />
                          {error && (
                            <Text color="red.500">{error.message}</Text>
                          )}
                        </Field.Root>
                      )}
                    />
                    <Controller
                      name="smtp.password"
                      control={control}
                      rules={{required: 'SMTP Password is required'}}
                      render={({field, fieldState: {error}}) => (
                        <Field.Root invalid={!!error}>
                          <Field.Label>SMTP Password</Field.Label>
                          <Input {...field} type="password" />
                          {error && (
                            <Text color="red.500">{error.message}</Text>
                          )}
                        </Field.Root>
                      )}
                    />
                    <Controller
                      name="isDefault"
                      control={control}
                      render={({field: {onChange, value, ref}}) => (
                        <Field.Root display="flex" alignItems="center">
                          <Field.Label htmlFor="isDefault" mb="0">
                            Set as default sender
                          </Field.Label>
                          <Switch
                            id="isDefault"
                            onValueChange={onChange}
                            checked={value}
                            ref={ref}
                          />
                        </Field.Root>
                      )}
                    />
                  </VStack>
                </Dialog.Body>
                <Dialog.Footer>
                  <Button
                    colorPalette="blue"
                    mr={3}
                    type="submit"
                    loading={formState.isSubmitting}>
                    Create Sender
                  </Button>
                  <Button variant="ghost" onClick={onClose}>
                    Close
                  </Button>
                </Dialog.Footer>
              </form>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </>
  )
}
