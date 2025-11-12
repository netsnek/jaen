import {PageConfig} from 'jaen'
import {PageProps} from 'gatsby'
import React, {useState} from 'react'

import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Switch,
  Text,
  VStack,
  useDisclosure
} from '@chakra-ui/react'
import {Controller, useForm} from 'react-hook-form'

interface SMTPConfig {
  host: string
  port: number
  secure: boolean
  password: string
}

interface EmailSMTPFormData {
  email: string
  config: SMTPConfig
}

interface EmailSMTPModalProps {
  onSubmit: (data: EmailSMTPFormData) => Promise<void>
}

const EmailSMTPModal: React.FC<EmailSMTPModalProps> = ({onSubmit}) => {
  const {isOpen, onOpen, onClose} = useDisclosure()
  const [error, setError] = useState<string | null>(null)
  const {control, handleSubmit, reset, formState} = useForm<EmailSMTPFormData>({
    defaultValues: {
      email: '',
      config: {
        host: '',
        port: 587,
        secure: false,
        password: ''
      }
    }
  })

  const onSubmitForm = async (data: EmailSMTPFormData) => {
    setError(null)
    try {
      const parsed = {
        ...data,
        config: {
          ...data.config,
          port: Number(data.config.port)
        }
      }

      await onSubmit(parsed)
      onClose()
      reset()
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || 'An error occurred while submitting the form.')
      } else {
        setError('An unknown error occurred.')
      }
    }
  }

  return (
    <>
      <Button
        onClick={onOpen}
        isLoading={formState.isSubmitting}
        variant="outline">
        Connect Email
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent as="form" onSubmit={handleSubmit(onSubmitForm)}>
          <ModalHeader>Email and SMTP Configuration</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="stretch">
              {error && (
                <Alert status="error">
                  <AlertIcon />
                  <AlertTitle mr={2}>Error!</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <Controller
                name="email"
                control={control}
                rules={{required: 'Email is required'}}
                render={({field, fieldState: {error}}) => (
                  <FormControl isInvalid={!!error}>
                    <FormLabel>Email</FormLabel>
                    <Input {...field} />
                    {error && <Text color="red.500">{error.message}</Text>}
                  </FormControl>
                )}
              />
              <Controller
                name="config.host"
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
                name="config.port"
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
                name="config.secure"
                control={control}
                render={({field: {onChange, value, ref}}) => (
                  <FormControl display="flex" alignItems="center">
                    <FormLabel htmlFor="secure" mb="0">
                      Secure Connection
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
                name="config.password"
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
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button
              colorScheme="brand"
              type="submit"
              isLoading={formState.isSubmitting}>
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

const AccountPage: React.FC<PageProps> = () => {
  const handleSubmit = async (data: EmailSMTPFormData) => {
    console.log('SMTP configuration submitted', data)
  }

  return (
    <Stack spacing={8} py={8} px={{base: 4, md: 8}}>
      <Box>
        <Heading size="lg" mb={2}>
          Account
        </Heading>
        <Text color="gray.500">
          Manage your profile and notification preferences.
        </Text>
      </Box>

      <Box borderWidth="1px" borderRadius="lg" p={6} bg="white" shadow="sm">
        <Stack spacing={4}>
          <Heading size="md">Email Integrations</Heading>
          <Text color="gray.600">
            Connect an SMTP server to send booking confirmations and updates on
            behalf of your brand.
          </Text>
          <EmailSMTPModal onSubmit={handleSubmit} />
        </Stack>
      </Box>
    </Stack>
  )
}

export default AccountPage

export const pageConfig: PageConfig = {
  label: 'Account',
  icon: 'FaUser',
  menu: {
    order: 30,
    type: 'user'
  },
  auth: {
    isRequired: true
  },
  layout: {
    name: 'jaen'
  }
}

export {Head} from 'jaen'
