import {Alert, Button} from '@chakra-ui/react'
import React from 'react'

export const ErrorFallback: React.FC<{
  error: Error
  resetErrorBoundary: () => void
}> = ({error, resetErrorBoundary}) => {
  return (
    <Alert.Root status="error">
      <Alert.Indicator />
      <Alert.Title>Something went wrong</Alert.Title>
      <Alert.Description>
        <pre>{error.message}</pre>

        <Button onClick={resetErrorBoundary}>Try again</Button>
      </Alert.Description>
    </Alert.Root>
  )
}
