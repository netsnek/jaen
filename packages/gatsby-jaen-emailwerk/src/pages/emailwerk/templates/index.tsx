import {PageConfig, useNotificationsContext} from 'jaen'
import {
  Badge,
  Button,
  HStack,
  Heading,
  Icon,
  Link,
  Skeleton,
  Stack,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr
} from '@chakra-ui/react'
import {FaPlus} from '@react-icons/all-files/fa/FaPlus'
import {Link as GatsbyLink, graphql} from 'gatsby'
import {useEffect} from 'react'
import {SenderTransport, resolve, useQuery} from '../../../client/index'
import {SenderModal} from '../../../SenderModal'

const SkeletonRow = () => (
  <Table.Row>
    {[...Array(6)].map((_, index) => (
      <Table.Cell key={index}>
        <Skeleton height="6" />
      </Table.Cell>
    ))}
  </Table.Row>
)

const Page: React.FC = () => {
  const {prompt, toast} = useNotificationsContext()

  const data = useQuery({})

  useEffect(() => {
    data.$refetch()
  }, [])

  useEffect(() => {
    if (data.$state.error) {
      toast({
        title: `Failed to load templates (${data.$state.error.name})`,
        description: data.$state.error.message,
        status: 'error'
      })
    }
  }, [data.$state.error])

  // The org's senders replace mailpress' single "connected email"
  // (me.organization.email); the default sender is what emailwerk uses when a
  // template has no explicit senderId.
  const senders = data.senders.map(sender => ({
    id: sender.id,
    address: sender.address,
    displayName: sender.displayName,
    transport: sender.transport,
    isDefault: sender.isDefault,
    enabled: sender.enabled
  }))

  const defaultSender = senders.find(sender => sender.isDefault)

  const handleAddTemplateClick = async () => {
    const description = await prompt({
      title: 'Add Template',
      message: 'Please enter a description for the new template'
    })

    if (description) {
      try {
        await resolve(
          ({mutation}) => {
            const template = mutation.templateCreate({
              args: {
                description: description,
                content: 'Hello!',
                variables: [],
                envelope: {
                  subject: 'Hello!'
                }
              }
            })

            return template.id
          },
          {
            cachePolicy: 'no-store'
          }
        )

        await data.$refetch(true)
      } catch (error) {
        toast({
          title: 'Failed to create template',
          description: error.message,
          status: 'error'
        })
      }
    }
  }

  return (
    <>
      <Stack gap="4">
        <Heading size="md">Email Templates</Heading>

        <HStack gap="4" justifyContent="space-between">
          <HStack>
            {defaultSender?.address ? (
              <Text>
                Default sender: <strong>{defaultSender.address}</strong>{' '}
                <Badge colorPalette={defaultSender.enabled ? 'green' : 'red'}>
                  {defaultSender.transport}
                </Badge>
              </Text>
            ) : (
              <Text color="yellow.500">No sender configured</Text>
            )}
          </HStack>
          <HStack>
            <SenderModal
              senders={senders}
              onCreate={async input => {
                await resolve(
                  ({mutation}) => {
                    return mutation.senderCreate({
                      args: {
                        address: input.address,
                        displayName: input.displayName || undefined,
                        transport: SenderTransport.SMTP,
                        isDefault: input.isDefault,
                        smtp: input.smtp
                      }
                    }).id
                  },
                  {cachePolicy: 'no-store'}
                )

                await data.$refetch(true)
              }}
              onSetDefault={async id => {
                await resolve(
                  ({mutation}) => mutation.senderSetDefault({args: {id}})?.id,
                  {cachePolicy: 'no-store'}
                )

                await data.$refetch(true)
              }}
              onVerify={async id => {
                const result = await resolve(
                  ({mutation}) => {
                    const verify = mutation.senderVerify({args: {id}})

                    return {ok: verify.ok, error: verify.error}
                  },
                  {cachePolicy: 'no-store'}
                )

                toast({
                  title: result.ok ? 'Sender verified' : 'Verification failed',
                  description: result.error ?? undefined,
                  status: result.ok ? 'success' : 'error'
                })
              }}
              onDelete={async id => {
                await resolve(
                  ({mutation}) => mutation.senderDelete({args: {id}}).ok,
                  {cachePolicy: 'no-store'}
                )

                await data.$refetch(true)
              }}
            />
            <Button onClick={handleAddTemplateClick}>
              <Icon asChild>
                <FaPlus />
              </Icon>
              Add Template
            </Button>
          </HStack>
        </HStack>

        <Table.Root>
          <Table.Header
            position="sticky"
            top={0}
            zIndex={1}
            borderColor="black">
            <Table.Row my=".8rem">
              <Table.ColumnHeader>Description</Table.ColumnHeader>
              <Table.ColumnHeader>Subject</Table.ColumnHeader>
              <Table.ColumnHeader>To</Table.ColumnHeader>
              <Table.ColumnHeader>Reply-To</Table.ColumnHeader>
              <Table.ColumnHeader>Updated at</Table.ColumnHeader>
              <Table.ColumnHeader>Created at</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {data.$state.isLoading && (
              <>
                <SkeletonRow />
                <SkeletonRow />
                <SkeletonRow />
              </>
            )}

            {data.templates().nodes.map(template => {
              return (
                <Table.Row
                  key={template.id}
                  visibility={data.$state.isLoading ? 'hidden' : 'visible'}>
                  <Table.Cell>
                    <Link asChild>
                      <GatsbyLink to={`./${template.id}`}>
                        {template.description}
                      </GatsbyLink>
                    </Link>
                  </Table.Cell>
                  <Table.Cell>{template.envelope?.subject}</Table.Cell>
                  <Table.Cell>{template.envelope?.to?.join(', ')}</Table.Cell>
                  <Table.Cell>{template.envelope?.replyTo}</Table.Cell>
                  <Table.Cell>{template.updatedAt}</Table.Cell>
                  <Table.Cell>{template.createdAt}</Table.Cell>
                </Table.Row>
              )
            })}

            {data.templates().totalCount === 0 && (
              <Table.Row
                visibility={data.$state.isLoading ? 'hidden' : 'visible'}>
                <Table.Cell colSpan={6}>No templates found</Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table.Root>
      </Stack>
    </>
  )
}

export default Page

export const pageConfig: PageConfig = {
  label: 'Templates',
  icon: 'FaEnvelope',
  menu: {
    type: 'app',
    group: 'emailwerk',
    groupLabel: 'Emailwerk',
    order: 500
  },
  layout: {
    name: 'jaen'
  },
  breadcrumbs: [
    {
      label: 'Emailwerk',
      path: '/emailwerk/'
    },
    {
      label: 'Templates',
      path: '/emailwerk/templates/'
    }
  ],
  auth: {
    isRequired: true,
    isAdminRequired: true
  }
}

export const query = graphql`
  query ($jaenPageId: String!) {
    ...JaenPageQuery
    allJaenPage {
      nodes {
        ...JaenPageData
        children {
          ...JaenPageData
        }
      }
    }
  }
`

export {Head} from 'jaen'
