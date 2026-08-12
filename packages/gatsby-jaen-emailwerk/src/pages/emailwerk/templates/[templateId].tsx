import {PageConfig, PageProps, useNotificationsContext} from 'jaen'
import {useEffect, useMemo, useState} from 'react'

import {CopyIcon, DeleteIcon} from '../../../icons'
import {
  Box,
  Button,
  ButtonGroup,
  Card,
  Checkbox,
  Heading,
  IconButton,
  Input,
  InputGroup,
  Link,
  NativeSelect,
  Skeleton,
  Stack,
  Table,
  Text,
  Textarea,
  Field,
  List
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
    <Stack gap="4">
      <Heading size="md">Email Template</Heading>

      <Skeleton loading={!!state.isLoading}>
        <InputGroup
          startAddon="Template ID"
          // v2's InputRightElement was exactly one input-height wide with no
          // padding, and `as={IconButton}` made the button that box. v3's
          // InputElement adds px="3", which would push the button off the
          // right border and past the `pe` the group reserves on the input.
          endElementProps={{px: '0'}}
          endElement={
            <IconButton
              aria-label="copy template id"
              onClick={onCopy}
              variant="outline">
              <CopyIcon />
            </IconButton>
          }>
          <Input type="text" defaultValue={templateId} disabled />
        </InputGroup>
      </Skeleton>

      <form onSubmit={onSubmit}>
        <Stack gap="8">
          <Stack gap="4">
            <Skeleton loading={!!state.isLoading}>
              <Field.Root
                id="description"
                required
                invalid={!!errors.description}>
                <Field.Label>Description</Field.Label>
                <Input type="text" {...register('description')} />
                <Field.ErrorText>{errors.description?.message}</Field.ErrorText>
              </Field.Root>
            </Skeleton>

            <Skeleton loading={!!state.isLoading}>
              <Field.Root id="parent">
                <Field.Label>Parent</Field.Label>
                <NativeSelect.Root>
                  <NativeSelect.Field
                    {...register('parentId')}
                    placeholder="Kein Template">
                    {parentTemplates.map(t => (
                      <option key={t.id} value={t.id}>
                        {t.description} ({t.id})
                      </option>
                    ))}
                  </NativeSelect.Field>
                  <NativeSelect.Indicator />
                </NativeSelect.Root>
              </Field.Root>
            </Skeleton>

            <Skeleton loading={!!state.isLoading}>
              <Field.Root id="engine">
                <Field.Label>Engine</Field.Label>
                <NativeSelect.Root>
                  <NativeSelect.Field {...register('engine')}>
                    {Object.values(TemplateEngine).map(engine => (
                      <option key={engine} value={engine}>
                        {engine}
                      </option>
                    ))}
                  </NativeSelect.Field>
                  <NativeSelect.Indicator />
                </NativeSelect.Root>
              </Field.Root>
            </Skeleton>

            <Skeleton loading={!!state.isLoading}>
              <Field.Root id="verifyReplyTo">
                <Field.Label>Verify Reply To</Field.Label>
                {/* v3's Checkbox.Root is the label, so register's ref lands on
                    it instead of the input and the box no longer follows the
                    reset() that fetchData does. The form value has to drive it
                    for a loaded template to show its state, as it did in v2. */}
                <Checkbox.Root
                  {...register('verifyReplyTo')}
                  checked={watch('verifyReplyTo')}>
                  <Checkbox.HiddenInput />
                  <Checkbox.Control>
                    <Checkbox.Indicator />
                  </Checkbox.Control>
                </Checkbox.Root>
              </Field.Root>
            </Skeleton>

            <Skeleton loading={!!state.isLoading}>
              <Field.Root id="linked">
                <Field.Label>Linked</Field.Label>
                {linkedTemplates.length ? (
                  <List.Root as="ul">
                    {linkedTemplates.map(t => (
                      <List.Item key={t.id}>
                        <Link asChild>
                          <GatsbyLink to={`../${t.id}`}>
                            {t.description} ({t.id})
                          </GatsbyLink>
                        </Link>
                      </List.Item>
                    ))}
                  </List.Root>
                ) : (
                  <Text>No linked templates</Text>
                )}
              </Field.Root>
            </Skeleton>

            <Card.Root>
              <Card.Header>
                <Heading size="sm">Envelope</Heading>
              </Card.Header>
              <Card.Body>
                <Stack gap={4}>
                  <Field.Root id="subject">
                    <Field.Label htmlFor="subject">Subject</Field.Label>
                    <Input
                      type="text"
                      id="subject"
                      {...register('envelope.subject')}
                    />
                  </Field.Root>

                  <Card.Root>
                    <Card.Header>To</Card.Header>
                    <Card.Body>
                      <Stack>
                        {envelopeToField.fields.map((_, index) => (
                          <Field.Root key={index} id={`envelope.to.${index}`}>
                            <InputGroup
                              // Same as the Template ID field above.
                              endElementProps={{px: '0'}}
                              endElement={
                                <IconButton
                                  aria-label="delete to field"
                                  onClick={() => envelopeToField.remove(index)}
                                  variant="ghost">
                                  <DeleteIcon />
                                </IconButton>
                              }>
                              <Input
                                type="text"
                                placeholder="Enter email address"
                                {...register(`envelope.to.${index}.email`)}
                              />
                            </InputGroup>
                          </Field.Root>
                        ))}
                      </Stack>
                    </Card.Body>
                    <Card.Footer>
                      <Button
                        onClick={() => envelopeToField.append({email: ''})}>
                        Add To
                      </Button>
                    </Card.Footer>
                  </Card.Root>

                  <Field.Root id="replyTo">
                    <Field.Label htmlFor="replyTo">Reply To</Field.Label>
                    <Input
                      type="text"
                      id="replyTo"
                      placeholder="Enter email address"
                      {...register('envelope.replyTo')}
                    />
                  </Field.Root>
                </Stack>
              </Card.Body>
            </Card.Root>

            <Card.Root>
              <Card.Header>
                <Heading size="sm">Content</Heading>
              </Card.Header>
              <Card.Body>
                <Stack>
                  <Stack>
                    <Skeleton loading={!!state.isLoading}>
                      <Field.Root id="content">
                        <Controller
                          control={control}
                          name="content"
                          // Monaco takes a plain CSS length, so the height has
                          // to stay a literal var() rather than a size token.
                          // Only the prefix moves: this page declares layout
                          // {name: 'jaen'}, so jaen's system is the only one
                          // mounted and it emits --jaen-*. --jaen-sizes-md is
                          // 28rem, the same value v2's --chakra-sizes-md
                          // carried.
                          render={({field}) => (
                            <Editor
                              theme={'vs-dark'}
                              height="var(--jaen-sizes-md)"
                              defaultLanguage="html"
                              defaultValue={field.value || undefined}
                              onChange={(value, _) => field.onChange(value)}
                            />
                          )}
                        />
                      </Field.Root>
                    </Skeleton>
                  </Stack>

                  <Stack>
                    <Heading size="sm">Preview</Heading>
                    <Skeleton loading={!!state.isLoading}>
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
              </Card.Body>
            </Card.Root>

            <Card.Root>
              <Card.Header>
                <Heading size="sm">Variables</Heading>
              </Card.Header>
              <Card.Body>
                <Stack gap={4}>
                  <Table.Root striped colorPalette="gray">
                    <Table.Header>
                      <Table.Row>
                        <Table.ColumnHeader>Name</Table.ColumnHeader>
                        <Table.ColumnHeader>Type</Table.ColumnHeader>
                        <Table.ColumnHeader>Description</Table.ColumnHeader>
                        <Table.ColumnHeader>Default Value</Table.ColumnHeader>
                        <Table.ColumnHeader>Required</Table.ColumnHeader>
                        <Table.ColumnHeader>Constant</Table.ColumnHeader>
                        <Table.ColumnHeader></Table.ColumnHeader>
                      </Table.Row>
                    </Table.Header>
                    <Table.Body>
                      {variablesField.fields.map((field, index) => (
                        <Table.Row key={index}>
                          <Table.Cell>
                            <Input
                              type="text"
                              defaultValue={field.name}
                              {...register(`variables.${index}.name`)}
                            />
                          </Table.Cell>
                          <Table.Cell>
                            <NativeSelect.Root>
                              <NativeSelect.Field
                                {...register(`variables.${index}.type`)}>
                                {Object.values(VariableType).map(type => (
                                  <option key={type} value={type}>
                                    {type}
                                  </option>
                                ))}
                              </NativeSelect.Field>
                              <NativeSelect.Indicator />
                            </NativeSelect.Root>
                          </Table.Cell>
                          <Table.Cell>
                            <Textarea
                              minH="10"
                              {...register(`variables.${index}.description`)}
                            />
                          </Table.Cell>
                          <Table.Cell>
                            <Input
                              type="text"
                              {...register(`variables.${index}.defaultValue`)}
                            />
                          </Table.Cell>
                          <Table.Cell>
                            {/* Value-driven for the same reason as
                                verifyReplyTo above. */}
                            <Checkbox.Root
                              {...register(`variables.${index}.isRequired`)}
                              checked={watch(`variables.${index}.isRequired`)}>
                              <Checkbox.HiddenInput />
                              <Checkbox.Control>
                                <Checkbox.Indicator />
                              </Checkbox.Control>
                            </Checkbox.Root>
                          </Table.Cell>
                          <Table.Cell>
                            <Checkbox.Root
                              {...register(`variables.${index}.isConstant`)}
                              checked={watch(`variables.${index}.isConstant`)}>
                              <Checkbox.HiddenInput />
                              <Checkbox.Control>
                                <Checkbox.Indicator />
                              </Checkbox.Control>
                            </Checkbox.Root>
                          </Table.Cell>
                          <Table.Cell>
                            <Button
                              colorPalette="red"
                              onClick={() => variablesField.remove(index)}>
                              Remove
                            </Button>
                          </Table.Cell>
                        </Table.Row>
                      ))}
                    </Table.Body>
                  </Table.Root>

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
              </Card.Body>
            </Card.Root>
          </Stack>

          {/* v2 also carried isDisabled={state.isLoading} on the group, but
              that was only a fallback for buttons that set none, and each of
              these sets its own with state.isLoading already in it. v3 has no
              group-level disabling, and there is nothing to carry over. */}
          <ButtonGroup justifyContent="end">
            <Button
              type="button"
              variant="outline"
              colorPalette="red"
              disabled={state.isLoading || isSubmitting}
              onClick={handleDeleteClick}>
              Delete
            </Button>

            <Button
              type="button"
              variant="outline"
              disabled={state.isLoading || isSubmitting || !isDirty}
              onClick={async () => {
                await fetchData()
              }}>
              Cancel
            </Button>

            <Button
              type="submit"
              loading={state.isLoading || isSubmitting}
              disabled={state.isLoading || isSubmitting}>
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
