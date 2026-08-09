import {useState} from 'react'
import {Controller, useForm} from 'react-hook-form'
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Badge,
  Button,
  ButtonGroup,
  Divider,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Switch,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  VStack,
  useDisclosure
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
  const {isOpen, onOpen, onClose} = useDisclosure()
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
        isLoading={formState.isSubmitting}
        variant="outline">
        Manage Senders
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Senders</ModalHeader>
          <ModalCloseButton />
          <form onSubmit={handleSubmit(onSubmitForm)}>
            <ModalBody>
              <VStack spacing={4} align="stretch">
                {error && (
                  <Alert status="error">
                    <AlertIcon />
                    <AlertTitle mr={2}>Error!</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {senders.length > 0 ? (
                  <Table size="sm">
                    <Thead>
                      <Tr>
                        <Th>Address</Th>
                        <Th>Transport</Th>
                        <Th></Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {senders.map(sender => (
                        <Tr key={sender.id}>
                          <Td>
                            <HStack>
                              <Text>{sender.address}</Text>
                              {sender.isDefault && (
                                <Badge colorScheme="green">default</Badge>
                              )}
                              {!sender.enabled && (
                                <Badge colorScheme="red">disabled</Badge>
                              )}
                            </HStack>
                          </Td>
                          <Td>{sender.transport}</Td>
                          <Td>
                            <ButtonGroup
                              size="xs"
                              variant="outline"
                              isDisabled={busySenderId === sender.id}>
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
                                }>
                                Verify
                              </Button>
                              <Button
                                colorScheme="red"
                                onClick={() =>
                                  runSenderAction(sender.id, onDelete)
                                }>
                                Delete
                              </Button>
                            </ButtonGroup>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                ) : (
                  <Text color="gray.500">No senders configured yet.</Text>
                )}

                <Divider />

                <Text fontWeight="semibold">Add SMTP sender</Text>

                <Controller
                  name="address"
                  control={control}
                  rules={{required: 'Address is required'}}
                  render={({field, fieldState: {error}}) => (
                    <FormControl isInvalid={!!error}>
                      <FormLabel>Email Address</FormLabel>
                      <Input {...field} placeholder="noreply@example.com" />
                      {error && <Text color="red.500">{error.message}</Text>}
                    </FormControl>
                  )}
                />
                <Controller
                  name="displayName"
                  control={control}
                  render={({field}) => (
                    <FormControl>
                      <FormLabel>Display Name</FormLabel>
                      <Input {...field} />
                    </FormControl>
                  )}
                />
                <Controller
                  name="smtp.host"
                  control={control}
                  rules={{required: 'SMTP Host is required'}}
                  render={({field, fieldState: {error}}) => (
                    <FormControl isInvalid={!!error}>
                      <FormLabel>SMTP Host</FormLabel>
                      <Input {...field} />
                      {error && <Text color="red.500">{error.message}</Text>}
                    </FormControl>
                  )}
                />
                <Controller
                  name="smtp.port"
                  control={control}
                  rules={{required: 'SMTP Port is required'}}
                  render={({field, fieldState: {error}}) => (
                    <FormControl isInvalid={!!error}>
                      <FormLabel>SMTP Port</FormLabel>
                      <Input {...field} type="number" />
                      {error && <Text color="red.500">{error.message}</Text>}
                    </FormControl>
                  )}
                />
                <Controller
                  name="smtp.secure"
                  control={control}
                  render={({field: {onChange, value, ref}}) => (
                    <FormControl display="flex" alignItems="center">
                      <FormLabel htmlFor="secure" mb="0">
                        Secure
                      </FormLabel>
                      <Switch
                        id="secure"
                        onChange={onChange}
                        isChecked={value}
                        ref={ref}
                      />
                    </FormControl>
                  )}
                />
                <Controller
                  name="smtp.username"
                  control={control}
                  rules={{required: 'SMTP Username is required'}}
                  render={({field, fieldState: {error}}) => (
                    <FormControl isInvalid={!!error}>
                      <FormLabel>SMTP Username</FormLabel>
                      <Input {...field} />
                      {error && <Text color="red.500">{error.message}</Text>}
                    </FormControl>
                  )}
                />
                <Controller
                  name="smtp.password"
                  control={control}
                  rules={{required: 'SMTP Password is required'}}
                  render={({field, fieldState: {error}}) => (
                    <FormControl isInvalid={!!error}>
                      <FormLabel>SMTP Password</FormLabel>
                      <Input {...field} type="password" />
                      {error && <Text color="red.500">{error.message}</Text>}
                    </FormControl>
                  )}
                />
                <Controller
                  name="isDefault"
                  control={control}
                  render={({field: {onChange, value, ref}}) => (
                    <FormControl display="flex" alignItems="center">
                      <FormLabel htmlFor="isDefault" mb="0">
                        Set as default sender
                      </FormLabel>
                      <Switch
                        id="isDefault"
                        onChange={onChange}
                        isChecked={value}
                        ref={ref}
                      />
                    </FormControl>
                  )}
                />
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button
                colorScheme="blue"
                mr={3}
                type="submit"
                isLoading={formState.isSubmitting}>
                Create Sender
              </Button>
              <Button variant="ghost" onClick={onClose}>
                Close
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  )
}
