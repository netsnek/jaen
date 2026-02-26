import React from 'react'
import type {PageProps} from 'gatsby'
import {PageConfig} from 'jaen'
import {navigate} from 'gatsby'

const isPwa = () => {
  if (typeof window === 'undefined') {
    return false
  }

  const mediaQuery = window.matchMedia?.('(display-mode: standalone)')

  return Boolean(mediaQuery?.matches || (window.navigator as any)?.standalone)
}

const LoadingPage: React.FC<PageProps> = () => {
  React.useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    const inPwa = isPwa()

    if (inPwa) {
      // PWA → go straight to dashboard
      navigate('/app/dashboard/', {replace: true})
    } else {
      // Normal browser → go to /
      navigate('/', {replace: true})
    }
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-t-transparent border-black rounded-full animate-spin" />
    </div>
  )
}

export default LoadingPage

export const pageConfig: PageConfig = {
  label: 'Loading',
  withoutJaenFrame: true,
  layout: {
    name: 'jaen'
  }
}

export {Head} from 'jaen'
