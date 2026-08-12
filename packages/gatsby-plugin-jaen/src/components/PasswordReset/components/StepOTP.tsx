import React from 'react'
import {useForm, Controller} from 'react-hook-form'
import {
  Button,
  Center,
  HStack,
  PinInput,
  VStack,
  Stack,
  Field
} from '@chakra-ui/react'

interface FormData {
  otp: string
}

export interface StepEmailProps {
  onSubmit: (data: FormData) => Promise<void>
}

const StepOTP: React.FC<StepEmailProps> = props => {
  const {
    handleSubmit,
    control,
    watch,
    setError,
    formState: {isSubmitting, errors}
  } = useForm<FormData>()

  const onSubmit = async (data: FormData) => {
    try {
      await props.onSubmit(data)
    } catch (e) {
      // otp is wrong

      setError('otp', {
        type: 'manual',
        message: 'The OTP is invalid. Please try again.'
      })
    }
  }

  const otp = watch('otp', '')

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack gap="5">
        <Field.Root id="otp" required invalid={!!errors.otp}>
          {/* <FormLabel></FormLabel> */}
          <VStack>
            <Field.Label>
              Enter the 6-digit code sent to your email.
            </Field.Label>

            <Center>
              <HStack>
                <Controller
                  control={control}
                  rules={{required: 'This field is required'}}
                  name="otp"
                  render={({field}) => {
                    return (
                      <PinInput.Root
                        autoFocus
                        otp
                        size="lg"
                        onValueChange={value => {
                          field.onChange(value)
                        }}
                        value={field.value.split('')}>
                        <PinInput.HiddenInput />

                        <PinInput.Control>
                          <PinInput.Input index={0} />
                          <PinInput.Input index={1} />
                          <PinInput.Input index={2} />
                          <PinInput.Input index={3} />
                          <PinInput.Input index={4} />
                          <PinInput.Input index={5} />
                        </PinInput.Control>
                      </PinInput.Root>
                    )
                  }}
                />
              </HStack>
            </Center>
          </VStack>

          <Field.ErrorText>{errors.otp && errors.otp.message}</Field.ErrorText>
        </Field.Root>

        {/* `primary` is jaen's own button recipe variant and resolves at
            runtime; the prop union stays at v3's built-ins until `chakra
            typegen` is run against src/theme, so the cast goes then. */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          loading={isSubmitting}
          disabled={otp.length !== 6}>
          Reset password
        </Button>
      </Stack>
    </form>
  )
}

export default StepOTP
