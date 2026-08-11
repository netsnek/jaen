import {Alert, Box, Center} from '@chakra-ui/react'
import React, {useEffect, useMemo} from 'react'
import {AuthProvider} from 'react-oidc-context'
import {PageProps} from '../types'

import {useAuth as useOIDCAuth} from 'react-oidc-context'
import {fetchCurrentUserRoles} from '../clients/zitadel-gql'
import {AuthUserProvider} from './auth-user'
import {useNotificationsContext} from './notifications'

/**
 * Role keys carried in the token itself. Zitadel emits the claim as one
 * object (single project) or an array of objects (multi-project audience);
 * both shapes map role keys to org projections.
 */
const rolesFromTokenClaim = (claim: unknown): string[] => {
  const items = Array.isArray(claim) ? claim : claim ? [claim] : []

  return items.flatMap(item =>
    item && typeof item === 'object' ? Object.keys(item) : []
  )
}

export const useAuth = () => {
  const oidcAuth = useOIDCAuth()

  const [isRolesLoading, setIsRolesLoading] = React.useState<boolean>(false)
  const [roles, setRoles] = React.useState<string[]>([])

  useEffect(() => {
    let cancelled = false

    const getRoles = async () => {
      const claimRoles = rolesFromTokenClaim(
        oidcAuth.user?.profile['urn:zitadel:iam:org:project:roles']
      )

      // Token-claim roles are available synchronously; merge them into the
      // current set (a token refresh must not blank previously fetched
      // roles) while the authoritative zitadel-gql query resolves.
      setRoles(prev => Array.from(new Set([...prev, ...claimRoles])))
      setIsRolesLoading(true)

      try {
        const {plainRoles, projectScopedRoles} = await fetchCurrentUserRoles(
          oidcAuth.user!.access_token
        )

        if (cancelled) return

        setRoles(
          Array.from(
            new Set([...projectScopedRoles, ...plainRoles, ...claimRoles])
          )
        )
      } catch (error) {
        // The claim-derived roles stay in place; a failing roles query must
        // not sign the user out.
        console.error('jaen: zitadel-gql roles query failed', error)
      } finally {
        if (!cancelled) {
          setIsRolesLoading(false)
        }
      }
    }

    if (oidcAuth.user) {
      void getRoles()
    }

    return () => {
      cancelled = true
    }
  }, [oidcAuth.user])

  const auth = useMemo(() => {
    return {
      ...oidcAuth,
      user: {
        ...oidcAuth.user,
        roles
      },
      isLoading: isRolesLoading || oidcAuth.isLoading
    }
  }, [oidcAuth, roles, isRolesLoading])

  return auth
}

export const checkUserRoles = (
  user: ReturnType<typeof useAuth>['user'],
  roles: string[]
) => {
  if (!user) return false

  return roles.some(role => user.roles.includes(role))
}

export const AuthenticationProvider: React.FC<{
  children: React.ReactNode
}> = ({children}) => {
  const scope = useMemo(() => {
    // Copy before extending: mutating the DefinePlugin-injected array would
    // append 'zitadel' again on every provider mount.
    const projectIds: string[] = [
      ...(__JAEN_ZITADEL_GQL__.projectIds || []),
      'zitadel'
    ]

    const parts = new Set<string>()

    parts.add('openid')
    parts.add('profile')
    parts.add('email')
    parts.add(`urn:zitadel:iam:org:id:${__JAEN_ZITADEL_GQL__.organizationId}`)
    projectIds.forEach(projectId => {
      parts.add(`urn:zitadel:iam:org:project:id:${projectId}:aud`)
    })
    parts.add('offline_access')

    return Array.from(parts).join(' ')
  }, [])

  return (
    <AuthProvider
      client_id={__JAEN_ZITADEL_GQL__.clientId}
      redirect_uri={__JAEN_ZITADEL_GQL__.redirectUri}
      scope={scope}
      loadUserInfo
      authority={__JAEN_ZITADEL_GQL__.authority}
      onSigninCallback={() => {
        window.history.replaceState(
          {},
          document.title,
          window.location.pathname
        )
      }}>
      <AuthUserProvider>{children}</AuthUserProvider>
    </AuthProvider>
  )
}

export const withAuthSecurity = <
  P extends Omit<PageProps, 'children'> & {
    children: React.ReactElement<any, string | React.JSXElementConstructor<any>>
  }
>(
  Component: React.ComponentType<P>
) => {
  const Wrapper: React.FC<P> = props => {
    const pageConfigAuth = props.pageContext.pageConfig?.auth
    const auth = useAuth()
    const notify = useNotificationsContext()

    const loadingText = useMemo(() => {
      switch (auth.activeNavigator) {
        case 'signinRedirect':
        case 'signinSilent':
          return 'Signing you in...'
        case 'signoutSilent':
        case 'signoutRedirect':
          return 'Signing you out...'
        case undefined:
          return undefined
        default:
          return 'Loading...'
      }
    }, [auth.activeNavigator])

    useEffect(() => {
      if (auth.error) {
        notify.toast({
          title: 'Error',
          description: auth.error.message,
          status: 'error'
        })
      }
    }, [auth.error, notify])

    useEffect(() => {
      if (loadingText) {
        notify.toast({
          title: loadingText,
          status: 'info'
        })
      }
    }, [loadingText])

    if (pageConfigAuth?.isRequired) {
      let roles = pageConfigAuth?.roles

      if (pageConfigAuth.isAdminRequired) {
        if (!roles) {
          roles = ['jaen:admin']
        } else {
          roles.push('jaen:admin')
        }
      }

      if (roles) {
        const hasRoles = checkUserRoles(auth.user, roles)

        if (!hasRoles) {
          return (
            <Center height="100vh">
              <Box textAlign="center">
                <Alert.Root status="error" mb={4}>
                  <Alert.Indicator />
                  You don't have the required roles to view this page
                </Alert.Root>
              </Box>
            </Center>
          )
        }
      }

      if (auth.isAuthenticated) {
        return <Component {...props} />
      }

      return (
        <Center height="100vh">
          <Box textAlign="center">
            <Alert.Root status="error" mb={4}>
              <Alert.Indicator />
              You need to be logged in to view this page
            </Alert.Root>
          </Box>
        </Center>
      )
    }

    return <Component {...props} />
  }

  return Wrapper
}
