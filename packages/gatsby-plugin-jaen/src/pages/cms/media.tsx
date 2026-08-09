import {PageConfig} from 'jaen'
import {graphql, PageProps} from 'gatsby'

import MediaContainer from '../../containers/media'
import {intlText} from '../../lib/intl'

const MediaPage: React.FC<PageProps> = () => {
  return <MediaContainer />
}

export default MediaPage

export const pageConfig: PageConfig = {
  label: intlText('CmsMediaTitle', 'Jaen CMS | Media'),
  icon: 'FaImage',
  menu: {
    label: intlText('CmsMediaMenuLabel', 'Media'),
    type: 'app',
    group: 'cms',
    order: 300
  },
  breadcrumbs: [
    {
      label: intlText('CmsLabelsRoot', 'CMS'),
      path: '/cms/'
    },
    {
      label: intlText('CmsMediaBreadcrumbsMedia', 'Media'),
      path: '/cms/media/'
    }
  ],
  withoutJaenFrameStickyHeader: true,
  auth: {
    isAdminRequired: true
  },
  layout: {
    name: 'jaen',
    type: 'full'
  }
}

export const query = graphql`
  query ($jaenPageId: String!) {
    ...JaenPageQuery
  }
`

export {Head} from 'jaen'
