import {As, Button, Text, TextProps} from '@chakra-ui/react'
import {Tooltip} from '@/components/ui/tooltip'
import DOMPurify from 'isomorphic-dompurify'
import React, {useCallback, useEffect, useMemo, useState} from 'react'

import {FaAlignCenter} from '@react-icons/all-files/fa/FaAlignCenter'
import {FaAlignJustify} from '@react-icons/all-files/fa/FaAlignJustify'
import {FaAlignLeft} from '@react-icons/all-files/fa/FaAlignLeft'
import {FaAlignRight} from '@react-icons/all-files/fa/FaAlignRight'
import {FaBold} from '@react-icons/all-files/fa/FaBold'
import {FaItalic} from '@react-icons/all-files/fa/FaItalic'
import {FaUnderline} from '@react-icons/all-files/fa/FaUnderline'
import {FaLink} from '@react-icons/all-files/fa/FaLink'
import {FaUnlink} from '@react-icons/all-files/fa/FaUnlink'
import {FaFileUpload} from '@react-icons/all-files/fa/FaFileUpload'

import {useDebouncedCallback} from 'use-debounce'

import {TuneOption} from '../../components/TuneSelectorButton/components/TuneSelector/TuneSelector'
import {useTunes} from '../../components/TuneSelectorButton/components/TuneSelector/useTunes'
import {TuneSelectorButton} from '../../components/TuneSelectorButton/TuneSelectorButton'

import {connectField} from '../../connectors'
import {useNotificationsContext} from '../../contexts/notifications'
import {HighlightTooltip} from '../components/HighlightTooltip/HighlightTooltip'
import {uploadFile} from '../../utils/open-storage-gateway'

const cleanRichText = (
  text: string,
  options: {
    isRTF?: boolean
  }
) => {
  const {isRTF} = options

  if (isRTF) {
    // allow target="_blank" for links
    return DOMPurify.sanitize(text, {
      ADD_TAGS: ['a'],
      ADD_ATTR: ['href', 'target']
    })
  }

  return DOMPurify.sanitize(text, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: []
  })
}

/**
 * Elements that may legally sit inside a heading or a paragraph.
 *
 * The list is HTML's phrasing content, trimmed to what a rich text value
 * actually produces. Anything outside it is flow content, which a heading
 * cannot contain, and a value carrying it has to be rendered in a div.
 */
const PHRASING_CONTENT =
  /^(a|abbr|b|bdi|bdo|br|cite|code|data|dfn|em|i|kbd|mark|q|rp|rt|ruby|s|samp|small|span|strong|sub|sup|time|u|var|wbr)$/i

/**
 * Whether the value contains anything a heading may not hold.
 *
 * Asking "does this contain any tag at all" was the old test, and it cost the
 * site its document outline: a heading whose only markup is the brand span
 * around its final dot, which is how every section heading here is written,
 * came out as a div. Screen readers and search engines then saw a page with no
 * headings on it. A span is phrasing content and belongs inside the heading;
 * only a div, a list or a table forces the fallback.
 */
const containsFlowContent = (input: string) => {
  const tags = input.match(/<\s*\/?\s*([a-zA-Z][a-zA-Z0-9-]*)/g)

  if (!tags) return false

  return tags.some(
    tag => !PHRASING_CONTENT.test(tag.replace(/^<\s*\/?\s*/, ''))
  )
}

export interface TextFieldProps extends Omit<TextProps, 'children'> {
  asChild?: boolean
  asAs?: As
  defaultValue?: string
  styleTunes?: TuneOption[]
  isRTF?: boolean
}

