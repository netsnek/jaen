/*
 MIGRATION NOTE: The following Chakra UI hooks have been removed.
 Please replace them with the suggested alternatives:

//   - useMergeRefs: Use react-use: useMergeRefs

 See: https://chakra-ui.com/docs/get-started/migration#hooks
*/
import {
  IconButton,
  Input,
  InputGroup,
  InputProps,
  InputRightElement,
  useDisclosure,
  Field
} from '@chakra-ui/react'
import {forwardRef, useRef} from 'react'
import {FaEye} from '@react-icons/all-files/fa/FaEye'
import {FaEyeSlash} from '@react-icons/all-files/fa/FaEyeSlash'

export const PasswordField = forwardRef<HTMLInputElement, InputProps>(
  ({isInvalid, isRequired, ...props}, ref) => {
    const {open, onToggle} = useDisclosure()
    const inputRef = useRef<HTMLInputElement>(null)

    const mergeRef = useMergeRefs(inputRef, ref)
    const onClickReveal = () => {
      onToggle()
      if (inputRef.current) {
        inputRef.current.focus({preventScroll: true})
      }
    }

    return (
      <Field.Root
        id="login_form_password"
        invalid={isInvalid}
        required={isRequired}>
        <Field.Label htmlFor="password">Password</Field.Label>
        <InputGroup>
          <Input
            id="password"
            ref={mergeRef}
            name="password"
            type={isOpen ? 'text' : 'password'}
            autoComplete="current-password"
            required
            {...props}
          />
          <InputRightElement>
            <IconButton
              variant="text"
              color="brand.500"
              aria-label={isOpen ? 'Mask password' : 'Reveal password'}
              onClick={onClickReveal}>
              {isOpen ? <FaEyeSlash /> : <FaEye />}
            </IconButton>
          </InputRightElement>
        </InputGroup>
        <Field.ErrorText>
          {props.name === 'password' && 'Password is required'}
        </Field.ErrorText>
      </Field.Root>
    )
  }
)

PasswordField.displayName = 'PasswordField'
