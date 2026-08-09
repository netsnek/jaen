import React from 'react'
import {
  Button,
  ButtonGroup,
  Heading,
  HStack,
  Icon,
  Stack,
  StackDivider,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr
} from '@chakra-ui/react'
import {FaPlus} from '@react-icons/all-files/fa/FaPlus'
import {FaGripVertical} from '@react-icons/all-files/fa/FaGripVertical'
import {FormattedMessage, useIntl} from 'react-intl'
import {Link} from '../../shared/Link'
import {DangerZone, DangerZoneProps} from './components/DangerZone'
import {TreeNode} from './components/PageVisualizer'
import {PageVisualizer} from './components/PageVisualizer/PageVisualizer'
import {PageBreadcrumb} from './shared/PageBreadcrumb'
import {
  PageContentForm,
  PageContentFormProps
} from './shared/PageContentForm/PageContentForm'
import {
  DragDropContext,
  Draggable,
  Droppable,
  OnDragEndResponder
} from 'react-beautiful-dnd'

export interface PagesProps {
  pageId: string
  form: PageContentFormProps
  children: Array<{
    id: string
    title: string
    description: string
    createdAt: string
    modifiedAt: string
    author?: string
  }>
  onUpdateChildPagesOrder: (newOrder: Array<string>) => void
  tree: Array<TreeNode>
  onTreeSelect?: (id: string) => void
  disableNewButton?: boolean
  dangerZoneActions?: DangerZoneProps['actions']
}

