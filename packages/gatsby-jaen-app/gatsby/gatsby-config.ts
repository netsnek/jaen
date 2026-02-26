import {GatsbyConfig} from 'gatsby'
import path from 'path'

const Config: GatsbyConfig = {
  jsxRuntime: 'automatic',
  jsxImportSource: '@emotion/react',
  plugins: [
    {
      resolve: `gatsby-plugin-postcss`,
      options: {
        postCssPlugins: [
          require('tailwindcss')({
            config: path.resolve(__dirname, '../../tailwind.config.ts')
          }),
          require('autoprefixer')
        ]
      }
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Jaen App`,
        short_name: `Jaen`,
        start_url: `/`,
        background_color: `#f7f0eb`,
        theme_color: `#a2466c`,
        display: `standalone`,
        icon: `src/favicon.ico`
      }
    },
    {
      resolve: `gatsby-plugin-offline`,
      options: {
        // you can keep your existing options here
        appendScript: require.resolve('../../src/sw-push.js')
      }
    }
  ]
}

export default Config
