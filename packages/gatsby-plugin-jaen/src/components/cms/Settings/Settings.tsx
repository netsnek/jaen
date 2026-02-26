import {
  Box,
  Button,
  ButtonGroup,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Heading,
  HStack,
  Input,
  Stack,
  StackDivider,
  Textarea,
  VStack
} from '@chakra-ui/react'
import React, {useEffect} from 'react'
import {Controller, useForm} from 'react-hook-form'
import {useIntl} from 'react-intl'

import FormMediaChooser from '../../../containers/form-media-chooser'
import {FieldGroup} from '../../shared/FieldGroup'

export interface FormDataType {
  siteMetadata?: {
    title?: string
    siteUrl?: string
    description?: string
    image?: string
    organization?: {
      name?: string
      url?: string
      logo?: string
    }
    author?: {
      name?: string
    }
  }
}

export interface SettingsProps {
  data: FormDataType
  onUpdate: (data: FormDataType) => void
}

export const Settings: React.FC<SettingsProps> = ({data, onUpdate}) => {
  const intl = useIntl()
  const t = (id: string, defaultMessage: string) =>
    intl.formatMessage({id, defaultMessage})

  const headingLabel = t('CmsSettingsFormHeading', 'Settings')
  const siteInfoGroupTitle = t('CmsSettingsFormSiteInfoGroupTitle', 'Site Info')
  const siteTitleLabel = t('CmsSettingsFormSiteInfoTitleLabel', 'Title')
  const siteTitlePlaceholder = t(
    'CmsSettingsFormSiteInfoTitlePlaceholder',
    'Title'
  )
  const siteTitleTooLong = t(
    'CmsSettingsFormSiteInfoTitleTooLong',
    'Title is too long'
  )
  const siteUrlLabel = t('CmsSettingsFormSiteInfoUrlLabel', 'URL')
  const siteUrlPlaceholder = t(
    'CmsSettingsFormSiteInfoUrlPlaceholder',
    'https://snek.at'
  )
  const siteUrlInvalid = t(
    'CmsSettingsFormSiteInfoUrlInvalid',
    'URL must start with http:// or https://'
  )
  const siteDescriptionLabel = t(
    'CmsSettingsFormSiteInfoDescriptionLabel',
    'Description'
  )
  const siteDescriptionPlaceholder = t(
    'CmsSettingsFormSiteInfoDescriptionPlaceholder',
    'The description that appears in search engines and social media.'
  )
  const siteDescriptionHelper = t(
    'CmsSettingsFormSiteInfoDescriptionHelper',
    'Brief description for your site.'
  )
  const siteImageLabel = t('CmsSettingsFormSiteInfoImageLabel', 'Image')
  const siteImageDescription = t(
    'CmsSettingsFormSiteInfoImageDescription',
    'Upload a photo to represent the site.'
  )
  const organisationGroupTitle = t(
    'CmsSettingsFormOrganisationGroupTitle',
    'Organisation'
  )
  const organisationNameLabel = t(
    'CmsSettingsFormOrganisationNameLabel',
    'Name'
  )
  const organisationNamePlaceholder = t(
    'CmsSettingsFormOrganisationNamePlaceholder',
    'Snek'
  )
  const organisationNameTooLong = t(
    'CmsSettingsFormOrganisationNameTooLong',
    'Name is too long'
  )
  const organisationUrlLabel = t('CmsSettingsFormOrganisationUrlLabel', 'URL')
  const organisationUrlPlaceholder = t(
    'CmsSettingsFormOrganisationUrlPlaceholder',
    'https://snek.at'
  )
  const organisationUrlInvalid = t(
    'CmsSettingsFormOrganisationUrlInvalid',
    'URL must start with http:// or https://'
  )
  const organisationLogoLabel = t(
    'CmsSettingsFormOrganisationLogoLabel',
    'Image'
  )
  const organisationLogoDescription = t(
    'CmsSettingsFormOrganisationLogoDescription',
    'Upload a photo to represent the organization.'
  )
  const cancelLabel = t('CmsSettingsFormCancel', 'Cancel')
  const saveLabel = t('CmsSettingsFormSave', 'Save')

  const [defaultValues, setDefaultValues] = React.useState(data)

  const {
    register,
    reset,
    handleSubmit,
    setValue,
    control,
    getValues,
    formState: {errors, isSubmitting, isDirty}
  } = useForm<FormDataType>({
    defaultValues
  })

  const onSubmit = (values: FormDataType) => {
    onUpdate(values)
  }

  useEffect(() => {
    setDefaultValues(data)

    reset({
      siteMetadata: Object.keys(data.siteMetadata || {}).length
        ? data.siteMetadata
        : null
    })
  }, [data])

  return (
    <Box id="coco">
      <form
        onSubmit={data => {
          void handleSubmit(onSubmit)(data)
        }}>
        <Stack
          spacing="4"
          divider={<StackDivider />}
          px={{base: '4', md: '10'}}>
          <Heading size="sm">{headingLabel}</Heading>

          <FieldGroup title={siteInfoGroupTitle}>
            <VStack width="full" spacing="6">
              <FormControl isInvalid={!!errors?.siteMetadata?.title}>
                <FormLabel>{siteTitleLabel}</FormLabel>
                <Input
                  placeholder={siteTitlePlaceholder}
                  {...register('siteMetadata.title', {
                    maxLength: {value: 100, message: siteTitleTooLong}
                  })}
                />
                <FormErrorMessage>
                  {errors.siteMetadata?.title?.message}
                </FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors?.siteMetadata?.siteUrl}>
                <FormLabel>{siteUrlLabel}</FormLabel>
                <Input
                  placeholder={siteUrlPlaceholder}
                  {...register('siteMetadata.siteUrl', {
                    validate: {
                      checkUrl: value =>
                        value && !/^https?:\/\//.test(value)
                          ? siteUrlInvalid
                          : undefined
                    }
                  })}
                />
                <FormErrorMessage>
                  {errors.siteMetadata?.siteUrl?.message}
                </FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors?.siteMetadata?.description}>
                <FormLabel>{siteDescriptionLabel}</FormLabel>
                <Textarea
                  rows={5}
                  placeholder={siteDescriptionPlaceholder}
                  {...register('siteMetadata.description')}
                />
                {!errors.siteMetadata?.description && (
                  <FormHelperText>{siteDescriptionHelper}</FormHelperText>
                )}

                <FormErrorMessage>
                  {errors.siteMetadata?.description?.message}
                </FormErrorMessage>
              </FormControl>

              <FormControl id="image">
                <FormLabel>{siteImageLabel}</FormLabel>

                <Controller
                  control={control}
                  name="siteMetadata.image"
                  render={({field: {value}}) => {
                    return (
                      <FormMediaChooser
                        value={value}
                        onChoose={media => {
                          setValue('siteMetadata.image', media.url, {
                            shouldDirty: true
                          })
                        }}
                        onRemove={() => {
                          setValue('siteMetadata.image', '', {
                            shouldDirty: true
                          })
                        }}
                        description={siteImageDescription}
                      />
                    )
                  }}
                />
              </FormControl>
            </VStack>
          </FieldGroup>

          <FieldGroup title={organisationGroupTitle}>
            <VStack width="full" spacing="6">
              <FormControl
                isInvalid={!!errors?.siteMetadata?.organization?.name}>
                <FormLabel>{organisationNameLabel}</FormLabel>
                <Input
                  placeholder={organisationNamePlaceholder}
                  {...register('siteMetadata.organization.name', {
                    maxLength: {
                      value: 100,
                      message: organisationNameTooLong
                    }
                  })}
                />
                <FormErrorMessage>
                  {errors.siteMetadata?.organization?.name?.message}
                </FormErrorMessage>
              </FormControl>
              <FormControl
                isInvalid={!!errors?.siteMetadata?.organization?.url}>
                <FormLabel>{organisationUrlLabel}</FormLabel>
                <Input
                  placeholder={organisationUrlPlaceholder}
                  {...register('siteMetadata.organization.url', {
                    validate: {
                      checkUrl: value =>
                        value && !/^https?:\/\//.test(value)
                          ? organisationUrlInvalid
                          : undefined
                    }
                  })}
                />
                <FormErrorMessage>
                  {errors.siteMetadata?.organization?.url?.message}
                </FormErrorMessage>
              </FormControl>
              <FormControl id="image">
                <FormLabel>{organisationLogoLabel}</FormLabel>

                <Controller
                  control={control}
                  name="siteMetadata.organization.logo"
                  render={({field: {value}}) => (
                    <FormMediaChooser
                      value={value}
                      onChoose={media => {
                        setValue('siteMetadata.organization.logo', media.url, {
                          shouldDirty: true
                        })
                      }}
                      onRemove={() => {
                        setValue('siteMetadata.organization.logo', '', {
                          shouldDirty: true
                        })
                      }}
                      description={organisationLogoDescription}
                    />
                  )}
                />
              </FormControl>
            </VStack>
          </FieldGroup>

          <HStack justifyContent="right">
            <ButtonGroup>
              <Button
                variant="outline"
                isDisabled={!isDirty}
                onClick={() => {
                  reset(undefined, {
                    keepDirty: false
                  })
                }}>
                {cancelLabel}
              </Button>
              <Button
                type="submit"
                isLoading={isSubmitting}
                isDisabled={!isDirty}>
                {saveLabel}
              </Button>
            </ButtonGroup>
          </HStack>
        </Stack>
      </form>
    </Box>
  )
}
