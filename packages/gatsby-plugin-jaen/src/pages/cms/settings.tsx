import {PageProps} from 'gatsby'
import {PageConfig, useNotificationsContext} from 'jaen'
import {useIntl} from 'react-intl'

import {FormDataType, Settings} from '../../components/cms/Settings/Settings'
import {CMSManagement, useCMSManagement} from '../../connectors/cms-management'
import {intlText} from '../../lib/intl'

const SettingsPage: React.FC<PageProps> = () => {
  const manager = useCMSManagement()
  const {toast} = useNotificationsContext()
  const intl = useIntl()

  return (
    <Settings
      data={{siteMetadata: manager.siteMetadata}}
      onUpdate={({siteMetadata}: FormDataType) => {
        manager.updateSiteMetadata(siteMetadata || {})

        toast({
          title: intl.formatMessage({
            id: 'CmsSettingsNotificationsUpdated',
            defaultMessage: 'Settings updated'
          }),
          status: 'success'
        })
      }}
    />
  )
}

const Page: React.FC<PageProps> = props => {
  return (
    <CMSManagement>
      <SettingsPage {...props} />
    </CMSManagement>
  )
}

export default Page

export const pageConfig: PageConfig = {
  label: intlText('CmsSettingsTitle', 'Jaen CMS | Settings'),
  icon: 'FaCog',
  menu: {
    label: intlText('CmsSettingsMenuLabel', 'Settings'),
    type: 'app',
    group: 'cms',
    order: 400
  },

  breadcrumbs: [
    {
      label: intlText('CmsLabelsRoot', 'CMS'),
      path: '/cms/'
    },
    {
      label: intlText('CmsSettingsBreadcrumbsSettings', 'Settings'),
      path: '/cms/settings/'
    }
  ],
  withoutJaenFrameStickyHeader: true,
  auth: {
    isAdminRequired: true
  },
  layout: {
    name: 'jaen'
  }
}

export {Head} from 'jaen'
