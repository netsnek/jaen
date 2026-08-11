import {Link as ChakraLink} from '@chakra-ui/react'
import {Link as GatsbyLink} from 'gatsby'
import React, {forwardRef} from 'react'

import {isInternalLink} from './utils/is-internal-path'

export interface LinkProps<T extends React.ElementType>
  extends React.ComponentProps<any> {
  to?: string
  as?: T
  isDisabled?: boolean
  children: React.ReactNode
}

const Link = <T extends React.ElementType>(
  {as, to, isDisabled, ...props}: LinkProps<T>,
  ref: React.Ref<HTMLAnchorElement | HTMLButtonElement>
) => {
  // Widened on purpose. Every branch below hands the wrapper props that belong
  // to some OTHER component (`to` to a Gatsby Link, `href` to an anchor), which
  // only worked in v2 because `as` was untyped there. Narrowing it here would
  // type-check the wrong contract.
  const Wrapper: React.ElementType = as || ChakraLink

  if (to && !isDisabled) {
    const isInternal = isInternalLink(to)

    if (isInternal) {
      return <Wrapper as={GatsbyLink} to={to} {...props} ref={ref} />
    }

    // v2's `isExternal` is gone in v3; these are the two attributes it set.
    // Spelling them out also gives them to the `as={Button}` call sites, which
    // in v2 leaked isExternal to the DOM and got neither.
    return (
      <Wrapper
        as="a"
        target="_blank"
        rel="noopener"
        href={to}
        {...props}
        ref={ref}
      />
    )
  }

  // The prop keeps its v2 name because LinkProps is exported, but v3's Button
  // only answers to `disabled`, and every disabled call site reaches this
  // branch as `as={Button}`. Forwarding isDisabled untranslated would render
  // those entries live.
  return <Wrapper disabled={isDisabled} {...props} ref={ref} />
}

const ForwardedLink = forwardRef(Link)

export {ForwardedLink as Link}
