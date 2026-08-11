import {
  Button,
  ButtonGroup,
  HStack,
  Input,
  List,
  Stack,
  Field
} from '@chakra-ui/react'
import {FaCheck} from '@react-icons/all-files/fa/FaCheck'
import {FaX} from '@react-icons/all-files/fa6/FaX'
import React, {useState} from 'react'

export interface PasswordUpdateFormProps {
  passwordPolicy: {
    minLength: number
    hasSymbol: boolean
    hasNumber: boolean
    hasUppercase: boolean
    hasLowercase: boolean
  }
  onPasswordUpdate: (currentPassword: string, password: string) => Promise<void>
}

export const PasswordUpdateForm: React.FC<PasswordUpdateFormProps> = props => {
  const [currentPassword, setCurrentPassword] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [passwordConfirmation, setPasswordConfirmation] = useState<string>('')

  const [isPasswordChanging, setIsPasswordChanging] = useState(false)

  const handlePasswordChange = async () => {
    setIsPasswordChanging(true)
    await props.onPasswordUpdate(currentPassword, password)
    setIsPasswordChanging(false)
  }

  return (
    <Stack gap="6">
      {/* v2's FormLabel rendered standalone; v3's Field.Label throws without
          the Root context, so this control-less caption needs an empty Root.
          It adds no box of its own: width is already 100% and the gap needs a
          second child to show up. */}
      <Field.Root>
        <Field.Label>
          Enter the new password according to the policy below.
        </Field.Label>
      </Field.Root>
      <Field.Root>
        <Field.Label>Current Password</Field.Label>
        <Input
          maxW="md"
          type="password"
          placeholder="New password"
          onChange={e => setCurrentPassword(e.target.value)}
        />
      </Field.Root>

      <List.Root gap={3}>
        {props.passwordPolicy.minLength && (
          <List.Item>
            {password.length >= props.passwordPolicy.minLength ? (
              <List.Indicator color="green.500" asChild>
                <FaCheck />
              </List.Indicator>
            ) : (
              <List.Indicator color="red.500" asChild>
                <FaX />
              </List.Indicator>
            )}
            Has to be at least {props.passwordPolicy.minLength} characters long.
            ({password.length} / {props.passwordPolicy.minLength})
          </List.Item>
        )}
        {props.passwordPolicy.hasSymbol && (
          <List.Item>
            {/[\p{P}\p{S}]/u.test(password) ? (
              <List.Indicator color="green.500" asChild>
                <FaCheck />
              </List.Indicator>
            ) : (
              <List.Indicator color="red.500" asChild>
                <FaX />
              </List.Indicator>
            )}
            Must include a symbol or punctuation mark.
          </List.Item>
        )}

        {props.passwordPolicy.hasNumber && (
          <List.Item>
            {/\d/.test(password) ? (
              <List.Indicator color="green.500" asChild>
                <FaCheck />
              </List.Indicator>
            ) : (
              <List.Indicator color="red.500" asChild>
                <FaX />
              </List.Indicator>
            )}
            Must include a number.
          </List.Item>
        )}

        {props.passwordPolicy.hasUppercase && (
          <List.Item>
            {/[A-Z]/.test(password) ? (
              <List.Indicator color="green.500" asChild>
                <FaCheck />
              </List.Indicator>
            ) : (
              <List.Indicator color="red.500" asChild>
                <FaX />
              </List.Indicator>
            )}
            Must include an uppercase letter.
          </List.Item>
        )}

        {props.passwordPolicy.hasLowercase && (
          <List.Item>
            {/[a-z]/.test(password) ? (
              <List.Indicator color="green.500" asChild>
                <FaCheck />
              </List.Indicator>
            ) : (
              <List.Indicator color="red.500" asChild>
                <FaX />
              </List.Indicator>
            )}
            Must include a lowercase letter.
          </List.Item>
        )}

        <List.Item>
          {password && password === passwordConfirmation ? (
            <List.Indicator color="green.500" asChild>
              <FaCheck />
            </List.Indicator>
          ) : (
            <List.Indicator color="red.500" asChild>
              <FaX />
            </List.Indicator>
          )}
          Passwords match.
        </List.Item>
      </List.Root>

      <HStack>
        <Field.Root>
          <Field.Label>New Password</Field.Label>
          <Input
            type="password"
            placeholder="New password"
            autoComplete="new-password"
            onChange={e => setPassword(e.target.value)}
          />
        </Field.Root>
        <Field.Root>
          <Field.Label>Confirm Password</Field.Label>
          <Input
            type="password"
            placeholder="Confirm password"
            autoComplete="new-password"
            onChange={e => setPasswordConfirmation(e.target.value)}
          />
        </Field.Root>
      </HStack>

      <ButtonGroup>
        <Button
          loading={isPasswordChanging}
          type="submit"
          onClick={handlePasswordChange}>
          Reset Current Password
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            // reset
            setCurrentPassword('')
            setPassword('')
            setPasswordConfirmation('')
          }}>
          Cancel
        </Button>
      </ButtonGroup>
    </Stack>
  )
}
