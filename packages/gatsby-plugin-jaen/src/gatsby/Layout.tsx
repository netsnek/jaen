import {Box, ChakraProvider} from '@chakra-ui/react'
import {LayoutProps} from 'jaen'

import {JaenPageLayout} from '../components/JaenPageLayout'
import CustomLayout from '../components/Layout'
import userSystem from '../theme/theme'
import {JaenIntlProvider} from './wrap-root-element'

const Layout: React.FC<LayoutProps> = ({children, pageProps}) => {
  const {pageConfig} = pageProps.pageContext

  // check if jaen theme is set
  const layout = pageConfig?.layout

  return layout?.name === 'jaen' ? (
    // Re-provide the account-language intl beneath any site-level per-page
    // IntlProvider: CMS surfaces always follow the signed-in account's
    // language, never the page URL's locale.
    <JaenIntlProvider>
      <JaenPageLayout layout={layout.type}>{children}</JaenPageLayout>
    </JaenIntlProvider>
  ) : (
    /**
     * v2 mounted <ThemeProvider> for the site's tokens and <GlobalStyle/> for
     * its global rules, as two separate things placed by hand. In v3 the
     * provider IS the global-style emitter, so mounting the site's system only
     * on this branch makes the conditionality structural: the site's globals
     * arrive and leave with the branch that wants them, and GlobalStyle is gone.
     *
     * ChakraProvider goes outside Box rather than inside, because v2's
     * ThemeProvider rendered no element of its own. Keeping the nesting order
     * leaves the emitted DOM byte-identical while Box now compiles against the
     * site's system rather than jaen's.
     */
    <ChakraProvider value={userSystem}>
      <Box zIndex="1">
        <CustomLayout pageProps={pageProps}>{children}</CustomLayout>
      </Box>
    </ChakraProvider>
  )
}

export default Layout
