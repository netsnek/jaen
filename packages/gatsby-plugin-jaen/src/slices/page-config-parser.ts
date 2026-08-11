import {PageConfig, useAuth} from 'jaen'
import {useIntl} from 'react-intl'

export const usePageConfig = () => {
  const auth = useAuth()
  const intl = useIntl()

  const parsePageConfig = async (pageConfig: PageConfig) => {
    // Recursively go through all the fields and parse lazy fields
    const parseField = async (field: any): Promise<any> => {
      if (!field) return field

      // Check if object with type function then execute the function
      if (typeof field === 'function') {
        try {
          const result = field({auth, intl})

          if (result instanceof Promise) {
            return await result
          }

          return result
        } catch (e) {
          console.log('error', e)
          return field
        }
      }

      if (field.type === 'function') {
        let result: any | null = null
        try {
          const func: Function | undefined = new Function(
            `return ${field.value}`
          )()

          if (func) {
            result = await func({auth, intl})
          }
        } catch (e) {
          console.log('error', e)
        }

        // If the result is a promise, await it
        if (result instanceof Promise) {
          return await result
        } else {
          return result
        }
      } else if (Array.isArray(field)) {
        // Handle arrays by mapping each element
        return await Promise.all(field.map(parseField))
      } else if (typeof field === 'object') {
        // Build a fresh object instead of writing into the shared one:
        // pageContext objects are cached by Gatsby, and mutating them would
        // permanently replace the serialized intlText markers with the
        // first-resolved locale's strings.
        const parsed: Record<string, any> = {}

        for (const key in field) {
          parsed[key] = await parseField(field[key])
        }

        return parsed
      }
      return field
    }

    return (await parseField({...pageConfig})) as PageConfig
  }

  return {
    parsePageConfig
  }
}
