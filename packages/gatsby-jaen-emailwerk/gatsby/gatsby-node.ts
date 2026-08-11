import {GatsbyNode, PluginOptions} from 'gatsby'

export interface JaenEmailwerkPluginOptions extends PluginOptions {
  /**
   * GraphQL endpoint of the emailwerk instance, e.g.
   * `https://emailwerk.netsnek.com/graphql`.
   *
   * Resolution order at bundle time:
   * 1. this option
   * 2. the `GATSBY_EMAILWERK_URL` environment variable
   * 3. the client falls back to the documented default endpoint
   *    (see `src/client/index.ts`)
   */
  url?: string
}

export const pluginOptionsSchema: GatsbyNode['pluginOptionsSchema'] = ({
  Joi
}) => {
  return Joi.object({
    url: Joi.string().description(
      'GraphQL endpoint of the emailwerk instance (falls back to the GATSBY_EMAILWERK_URL env var)'
    )
  })
}

export const onCreateWebpackConfig: GatsbyNode['onCreateWebpackConfig'] =
  async ({actions, plugins}, pluginOptions: JaenEmailwerkPluginOptions) => {
    // Inject the endpoint as a webpack define. The ambient declaration lives
    // in packages/jaen/src/types.ts (`__JAEN_EMAILWERK_URL__`).
    actions.setWebpackConfig({
      plugins: [
        plugins.define({
          __JAEN_EMAILWERK_URL__: JSON.stringify(
            pluginOptions.url ?? process.env.GATSBY_EMAILWERK_URL
          )
        })
      ]
    })
  }