export const Pages: React.FC<PagesProps> = props => {
  const intl = useIntl()
  const [canReorder, setCanReorder] = React.useState(false)

  const handleDragEnd: OnDragEndResponder = result => {
    if (!result.destination) {
      return
    }

    const reorderedChildren = props.children.map(p => p.id)
    const [movedItem] = reorderedChildren.splice(result.source.index, 1)

    if (!movedItem) {
      alert(
        intl.formatMessage({
          id: 'CmsPagesTableReorderError',
          defaultMessage: 'Something went wrong while reordering the pages.'
        })
      )
      return
    }

    reorderedChildren.splice(result.destination.index, 0, movedItem)

    // Update state or dispatch an action to update the order of child pages
    props.onUpdateChildPagesOrder(reorderedChildren)
  }

  return (
    <Stack id="coco" flexDir="column" spacing="14">
      <Stack spacing="4" divider={<StackDivider />}>
        <Stack spacing="4">
          <PageBreadcrumb tree={props.tree} activePageId={props.pageId} />

          <PageContentForm mode="edit" {...props.form} />
        </Stack>

        <PageVisualizer
          tree={props.tree}
          selection={props.pageId}
          onSelect={props.onTreeSelect}
        />
      </Stack>

      <Stack spacing="4" divider={<StackDivider />}>
        <HStack justifyContent="space-between">
          <Heading as="h2" size="sm">
            <FormattedMessage
              id="CmsPagesTableSubpagesHeading"
              defaultMessage="Subpages"
            />
          </Heading>

          <ButtonGroup>
            <Button
              onClick={() => setCanReorder(!canReorder)}
              variant="outline"
              leftIcon={
                canReorder ? (
                  <Icon as={FaGripVertical} transform="rotate(45deg)" />
                ) : (
                  <Icon as={FaGripVertical} />
                )
              }>
              {canReorder
                ? intl.formatMessage({
                    id: 'CmsPagesTableReorderDisable',
                    defaultMessage: 'Done'
                  })
                : intl.formatMessage({
                    id: 'CmsPagesTableReorderEnable',
                    defaultMessage: 'Reorder'
                  })}
            </Button>

            <Link
              isDisabled={props.disableNewButton}
              as={Button}
              to={`./new/#${btoa(props.pageId)}`}
              leftIcon={<FaPlus />}
              variant="outline">
              <FormattedMessage
                id="CmsPagesTableNewPage"
                defaultMessage="New page"
              />
            </Link>
          </ButtonGroup>
        </HStack>

        <Table>
          <Thead>
            <Tr>
              <Th>
                <FormattedMessage
                  id="CmsPagesTableColumnsTitle"
                  defaultMessage="Title"
                />
              </Th>
              <Th>
                <FormattedMessage
                  id="CmsPagesTableColumnsDescription"
                  defaultMessage="Description"
                />
              </Th>
              <Th>
                <FormattedMessage
                  id="CmsPagesTableColumnsDate"
                  defaultMessage="Date"
                />
              </Th>
              <Th></Th>
            </Tr>
          </Thead>
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="child-pages">
              {provided => (
                <Tbody ref={provided.innerRef} {...provided.droppableProps}>
                  {props.children.map((page, index) => (
                    <Draggable
                      isDragDisabled={
                        !canReorder || props.children.length === 1
                      }
                      key={page.id}
                      draggableId={page.id}
                      index={index}>
                      {(provided, snapshot) => (
                        <Tr
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          bg={snapshot.isDragging ? 'bg.subtle' : 'transparent'}
                          display={snapshot.isDragging ? 'table' : 'table-row'}>
                          <Td>
                            <Link to={`#${btoa(page.id)}`}>{page.title}</Link>
                          </Td>
                          <Td>{page.description}</Td>
                          <Td whiteSpace="break-spaces">
                            {page.createdAt || page.modifiedAt
                              ? page.modifiedAt &&
                                page.modifiedAt !== page.createdAt
                                ? intl.formatMessage(
                                    {
                                      id: 'CmsPagesTableDateUpdated',
                                      defaultMessage:
                                        'Last modified {date} at {time}'
                                    },
                                    {
                                      date: intl.formatDate(page.modifiedAt, {
                                        dateStyle: 'medium'
                                      }),
                                      time: intl.formatTime(page.modifiedAt, {
                                        hour: '2-digit',
                                        minute: '2-digit'
                                      })
                                    }
                                  )
                                : intl.formatMessage(
                                    {
                                      id: 'CmsPagesTableDateCreated',
                                      defaultMessage: 'Created {date} at {time}'
                                    },
                                    {
                                      date: intl.formatDate(page.createdAt, {
                                        dateStyle: 'medium'
                                      }),
                                      time: intl.formatTime(page.createdAt, {
                                        hour: '2-digit',
                                        minute: '2-digit'
                                      })
                                    }
                                  )
                              : intl.formatMessage({
                                  id: 'CmsPagesTableDateEmpty',
                                  defaultMessage: '-'
                                })}
                          </Td>
                          <Td w="8">
                            {canReorder && (
                              <Icon as={FaGripVertical} color="fg.subtle" />
                            )}
                          </Td>
                        </Tr>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}

                  {props.children.length === 0 && (
                    <Tr>
                      <Td colSpan={4}>
                        <HStack>
                          <Text>
                            <FormattedMessage
                              id="CmsPagesTableEmptyStateDescription"
                              defaultMessage="This page doesn't have any subpages yet."
                            />{' '}
                          </Text>
                          <Link to={`./new/#${btoa(props.pageId)}`}>
                            <FormattedMessage
                              id="CmsPagesTableEmptyStateAction"
                              defaultMessage="Create a new page"
                            />
                          </Link>
                        </HStack>
                      </Td>
                    </Tr>
                  )}
                </Tbody>
              )}
            </Droppable>
          </DragDropContext>
        </Table>
      </Stack>

      <Stack spacing="4" divider={<StackDivider />}>
        <Heading as="h2" size="sm">
          <FormattedMessage
            id="CmsPagesTableDangerZoneHeading"
            defaultMessage="Danger zone"
          />
        </Heading>

        <DangerZone actions={props.dangerZoneActions || []} />
      </Stack>
    </Stack>
  )
}
