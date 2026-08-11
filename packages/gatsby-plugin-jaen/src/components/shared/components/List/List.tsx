import {Card, Stack, StackProps, Text} from '@chakra-ui/react'
import * as React from 'react'

import type {ListItemProps} from './ListItem'

export interface ListProps extends StackProps {
  label?: string
}

export const List: React.FC<ListProps> = props => {
  const {children, label, ...stackProps} = props
  const items = React.useMemo(
    () =>
      React.Children.toArray(children)
        .filter<React.ReactElement<ListItemProps>>(React.isValidElement)
        .map((item, index, array) =>
          index + 1 === array.length
            ? React.cloneElement(item, {isLastItem: true})
            : item
        ),
    [children]
  )
  return (
    <Card.Root variant="outline">
      <Card.Header>
        {label && (
          <Text lineClamp={1} pb="1">
            {label}
          </Text>
        )}
      </Card.Header>
      <Card.Body>
        <Stack as="ul" {...stackProps}>
          {items}
        </Stack>
      </Card.Body>
    </Card.Root>
  )
}
