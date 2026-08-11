import {DuplicateSlugError, JaenTemplate, useAuth} from 'jaen'
import {
  Box,
  Button,
  ButtonGroup,
  Checkbox,
  Grid,
  Heading,
  HStack,
  Icon,
  IconButton,
  Input,
  Stack,
  Text,
  Textarea,
  Fieldset,
  StackSeparator
} from '@chakra-ui/react'
import {useEffect, useState} from 'react'
import {Controller, SubmitHandler, useForm} from 'react-hook-form'
import {useIntl} from 'react-intl'
import {FaEdit} from '@react-icons/all-files/fa/FaEdit'
import {FaEye} from '@react-icons/all-files/fa/FaEye'
import {FaImage} from '@react-icons/all-files/fa/FaImage'
import {FaNewspaper} from '@react-icons/all-files/fa/FaNewspaper'

import {FaEyeLowVision} from '@react-icons/all-files/fa6/FaEyeLowVision'
import slugify from 'slugify'

import FormMediaChooser from '../../../../../containers/form-media-chooser'
import {Link} from '../../../../shared/Link'
import {ChooseButton, ChooseButtonProps} from '../ChooseButton/ChooseButton'
import {FaClone} from '@react-icons/all-files/fa/FaClone'

const useTexts = () => {
  const intl = useIntl()

  return {
    heading: {
      create: intl.formatMessage({
        id: 'CmsPagesFormHeadingCreate',
        defaultMessage: 'Create a New Page'
      }),
      edit: intl.formatMessage({
        id: 'CmsPagesFormHeadingEdit',
        defaultMessage: 'Edit the Page'
      })
    },
    lead: {
      create: intl.formatMessage({
        id: 'CmsPagesFormLeadCreate',
        defaultMessage:
          'A page represents an arrangement of fields or blocks that are presented on a specific URL.'
      }),
      edit: intl.formatMessage({
        id: 'CmsPagesFormLeadEdit',
        defaultMessage: 'Edit the page. Enhance SEO and social media presence.'
      })
    },
    template: {
      create: intl.formatMessage({
        id: 'CmsPagesFormTemplateCreate',
        defaultMessage: 'Select a Template for the New Page'
      }),
      edit: intl.formatMessage({
        id: 'CmsPagesFormTemplateEdit',
        defaultMessage: 'The template used for the page'
      })
    },
    templateHelperText: {
      create: intl.formatMessage({
        id: 'CmsPagesFormTemplateHelperTextCreate',
        defaultMessage:
          'This template will be applied to the new page, based on the parent page.'
      }),
      edit: intl.formatMessage({
        id: 'CmsPagesFormTemplateHelperTextEdit',
        defaultMessage:
          'If you wish to modify the template, create a new page and transfer the content.'
      })
    },
    title: {
      create: intl.formatMessage({
        id: 'CmsPagesFormTitleCreate',
        defaultMessage: 'Enter a Title for the New Page'
      }),
      edit: intl.formatMessage({
        id: 'CmsPagesFormTitleEdit',
        defaultMessage: 'The title of the page'
      })
    },
    titleHelperText: {
      create: intl.formatMessage({
        id: 'CmsPagesFormTitleHelperTextCreate',
        defaultMessage:
          'The title of the new page. The URL slug will be automatically generated from the title.'
      }),
      edit: intl.formatMessage({
        id: 'CmsPagesFormTitleHelperTextEdit',
        defaultMessage: 'The title of the page.'
      })
    },
    description: {
      create: intl.formatMessage({
        id: 'CmsPagesFormDescriptionCreate',
        defaultMessage: 'Provide a Description for the New Page'
      }),
      edit: intl.formatMessage({
        id: 'CmsPagesFormDescriptionEdit',
        defaultMessage: 'The description of the page'
      })
    },
    descriptionHelperText: {
      create: intl.formatMessage({
        id: 'CmsPagesFormDescriptionHelperTextCreate',
        defaultMessage:
          'The description will be utilized by search engines and social media. Aim for 160-165 characters.'
      }),
      edit: intl.formatMessage({
        id: 'CmsPagesFormDescriptionHelperTextEdit',
        defaultMessage:
          'The description will be utilized by search engines and social media. Aim for 160-165 characters.'
      })
    },
    parentPage: {
      create: intl.formatMessage({
        id: 'CmsPagesFormParentPageCreate',
        defaultMessage: 'Select a Parent Page'
      }),
      edit: intl.formatMessage({
        id: 'CmsPagesFormParentPageEdit',
        defaultMessage: 'The parent page of the page'
      })
    },
    parentHelperText: {
      create: intl.formatMessage({
        id: 'CmsPagesFormParentHelperTextCreate',
        defaultMessage: 'This serves as the parent page of the new page.'
      }),
      edit: intl.formatMessage({
        id: 'CmsPagesFormParentHelperTextEdit',
        defaultMessage:
          'You have the option to relocate the page to a more suitable parent page.'
      })
    },
    image: {
      create: intl.formatMessage({
        id: 'CmsPagesFormImageCreate',
        defaultMessage: 'Image'
      }),
      edit: intl.formatMessage({
        id: 'CmsPagesFormImageEdit',
        defaultMessage: 'Image'
      })
    },
    imageHelperText: {
      create: intl.formatMessage({
        id: 'CmsPagesFormImageHelperTextCreate',
        defaultMessage:
          'Include an image on the page. If left unset, the image of the parent page or site will be utilized.'
      }),
      edit: intl.formatMessage({
        id: 'CmsPagesFormImageHelperTextEdit',
        defaultMessage:
          'The image of the page. If left unset, the image of the parent page or site will be utilized.'
      })
    },
    post: {
      create: intl.formatMessage({
        id: 'CmsPagesFormPostCreate',
        defaultMessage: 'Mark as a Post'
      }),
      edit: intl.formatMessage({
        id: 'CmsPagesFormPostEdit',
        defaultMessage: 'Post'
      })
    },
    postHelperText: {
      create: intl.formatMessage({
        id: 'CmsPagesFormPostHelperTextCreate',
        defaultMessage:
          'Designate this page as a post to incorporate a date and author field.'
      }),
      edit: intl.formatMessage({
        id: 'CmsPagesFormPostHelperTextEdit',
        defaultMessage:
          'Designate this page as a post to incorporate a date and author field.'
      })
    },
    postDate: {
      create: intl.formatMessage({
        id: 'CmsPagesFormPostDateCreate',
        defaultMessage: 'Enter a Date for the New Page'
      }),
      edit: intl.formatMessage({
        id: 'CmsPagesFormPostDateEdit',
        defaultMessage: 'The publication date of the page'
      })
    },
    postDateHelperText: {
      create: intl.formatMessage({
        id: 'CmsPagesFormPostDateHelperTextCreate',
        defaultMessage: 'The date will be employed for post sorting.'
      }),
      edit: intl.formatMessage({
        id: 'CmsPagesFormPostDateHelperTextEdit',
        defaultMessage: 'The date will be employed for post sorting.'
      })
    },
    postAuthor: {
      create: intl.formatMessage({
        id: 'CmsPagesFormPostAuthorCreate',
        defaultMessage: 'Enter an Author for the New Page'
      }),
      edit: intl.formatMessage({
        id: 'CmsPagesFormPostAuthorEdit',
        defaultMessage: 'The author of the page'
      })
    },
    postAuthorHelperText: {
      create: intl.formatMessage({
        id: 'CmsPagesFormPostAuthorHelperTextCreate',
        defaultMessage: 'This will be displayed as the author of the post.'
      }),
      edit: intl.formatMessage({
        id: 'CmsPagesFormPostAuthorHelperTextEdit',
        defaultMessage: 'This will be displayed as the author of the post.'
      })
    },
    postCategory: {
      create: intl.formatMessage({
        id: 'CmsPagesFormPostCategoryCreate',
        defaultMessage: 'Enter a Category for the New Page'
      }),
      edit: intl.formatMessage({
        id: 'CmsPagesFormPostCategoryEdit',
        defaultMessage: 'The category of the page'
      })
    },
    postCategoryHelperText: {
      create: intl.formatMessage({
        id: 'CmsPagesFormPostCategoryHelperTextCreate',
        defaultMessage: 'The category will be used for post classification.'
      }),
      edit: intl.formatMessage({
        id: 'CmsPagesFormPostCategoryHelperTextEdit',
        defaultMessage: 'The category will be used for post classification.'
      })
    },
    excludeFromIndex: {
      create: intl.formatMessage({
        id: 'CmsPagesFormExcludeFromIndexCreate',
        defaultMessage: 'Exclude from Index'
      }),
      edit: intl.formatMessage({
        id: 'CmsPagesFormExcludeFromIndexEdit',
        defaultMessage: 'Exclude from Index'
      })
    },
    excludeFromIndexHelperText: {
      create: intl.formatMessage({
        id: 'CmsPagesFormExcludeFromIndexHelperTextCreate',
        defaultMessage:
          'Exclude this page from all index fields (e.g., locations where pages are listed).'
      }),
      edit: intl.formatMessage({
        id: 'CmsPagesFormExcludeFromIndexHelperTextEdit',
        defaultMessage:
          'Exclude this page from all index fields (e.g., locations where pages are listed).'
      })
    }
  }
}

