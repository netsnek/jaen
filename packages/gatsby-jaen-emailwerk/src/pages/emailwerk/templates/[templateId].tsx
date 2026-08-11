import {PageConfig, PageProps, useNotificationsContext} from 'jaen'
import {useEffect, useMemo, useState} from 'react'

import {CopyIcon, DeleteIcon} from '../../../icons'
import {
  Box,
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Checkbox,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  IconButton,
  Input,
  InputGroup,
  InputLeftAddon,
  InputRightElement,
  Link,
  ListItem,
  Select,
  Skeleton,
  Stack,
  Table,
  Tbody,
  Td,
  Text,
  Textarea,
  Th,
  Thead,
  Tr,
  UnorderedList
} from '@chakra-ui/react'
import {Editor} from '@monaco-editor/react'
import {Link as GatsbyLink, navigate} from 'gatsby'
import {sanitize} from 'isomorphic-dompurify'
import {Controller, useFieldArray, useForm} from 'react-hook-form'
import {
  EngineKind,
  TemplateEngine,
  VariableType,
  resolve
} from '../../../client'

const Page: React.FC<PageProps> = ({params}) => {
  const templateId = params.templateId

  if (!templateId) {
    throw new Error('Template ID is required')
  }

  const {toast, confirm} = useNotificationsContext()

  const {
    register,
    handleSubmit,
    reset,
    watch,
    getValues,
    control,
    formState: {errors, isSubmitting, isDirty}
  } = useForm<{
    id: string
    parentId?: string
    description: string
    verifyReplyTo?: boolean
    content: string
    engine: string
    updatedAt: string
    createdAt: string
    envelope: {
      subject?: string
      to?: {
        email: string
      }[]
      replyTo?: string
    }
    variables: {
      id?: string
      name: string
      type?: string
      isRequired?: boolean
      isConstant?: boolean
      description?: string
      defaultValue?: string
    }[]
  }>({
    defaultValues: {
      id: '',
      description: '',
      content: '',
      engine: TemplateEngine.LIQUID,
      updatedAt: '',
      createdAt: '',
      envelope: {
        subject: '',
        to: [],
        replyTo: ''
      }
    }
  })

  const variablesField = useFieldArray({
    control,
    name: 'variables'
  })

  const envelopeToField = useFieldArray({
    control,
    name: 'envelope.to'
  })

  const unsafeContent = watch('content')

  const templateContent = useMemo(() => {
    return sanitize(unsafeContent || '')
  }, [unsafeContent])

  const [template, setTemplate] = useState<
    | {
        id: string
        description: string
        content: string
        engine: string
        verifyReplyTo?: boolean
        envelope?: {
          subject?: string
          to?: {
            email: string
          }[]
          replyTo?: string
        }
        variables: {
          id?: string
          name: string
          type?: string
          isRequired?: boolean
          isConstant?: boolean
          description?: string
          defaultValue?: string
        }[]
        parentId?: string
        updatedAt: string
        createdAt: string
      }
    | undefined
  >(undefined)

  const [parentTemplates, setParentTemplates] = useState<
    {
      id: string
      description: string
      parentId?: string
    }[]
  >([])

  const [serverPreview, setServerPreview] = useState<string | null>(null)

  const [state, setState] = useState<{isLoading: boolean; error?: Error}>({
    isLoading: true
  })

  // TemplateView has no `links`/`parent` object fields anymore (only
  // `parentId`), so linked templates are derived from the template list:
  // every template whose parentId points at this one.
  const linkedTemplates = useMemo(
    () => parentTemplates.filter(t => t.parentId === templateId),
    [parentTemplates, templateId]
  )

  const fetchData = async () => {
    setState({isLoading: true})

    try {
      const {template, parentTemplates} = await resolve(({query}) => {
        const template = query.template({args: {id: templateId}})!

        const parentTemplates = query
          .templates()
          .nodes.map(t => ({
            id: t.id,
            description: t.description,
            parentId: t.parentId || undefined
          }))
          .filter(t => t.id !== templateId)

        return {
          template: {
            id: template.id,
            description: template.description,
            content: template.content,
            engine: template.engine,
            verifyReplyTo: template.verifyReplyTo || undefined,
            envelope: {
              subject: template.envelope?.subject || undefined,
              to: template.envelope?.to?.map(to => ({email: to})) || undefined,
              replyTo: template.envelope?.replyTo || undefined
            },
            variables: template.variables.map(v => ({
              id: v.id,
              name: v.name,
              type: v.type,
              isRequired: v.isRequired || undefined,
              isConstant: v.isConstant || undefined,
              description: v.description || undefined,
              defaultValue: v.defaultValue || undefined
            })),
            parentId: template.parentId || undefined,
            updatedAt: template.updatedAt,
            createdAt: template.createdAt
          },
          parentTemplates
        }
      })

      setTemplate(template)
      setParentTemplates(parentTemplates)

      setState({isLoading: false})
    } catch (e) {
      setState({isLoading: false, error: e})
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    if (state.error) {
      toast({
        title: `Failed to load template (${state.error.name})`,
        description: state.error.message,
        status: 'error'
      })
    }
  }, [state.error])

  useEffect(() => {
    reset(template)
  }, [JSON.stringify(template)])

  const onSubmit = handleSubmit(async input => {
    try {
      await resolve(({mutation}) => {
        return mutation.templateUpdate({
          args: {
            id: templateId,
            description: input.description,
            parentId: input.parentId || null,
            verifyReplyTo: input.verifyReplyTo ?? undefined,
            content: input.content,
            engine: (input.engine as TemplateEngine) || undefined,
            envelope: {
              subject: input.envelope.subject || undefined,
              to: input.envelope.to?.map(to => to.email) || undefined,
              replyTo: input.envelope.replyTo || undefined
            },
            variables: input.variables.map(v => ({
              name: v.name,
              type: (v.type as VariableType) || VariableType.STRING,
              isRequired: v.isRequired ?? false,
              isConstant: v.isConstant ?? false,
              description: v.description || undefined,
              defaultValue: v.defaultValue || undefined
            }))
          }
        })?.id
      })

      toast({
        title: 'Template Updated!',
        description: `Template ID ${templateId} updated`,
        status: 'success'
      })

      await fetchData()
    } catch (e) {
      toast({
        title: 'Error!',
        description: `Error updating template ${templateId}`,
        status: 'error'
      })
    }
  })

  const handleDeleteClick = async () => {
    const confirmed = await confirm({
      title: 'Delete Template',
      message: `Are you sure you want to delete this template?`,
      confirmText: 'Delete',
      cancelText: 'Cancel'
    })
    if (confirmed) {
      try {
        await resolve(({mutation}) => {
          return mutation.templateDelete({
            args: {
              id: templateId
            }
          }).ok
        })

        toast({
          title: 'Template Deleted!',
          description: `Template ID ${templateId} deleted`,
          status: 'success'
        })

        navigate('..')
      } catch (e) {
        toast({
          title: 'Error!',
          description: `Error deleting template ${templateId}`,
          status: 'error'
        })
      }
    }
  }

  // Server-side render preview through emailwerk's stateless
  // `templatePreview` (real engine output, unlike the sanitized raw
  // content below).
  const handleServerPreviewClick = async () => {
    try {
      const values = getValues()

      const preview = await resolve(
        ({mutation}) => {
          const result = mutation.templatePreview({
            args: {
              content: values.content || '',
              engine: (values.engine as EngineKind) || undefined,
              variables: (values.variables || []).map(v => ({
                name: v.name,
                type: (v.type as VariableType) || VariableType.STRING,
                defaultValue: v.defaultValue || undefined,
                isRequired: v.isRequired ?? false,
                isConstant: v.isConstant ?? false
              }))
            }
          })

          return result.html
        },
        {cachePolicy: 'no-store'}
      )

      setServerPreview(sanitize(preview))
    } catch (e) {
      toast({
        title: 'Error!',
        description: 'Error rendering the server preview',
        status: 'error'
      })
    }
  }

  const onCopy = () => {
    const value = templateId

    navigator.clipboard.writeText(value)

    toast({
      title: 'Copied!',
      description: `Template ID ${value} copied to clipboard`,
      status: 'success'
    })
  }

  return (
    <Stack spacing="4">
      <Heading size="md">Email Template</Heading>

      <Skeleton isLoaded={!state.isLoading}>
        <InputGroup>
          <InputLeftAddon>Template ID</InputLeftAddon>
          <Input type="text" defaultValue={templateId} isDisabled />
          <InputRightElement
            as={IconButton}
            icon={<CopyIcon />}
            variant="outline"
            onClick={onCopy}></InputRightElement>
        </InputGroup>
      </Skeleton>

      <form onSubmit={onSubmit}>
        <Stack spacing="8">
          <Stack spacing="4">
            <Skeleton isLoaded={!state.isLoading}>
              <FormControl
                id="description"
                isRequired
                isInvalid={!!errors.description}>
                <FormLabel>Description</FormLabel>
                <Input type="text" {...register('description')} />
                <FormErrorMessage>
                  {errors.description?.message}
                </FormErrorMessage>
              </FormControl>
            </Skeleton>

            <Skeleton isLoaded={!state.isLoading}>
              <FormControl id="parent">
                <FormLabel>Parent</FormLabel>
                <Select {...register('parentId')} placeholder="Kein Template">
                  {parentTemplates.map(t => (
                    <option key={t.id} value={t.id}>
                      {t.description} ({t.id})
                    </option>
                  ))}
                </Select>
              </FormControl>
            </Skeleton>

            <Skeleton isLoaded={!state.isLoading}>
              <FormControl id="engine">
                <FormLabel>Engine</FormLabel>
                <Select {...register('engine')}>
                  {Object.values(TemplateEngine).map(engine => (
                    <option key={engine} value={engine}>
                      {engine}
                    </option>
                  ))}
                </Select>
              </FormControl>
            </Skeleton>

            <Skeleton isLoaded={!state.isLoading}>
              <FormControl id="verifyReplyTo">
                <FormLabel>Verify Reply To</FormLabel>
                <Checkbox {...register('verifyReplyTo')} />
              </FormControl>
            </Skeleton>

            <Skeleton isLoaded={!state.isLoading}>
              <FormControl id="linked">
                <FormLabel>Linked</FormLabel>
                {linkedTemplates.length ? (
                  <UnorderedList>
                    {linkedTemplates.map(t => (
                      <ListItem key={t.id}>
                        <Link as={GatsbyLink} to={`../${t.id}`}>
                          {t.description} ({t.id})
                        </Link>
                      </ListItem>
                    ))}
                  </UnorderedList>
                ) : (
                  <Text>No linked templates</Text>
                )}
              </FormControl>
            </Skeleton>

            <Card>
              <CardHeader>
                <Heading size="sm">Envelope</Heading>
              </CardHeader>
              <CardBody>
                <Stack spacing={4}>
                  <FormControl id="subject">
                    <FormLabel htmlFor="subject">Subject</FormLabel>
                    <Input
                      type="text"
                      id="subject"
                      {...register('envelope.subject')}
                    />
                  </FormControl>

                  <Card>
                    <CardHeader>To</CardHeader>
                    <CardBody>
                      <Stack>
                        {envelopeToField.fields.map((_, index) => (
                          <FormControl key={index} id={`envelope.to.${index}`}>
                            <InputGroup>
                              <Input
                                type="text"
                                placeholder="Enter email address"
                                {...register(`envelope.to.${index}.email`)}
                              />
                              <InputRightElement>
                                <IconButton
                                  aria-label="delete to field"
                                  icon={<DeleteIcon />}
                                  onClick={() => envelopeToField.remove(index)}
                                  variant="ghost"
                                />
                              </InputRightElement>
                            </InputGroup>
                          </FormControl>
                        ))}
                      </Stack>
                    </CardBody>
                    <CardFooter>
                      <Button
                        onClick={() => envelopeToField.append({email: ''})}>
                        Add To
                      </Button>
                    </CardFooter>
                  </Card>

                  <FormControl id="replyTo">
                    <FormLabel htmlFor="replyTo">Reply To</FormLabel>
                    <Input
                      type="text"
                      id="replyTo"
                      placeholder="Enter email address"
                      {...register('envelope.replyTo')}
                    />
                  </FormControl>
                </Stack>
              </CardBody>
            </Card>

            <Card>
              <CardHeader>
                <Heading size="sm">Content</Heading>
              </CardHeader>
              <CardBody>
                <Stack>
                  <Stack>
                    <Skeleton isLoaded={!state.isLoading}>
                      <FormControl id="content">
                        <Controller
                          control={control}
                          name="content"
                          render={({field}) => (
                            <Editor
                              theme={'vs-dark'}
                              height="var(--chakra-sizes-md)"
                              defaultLanguage="html"
                              defaultValue={field.value || undefined}
                              onChange={(value, _) => field.onChange(value)}
                            />
                          )}
                        />
                      </FormControl>
                    </Skeleton>
                  </Stack>

                  <Stack>
                    <Heading size="sm">Preview</Heading>
                    <Skeleton isLoaded={!state.isLoading}>
                      <Box
                        dangerouslySetInnerHTML={{__html: templateContent}}
                      />
                    </Skeleton>
                  </Stack>

                  <Stack>
                    <Heading size="sm">Rendered Preview</Heading>
                    <Button
                      alignSelf="start"
                      variant="outline"
                      onClick={handleServerPreviewClick}>
                      Render Preview
                    </Button>
                    {serverPreview !== null && (
                      <Box dangerouslySetInnerHTML={{__html: serverPreview}} />
                    )}
                  </Stack>
                </Stack>
              </CardBody>
            </Card>

            <Card>
              <CardHeader>
                <Heading size="sm">Variables</Heading>
              </CardHeader>
              <CardBody>
                <Stack spacing={4}>
                  <Table variant="striped" colorScheme="gray">
                    <Thead>
                      <Tr>
                        <Th>Name</Th>
                        <Th>Type</Th>
                        <Th>Description</Th>
                        <Th>Default Value</Th>
                        <Th>Required</Th>
                        <Th>Constant</Th>
                        <Th></Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {variablesField.fields.map((field, index) => (
                        <Tr key={index}>
                          <Td>
                            <Input
                              type="text"
                              defaultValue={field.name}
                              {...register(`variables.${index}.name`)}
                            />
                          </Td>
                          <Td>
                            <Select {...register(`variables.${index}.type`)}>
                              {Object.values(VariableType).map(type => (
                                <option key={type} value={type}>
                                  {type}
                                </option>
                              ))}
                            </Select>
                          </Td>
                          <Td>
                            <Textarea
                              minH="10"
                              {...register(`variables.${index}.description`)}
                            />
                          </Td>
                          <Td>
                            <Input
                              type="text"
                              {...register(`variables.${index}.defaultValue`)}
                            />
                          </Td>
                          <Td>
                            <Checkbox
                              {...register(`variables.${index}.isRequired`)}
                            />
                          </Td>
                          <Td>
                            <Checkbox
                              {...register(`variables.${index}.isConstant`)}
                            />
                          </Td>
                          <Td>
                            <Button
                              colorScheme="red"
                              onClick={() => variablesField.remove(index)}>
                              Remove
                            </Button>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>

                  <Button
                    onClick={() =>
                      variablesField.append({
                        name: 'NEW_VARIABLE',
                        type: VariableType.STRING
                      })
                    }>
                    Add Variable
                  </Button>
                </Stack>
              </CardBody>
            </Card>
          </Stack>

          <ButtonGroup justifyContent="end" isDisabled={state.isLoading}>
            <Button
              type="button"
              variant="outline"
              colorScheme="red"
              isDisabled={state.isLoading || isSubmitting}
              onClick={handleDeleteClick}>
              Delete
            </Button>

            <Button
              type="button"
              variant="outline"
              isDisabled={state.isLoading || isSubmitting || !isDirty}
              onClick={async () => {
                await fetchData()
              }}>
              Cancel
            </Button>

            <Button
              type="submit"
              isLoading={state.isLoading || isSubmitting}
              isDisabled={state.isLoading || isSubmitting}>
              Save
            </Button>
          </ButtonGroup>
        </Stack>
      </form>
    </Stack>
  )
}

export const pageConfig: PageConfig = {
  label: 'Templates',
  icon: 'FaEnvelope',
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

export default Page
