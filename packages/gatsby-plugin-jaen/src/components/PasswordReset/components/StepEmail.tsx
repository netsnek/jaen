import React from 'react'
import {useForm} from 'react-hook-form'
import {Input, Button, ButtonProps, Stack, Field} from '@chakra-ui/react'

interface FormData {
  emailAddress: string
}

export interface StepEmailProps {
  onSubmit: (data: FormData) => Promise<void>
}

const StepEmail: React.FC<StepEmailProps> = props => {
  const {
    handleSubmit,
    register,
    formState: {isSubmitting, errors}
  } = useForm<FormData>()

  const onSubmit = async (data: FormData) => {
    await props.onSubmit(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack gap="5">
        <Field.Root id="emailAddress" required invalid={!!errors.emailAddress}>
          <Field.Label>
            Enter your user account's verified email address and we will send
            initiate the password reset process.
          </Field.Label>
          <Input
            autoFocus
            {...register('emailAddress', {
              required: true
            })}
            type="email"
            placeholder="Enter your email address"
          />
          <Field.ErrorText>
            {errors.emailAddress && errors.emailAddress.message}
          </Field.ErrorText>
        </Field.Root>
        {/* `primary` is jaen's own button recipe variant and resolves at
            runtime; the prop union stays at v3's built-ins until `chakra
            typegen` is run against src/theme, so the cast goes then. */}
        <Button
          type="submit"
          variant={'primary' as ButtonProps['variant']}
          size="lg"
          loading={isSubmitting}>
          Continue
        </Button>
      </Stack>
    </form>
  )
}

export default StepEmail