export const TextField = connectField<string, TextFieldProps>(
  ({
    jaenField,
    defaultValue,
    as: Wrapper = Text,
    asAs: definedAsAs,
    styleTunes: fieldStyleTunes = [],
    isRTF = true,
    ...rest
  }) => {
    const [value, setValue] = useState(() => {
      return cleanRichText(jaenField.staticValue || defaultValue || '', {
        isRTF
      })
    })

    useEffect(() => {
      const newValue = cleanRichText(
        jaenField.value || jaenField.staticValue || defaultValue || '',
        {
          isRTF
        }
      )

      setValue(newValue)
    }, [jaenField.value, isRTF])

    const {toast} = useNotificationsContext()

    const asAs = useMemo(() => {
      if (containsFlowContent(value)) {
        return 'div'
      }

      // asAs is the caller's explicit choice and outranks the guess. It used
      // to be dropped for headings, so asAs="h3" silently rendered an h2 and
      // there was no way to place a heading at any level but the second.
      if (definedAsAs) {
        return definedAsAs
      }

      return (Wrapper as any).displayName === 'Heading' ? 'h2' : undefined
    }, [value, (Wrapper as any).displayName, definedAsAs])

    const handleTextSave = useDebouncedCallback(
      useCallback(
        (data: string | null) => {
          // skip if data has not changed

          if (data === value) {
            return
          }

          jaenField.onUpdateValue(data || undefined)

          toast({
            title: 'Text saved',
            description: 'The text has been saved',
            status: 'info'
          })
        },
        [value]
      ),
      500
    )

    useEffect(() => {
      if (jaenField.isEditing) {
        const as =
          typeof Wrapper === 'string'
            ? Wrapper
            : typeof asAs === 'string'
              ? asAs
              : undefined

        jaenField.register({
          as
        })
      }
    }, [jaenField.isEditing])

    const handleContentBlur: React.FocusEventHandler<HTMLSpanElement> =
      useCallback(evt => {
        handleTextSave(evt.currentTarget.innerHTML)
      }, [])

    const handleFileChange = async (
      event: Event & {target: {files: FileList | null}}
    ) => {
      const fileInput = document.getElementById(
        'page-file-upload-input'
      ) as HTMLInputElement

      const file = event.target.files?.[0]
      if (file) {
        const randomId = Math.random().toString(36).substring(7)

        // The 'download' attribute is used to set the filename when downloading the file
        // This only works on same-origin URLs, hence it doesn't work with the Open Storage Gateway
        document.execCommand(
          'insertHTML',
          false,
          `<a id="${randomId}" download="${file.name}" href="#" target="_blank">${file.name}</a>`
        )

        const {fileUrl} = await uploadFile(file)

        const link = document.getElementById(randomId)

        if (link) {
          link.setAttribute('href', fileUrl)
          link.removeAttribute('id')
        } else {
          throw new Error('Could not find link element')
        }
      }

      if (fileInput) {
        // Optionally reset file input to allow re-uploading the same file
        fileInput.value = ''

        // Unregister listener
        fileInput.removeEventListener('change', handleFileChange)
      }
    }

    const alignmentTune: TuneOption = {
      type: 'groupTune',
      name: 'alignment',
      label: 'Alignment',
      tunes: [
        {
          name: 'left',
          Icon: FaAlignLeft,
          props: {
            textAlign: 'left'
          }
        },
        {
          name: 'center',
          Icon: FaAlignCenter,
          props: {
            textAlign: 'center'
          }
        },
        {
          name: 'right',
          Icon: FaAlignRight,
          props: {
            textAlign: 'right'
          }
        },
        {
          name: 'justify',
          Icon: FaAlignJustify,
          props: {
            textAlign: 'justify'
          }
        }
      ]
    }

    const styleTune: TuneOption = {
      type: 'groupTune',
      name: 'style',
      label: 'Style',
      tunes: [
        {
          name: 'bold',
          Icon: FaBold,
          onTune: () => {
            document.execCommand('bold')
          }
        },
        {
          name: 'italic',
          Icon: FaItalic,
          onTune: () => {
            document.execCommand('italic')
          }
        },
        {
          name: 'underline',
          Icon: FaUnderline,
          onTune: () => {
            document.execCommand('underline')
          }
        },
        {
          name: 'link',
          Icon: FaLink,
          onTune: async () => {
            const url = window.prompt('Enter the URL')

            if (url) {
              const selection = document.getSelection()

              document.execCommand(
                'insertHTML',
                false,
                `<a href="${url}" target="_blank">${selection}</a>`
              )
            }
          }
        },
        {
          name: 'unlink',
          Icon: FaUnlink,
          onTune: () => {
            document.execCommand('unlink', false)
          }
        },
        {
          name: 'file',
          Icon: FaFileUpload,
          onTune: async () => {
            const fileInput = document.getElementById('page-file-upload-input')

            if (fileInput) {
              // Register listener to handle file upload
              fileInput.addEventListener('change', handleFileChange)

              fileInput.click()
            }
          }
        }
      ]
    }

    const tunes = useTunes({
      props: {...rest, asAs},
      activeTunes: jaenField.activeTunes,
      tunes: [
        alignmentTune,
        ...(isRTF ? [styleTune, ...fieldStyleTunes] : []),
        ...jaenField.tunes
      ]
    })

    return (
      <HighlightTooltip
        id={jaenField.id || jaenField.name}
        actions={[
          <Button
            variant="field-highlighter-tooltip-text"
            key={`jaen-highlight-tooltip-text-${jaenField.name}`}>
            <Tooltip
              content={`ID: ${jaenField.id}`}
              positioning={{
                placement: 'top-start'
              }}>
              <Text>Text</Text>
            </Tooltip>
          </Button>,
          ...(isRTF
            ? [
                <TuneSelectorButton
                  key={`jaen-highlight-tooltip-tune-${jaenField.name}`}
                  aria-label="Customize"
                  tunes={[styleTune, ...fieldStyleTunes]}
                  icon={
                    <Text as="span" fontSize="sm" fontFamily="serif">
                      T
                    </Text>
                  }
                  activeTunes={tunes.activeTunes}
                  onTune={jaenField.tune}
                />
              ]
            : []),
          <TuneSelectorButton
            key={`jaen-highlight-tooltip-tune-${jaenField.name}`}
            aria-label="Customize"
            tunes={[alignmentTune, ...jaenField.tunes]}
            activeTunes={tunes.activeTunes}
            onTune={jaenField.tune}
          />
        ]}
        isEditing={jaenField.isEditing}
        as={Wrapper}
        asAs={asAs}
        minW="1rem"
        className={jaenField.className}
        style={{
          ...jaenField.style,
          ...rest.style
        }}
        {...rest}
        {...tunes.activeProps}
        asProps={{
          outline: 'none',
          dangerouslySetInnerHTML: {__html: value},
          contentEditable: jaenField.isEditing,
          onBlur: handleContentBlur,
          onPaste: (evt: React.ClipboardEvent<HTMLDivElement>) => {
            evt.preventDefault()

            if (isRTF) {
              let text =
                evt.clipboardData.getData('text/html') ||
                evt.clipboardData.getData('text')

              text = DOMPurify.sanitize(text, {
                ALLOWED_TAGS: ['br', 'span'],
                ALLOWED_ATTR: []
              })

              document.execCommand('insertHTML', false, text)
            } else {
              const text = evt.clipboardData.getData('text')

              document.execCommand('insertText', false, text)
            }
          }
        }}
        sx={{
          // Links inside a text field are brand coloured, and they have to
          // match the brand colour the rest of the site uses for controls.
          // brand.300 is a light tint that reads as a different orange next
          // to a brand.500 button, so the light mode takes 500 and only the
          // dark mode keeps the lighter tint for legibility.
          a: {
            color: 'brand.500',
            textDecoration: 'underline',
            _dark: {
              color: 'brand.300'
            }
          }
        }}
      />
    )
  },
  {
    fieldType: 'IMA:TextField'
  }
)