interface FormValues {
  title: string
  slug: string
  description: string
  parentPage: string
  template: string | null
  blogPost?: {
    date?: string
    author?: string
    category?: string
  }
  image?: {
    src?: string
  }
  isExcludedFromIndex?: boolean
}

export interface PageContentFormProps {
  parentPages: {
    [pageId: string]: {
      label: string
      templates: ChooseButtonProps['items']
    }
  }
  jaenTemplates?: JaenTemplate[]
  onSubmit: (data: FormValues) => void
  path?: string
  values?: Partial<FormValues>
  disableSlug?: boolean
  mode?: 'create' | 'edit'
}

export const PageContentForm: React.FC<PageContentFormProps> = ({
  mode = 'create',
  ...props
}) => {
  const intl = useIntl()
  const texts = useTexts()

  const {
    handleSubmit,
    watch,
    register,
    setValue,
    reset,
    setError,
    control,
    formState: {errors, isSubmitting}
  } = useForm<FormValues>({
    defaultValues: props.values
  })

  useEffect(() => {
    // set default values

    reset(props.values)

    if (mode === 'edit') {
      // lock the form
      setIsEditFormLocked(true)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(props.values)])

  const [isEditFormLocked, setIsEditFormLocked] = useState<boolean>(true)

  const handleReset = () => {
    // Reset the form to the default values
    reset(props.values)

    // Lock the form
    setIsEditFormLocked(true)
  }

  const onSubmit: SubmitHandler<FormValues> = data => {
    try {
      // make blogPost undefined if not in use or empty
      if (!isBlogPostInUse || !data.blogPost?.date) {
        data.blogPost = undefined
      }

      return props.onSubmit(data)
    } catch (e) {
      if (e instanceof DuplicateSlugError) {
        setError('slug', {
          type: 'manual',
          message: intl.formatMessage({
            id: 'CmsPagesFormErrorsSlugInUse',
            defaultMessage: 'Slug is already in use'
          })
        })
      }
    }
  }

  const title = watch('title', '') // Get the value of the 'title' field

  useEffect(() => {
    // only run when mode is create
    if (mode !== 'create') {
      return
    }

    const slug = slugify(title, {lower: true}) // Generate the slug from the title
    setValue('slug', slug) // Set the value of the 'slug' field using setValue from react-hook-form
  }, [mode, title, setValue])

  const parentPage = watch('parentPage', '') // Get the value of the 'parent' field

  const template = watch('template', '') // Get the value of the 'template' field

  const jaenTemplate = props.jaenTemplates?.find(
    jaenTemplate => jaenTemplate.id === template
  )

  const [isBlogPostInUse, setIsBlogPostInUse] = useState<boolean>(
    !!props.values?.blogPost
  )

  const [isImageInUse, setIsImageInUse] = useState<boolean>(
    !!props.values?.image?.src
  )

  const auth = useAuth()

  useEffect(() => {
    setIsBlogPostInUse(!!props.values?.blogPost)
  }, [props.values?.blogPost])

  useEffect(() => {
    setIsImageInUse(!!props.values?.image?.src)
  }, [props.values?.image?.src])

  // watch blogPost.date and
  const blogPost = watch('blogPost', undefined)

  useEffect(() => {
    if (blogPost && isBlogPostInUse) {
      if (!blogPost.date) {
        setValue('blogPost.date', new Date().toISOString().slice(0, 16))
      }

      if (!blogPost.author) {
        const defaultAuthor =
          auth.user?.profile?.nickname ||
          auth.user?.profile?.name ||
          auth.user?.profile?.email

        if (defaultAuthor) {
          setValue('blogPost.author', defaultAuthor)
        }
      }
    }
  }, [blogPost?.date])

  // reset blogPost.date if isBlogPostInUse is false
  useEffect(() => {
    if (!isBlogPostInUse) {
      setValue('blogPost', props.values?.blogPost || undefined)
    }
  }, [isBlogPostInUse])

  if (mode === 'edit' && isEditFormLocked) {
    return (
      <Stack w="full" separator={<StackSeparator />} gap="4">
        <Stack>
          <HStack justifyContent="space-between">
            <HStack>
              <Heading as="h2" size="sm">
                {props.values?.title ||
                  intl.formatMessage({
                    id: 'CmsPagesLabelsFallbackTitle',
                    defaultMessage: 'Page'
                  })}
              </Heading>

              <Text fontSize="sm" color="fg.muted">
                {jaenTemplate?.label}
              </Text>
            </HStack>

            <ButtonGroup variant="outline">
              <Link as={Button} leftIcon={<FaEye />} to={props.path}>
                {intl.formatMessage({
                  id: 'CmsPagesFormButtonsPreview',
                  defaultMessage: 'Preview'
                })}
              </Link>

              <Button
                variant="outline"
                onClick={() => {
                  setIsEditFormLocked(false)
                }}>
                <FaEdit />
                {intl.formatMessage({
                  id: 'CmsPagesFormButtonsEdit',
                  defaultMessage: 'Edit page'
                })}
              </Button>
            </ButtonGroup>
          </HStack>

          <Text fontSize="sm" color="fg.muted" maxW="70%">
            {props.values?.description}
          </Text>
        </Stack>

        {/* {(isImageInUse ||
          isBlogPostInUse ||
          props.values?.isExcludedFromIndex) && (
          <Stack spacing="4" divider={<StackDivider />}>
            {isImageInUse && (
              <Stack spacing="4">
                <HStack>
                  <Icon as={FaImage} color="brand.500" />
                  <Text fontWeight="semibold">{texts.image[mode]}</Text>
                </HStack>

                <Image
                  boxSize={36}
                  minW="36"
                  borderRadius="lg"
                  bg="bg.subtle"
                  src={props.values?.image?.src}
                  fallback={<Skeleton borderRadius="lg" boxSize="100%" />}
                />
              </Stack>
            )}

            {isBlogPostInUse && (
              <Stack spacing="4">
                <HStack>
                  <Icon as={FaNewspaper} color="brand.500" />
                  <Text fontWeight="semibold">{texts.post[mode]}</Text>
                </HStack>

                <Stack spacing="4">
                  <Stack>
                    <FormLabel as="legend">{texts.postDate[mode]}</FormLabel>

                    <Input
                      variant="unstyled"
                      type="datetime-local"
                      defaultValue={props.values?.blogPost?.date}
                      isReadOnly
                    />
                  </Stack>

                  <Stack>
                    <FormLabel as="legend">{texts.postAuthor[mode]}</FormLabel>
                    <Input
                      variant="unstyled"
                      defaultValue={props.values?.blogPost?.author}
                      isReadOnly
                    />
                  </Stack>

                  <Stack>
                    {props.values?.blogPost?.category && (
                      <>
                        <FormLabel as="legend">
                          {texts.postCategory[mode]}
                        </FormLabel>

                        <Input
                          defaultValue={props.values?.blogPost?.category}
                          isReadOnly
                        />
                      </>
                    )}
                  </Stack>
                </Stack>
              </Stack>
            )}

            {props.values?.isExcludedFromIndex && (
              <Stack spacing="4">
                <HStack>
                  <Icon as={FaEyeLowVision} color="brand.500" />
                  <Text fontWeight="semibold">
                    {texts.excludeFromIndex[mode]}
                  </Text>
                </HStack>

                <Tag w="fit-content">Yes</Tag>
              </Stack>
            )}
          </Stack>
        )} */}
      </Stack>
    )
  }

  return (
    <form
      onSubmit={e => {
        e.preventDefault()

        void handleSubmit(onSubmit)()
      }}>
      <Stack w="full" separator={<StackSeparator />} gap="4">
        <Stack>
          <Heading as="h2" size="sm">
            {texts.heading[mode]}
          </Heading>

          <Text fontSize="sm" color="fg.muted">
            {texts.lead[mode]}
          </Text>
        </Stack>

        {mode == 'create' && (
          <Fieldset.Root invalid={!!errors.parentPage} required>
            <Fieldset.Legend>{texts.parentPage[mode]}</Fieldset.Legend>

            <Controller
              control={control}
              name="parentPage"
              rules={{
                required: true
              }}
              render={({field}) => {
                return (
                  <ChooseButton
                    defaultValue={field.value}
                    onChange={field.onChange}
                    items={props.parentPages}
                  />
                )
              }}
            />

            <Fieldset.HelperText>
              {texts.parentHelperText[mode]}
            </Fieldset.HelperText>
            <Fieldset.ErrorText>
              {errors.parentPage &&
                intl.formatMessage({
                  id: 'CmsPagesFormErrorsParentRequired',
                  defaultMessage: 'Parent is required'
                })}
            </Fieldset.ErrorText>
          </Fieldset.Root>
        )}

        <Stack gap="4">
          {props.disableSlug ? (
            <Fieldset.Root required invalid={!!errors.slug}>
              <Fieldset.Legend>{texts.title[mode]}</Fieldset.Legend>
              <Input
                {...register('title', {
                  required: true
                })}
                placeholder={intl.formatMessage({
                  id: 'CmsPagesFormPlaceholdersTitle',
                  defaultMessage: 'Title'
                })}
              />
              <Fieldset.HelperText>
                {texts.titleHelperText[mode]}
              </Fieldset.HelperText>
            </Fieldset.Root>
          ) : (
            <Fieldset.Root required invalid={!!errors.title || !!errors.slug}>
              <Fieldset.Legend>{texts.title[mode]}</Fieldset.Legend>
              <Grid templateColumns="70% 30%" gap="2">
                <Input
                  {...register('title', {required: true})}
                  placeholder={intl.formatMessage({
                    id: 'CmsPagesFormPlaceholdersTitle',
                    defaultMessage: 'Title'
                  })}
                />
                <Stack>
                  <Input
                    {...register('slug', {required: true})}
                    placeholder={intl.formatMessage({
                      id: 'CmsPagesFormPlaceholdersSlug',
                      defaultMessage: 'slug'
                    })}
                    onBlur={e => {
                      const slug = slugify(e.target.value, {lower: true})
                      setValue('slug', slug, {
                        shouldDirty: true
                      })
                    }}
                  />
                  <Fieldset.ErrorText>
                    {errors.slug && errors.slug.message}
                  </Fieldset.ErrorText>
                </Stack>
              </Grid>
              <Fieldset.HelperText>
                {texts.titleHelperText[mode]}
              </Fieldset.HelperText>
            </Fieldset.Root>
          )}

          <Fieldset.Root required invalid={!!errors.description}>
            <Fieldset.Legend>{texts.description[mode]}</Fieldset.Legend>
            <Textarea
              {...register('description', {required: true})}
              placeholder={intl.formatMessage({
                id: 'CmsPagesFormPlaceholdersDescription',
                defaultMessage: 'Description'
              })}
            />
            <Fieldset.HelperText justifyContent="space-between" asChild>
              <HStack>
                <Text>{texts.descriptionHelperText[mode]}</Text>
                <Text>{watch('description')?.length || 0}</Text>
              </HStack>
            </Fieldset.HelperText>
          </Fieldset.Root>
        </Stack>

        {!(mode === 'edit' && !props.values?.template) && (
          <Fieldset.Root required invalid={!!errors.template}>
            <Fieldset.Legend>{texts.template[mode]}</Fieldset.Legend>
            {mode === 'create' ? (
              <Controller
                control={control}
                name="template"
                rules={{
                  required: true
                }}
                render={({field}) => {
                  return (
                    <ChooseButton
                      isDisabled={!props.parentPages[parentPage]?.templates}
                      onChange={field.onChange}
                      items={props.parentPages[parentPage]?.templates || {}}
                    />
                  )
                }}
              />
            ) : (
              <Button variant="outline" bgColor="bg.subtle" disabled>
                {jaenTemplate?.label}
              </Button>
            )}
            <Fieldset.HelperText>
              {texts.templateHelperText[mode]}
            </Fieldset.HelperText>

            <Fieldset.ErrorText>
              {errors.template &&
                intl.formatMessage({
                  id: 'CmsPagesFormErrorsTemplateRequired',
                  defaultMessage: 'Template is required'
                })}
            </Fieldset.ErrorText>
          </Fieldset.Root>
        )}

        <Fieldset.Root>
          <Stack gap="4">
            <Checkbox.Root
              onCheckedChange={e => {
                setIsImageInUse(e.target.checked)

                if (!e.target.checked) {
                  setValue('image.src', undefined)
                }
              }}
              checked={isImageInUse}>
              <Checkbox.HiddenInput />
              <Checkbox.Control>
                <Checkbox.Indicator />
              </Checkbox.Control>
              <Checkbox.Label>
                <HStack>
                  <Icon color="brand.500" asChild>
                    <FaImage />
                  </Icon>
                  <Stack gap="0.5">
                    <Text fontWeight="semibold">{texts.image[mode]}</Text>
                    <Text fontSize="sm" color="fg.muted">
                      {texts.imageHelperText[mode]}
                    </Text>
                  </Stack>
                </HStack>
              </Checkbox.Label>
            </Checkbox.Root>

            <Box
              display={
                // If the checkbox is checked, display the fields
                isImageInUse ? 'flex' : 'none'
              }>
              <Controller // Controller is used to integrate external inputs into the react-hook-form
                control={control}
                name="image.src"
                render={({field}) => {
                  return (
                    <FormMediaChooser
                      value={field.value}
                      onChoose={media => {
                        setValue('image.src', media.url, {
                          shouldDirty: true
                        })
                      }}
                      onRemove={() => {
                        setValue('image.src', '', {
                          shouldDirty: true
                        })
                      }}
                      description={intl.formatMessage({
                        id: 'CmsPagesFormHelperMediaDescription',
                        defaultMessage:
                          'Upload a photo to represent the organization.'
                      })}
                    />
                  )
                }}
              />
            </Box>
          </Stack>
        </Fieldset.Root>

        <Fieldset.Root
          invalid={!!errors.blogPost?.date || !!errors.blogPost?.author}>
          <Stack gap="4">
            <Checkbox.Root
              onCheckedChange={e => {
                setIsBlogPostInUse(e.target.checked)

                if (!e.target.checked) {
                  setValue('blogPost', undefined)
                }
              }}
              checked={isBlogPostInUse}>
              <Checkbox.HiddenInput />
              <Checkbox.Control>
                <Checkbox.Indicator />
              </Checkbox.Control>
              <Checkbox.Label>
                <HStack>
                  <Icon color="brand.500" asChild>
                    <FaNewspaper />
                  </Icon>
                  <Stack gap="0.5">
                    <Text fontWeight="semibold">{texts.post[mode]}</Text>
                    <Text fontSize="sm" color="fg.muted">
                      {texts.postHelperText[mode]}
                    </Text>
                  </Stack>
                </HStack>
              </Checkbox.Label>
            </Checkbox.Root>

            <Stack
              gap="4"
              display={
                // If the checkbox is checked, display the fields
                isBlogPostInUse ? 'flex' : 'none'
              }>
              <Fieldset.Root
                invalid={!!errors.blogPost?.date}
                required={isBlogPostInUse}
                disabled={!isBlogPostInUse}>
                <Fieldset.Legend>{texts.postDate[mode]}</Fieldset.Legend>
                <Input
                  {...register('blogPost.date', {
                    validate: value => {
                      if (!value && isBlogPostInUse) {
                        return intl.formatMessage({
                          id: 'CmsPagesFormErrorsDateRequired',
                          defaultMessage: 'Date is required for blog posts'
                        })
                      }

                      return true
                    }
                  })}
                  type="datetime-local"
                />
                <Fieldset.HelperText>
                  {texts.postDateHelperText[mode]}
                </Fieldset.HelperText>
              </Fieldset.Root>

              <Fieldset.Root
                invalid={!!errors.blogPost?.author}
                required={isBlogPostInUse}
                disabled={!isBlogPostInUse}>
                <Fieldset.Legend>{texts.postAuthor[mode]}</Fieldset.Legend>
                <Input
                  {...register('blogPost.author', {
                    validate: value => {
                      if (!value && isBlogPostInUse) {
                        return intl.formatMessage({
                          id: 'CmsPagesFormErrorsAuthorRequired',
                          defaultMessage: 'Author is required for blog posts'
                        })
                      }

                      return true
                    }
                  })}
                  placeholder={intl.formatMessage({
                    id: 'CmsPagesFormPlaceholdersAuthor',
                    defaultMessage: 'Author'
                  })}
                />
                <Fieldset.HelperText>
                  {texts.postAuthorHelperText[mode]}
                </Fieldset.HelperText>
              </Fieldset.Root>

              <Fieldset.Root
                invalid={!!errors.blogPost?.category}
                disabled={!isBlogPostInUse}>
                <Fieldset.Legend>{texts.postCategory[mode]}</Fieldset.Legend>
                <Input
                  {...register('blogPost.category')}
                  placeholder={intl.formatMessage({
                    id: 'CmsPagesFormPlaceholdersCategory',
                    defaultMessage: 'Category'
                  })}
                />
                <Fieldset.HelperText>
                  {texts.postCategoryHelperText[mode]}
                </Fieldset.HelperText>
              </Fieldset.Root>
            </Stack>
          </Stack>
        </Fieldset.Root>

        <Fieldset.Root invalid={!!errors.isExcludedFromIndex}>
          <Checkbox.Root
            {...register('isExcludedFromIndex', {
              required: false
            })}>
            <Checkbox.HiddenInput />
            <Checkbox.Control>
              <Checkbox.Indicator />
            </Checkbox.Control>
            <Checkbox.Label>
              <HStack>
                <Icon color="brand.500" asChild>
                  <FaEyeLowVision />
                </Icon>
                <Stack gap="0.5">
                  <Text fontWeight="semibold">
                    {texts.excludeFromIndex[mode]}
                  </Text>
                  <Text fontSize="sm" color="fg.muted">
                    {texts.excludeFromIndexHelperText[mode]}
                  </Text>
                </Stack>
              </HStack>
            </Checkbox.Label>
          </Checkbox.Root>
        </Fieldset.Root>

        <HStack justifyContent="right">
          <ButtonGroup>
            {mode === 'edit' && (
              <Button variant="outline" onClick={handleReset}>
                {intl.formatMessage({
                  id: 'CmsPagesFormButtonsCancel',
                  defaultMessage: 'Cancel'
                })}
              </Button>
            )}
            <Button type="submit" loading={isSubmitting}>
              {mode === 'create'
                ? intl.formatMessage({
                    id: 'CmsPagesFormButtonsCreate',
                    defaultMessage: 'Create page'
                  })
                : intl.formatMessage({
                    id: 'CmsPagesFormButtonsSave',
                    defaultMessage: 'Save page'
                  })}
            </Button>
          </ButtonGroup>
        </HStack>
      </Stack>
    </form>
  )
}
