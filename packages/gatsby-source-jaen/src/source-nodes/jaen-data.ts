import {JaenPage, JaenSite, Widget} from 'jaen'
import deepmerge from 'deepmerge'
import fs from 'fs/promises' // Import the fs module for asynchronous file operations
import path from 'path'
import {SourceNodesArgs} from 'gatsby'
import {deepmergeArrayIdMerge} from '../utils/deepmerge'

import {fetchWithCache} from '../utils/fetch-with-cache'

export type JaenData = {
  pages?: JaenPage[]
  site?: JaenSite
  widgets?: Widget[]
  patches?: any
}

export const sourceNodes = async (args: SourceNodesArgs) => {
  const {actions, createNodeId, createContentDigest, reporter, cache} = args
  const {createNode} = actions

  // Log a message using the reporter
  reporter.info('Fetching and sourcing nodes...')

  try {
    // 1. Read data from ./jaen-data/patches.txt
    const buffer = await fs.readFile(`${process.cwd()}/jaen-data/patches.txt`)

    // 2. Parse data from ./jaen-data/patches.txt (1 link per line)
    const data = buffer.toString().split('\n')

    let jaenData = {
      patches: []
    } as JaenData

    const jaenDataDir = path.join(process.cwd(), 'jaen-data')

    for (const link of data) {
      // skip empty lines
      if (link === '') {
        continue
      }

      let response: {
        createdAt?: Date
        message?: string
        data: JaenData
      }

      if (link.startsWith('http://') || link.startsWith('https://')) {
        response = await fetchWithCache<{
          createdAt: Date
          message: string
          data: JaenData
        }>(link, {cache})
      } else {
        // Local patch file: the line is a path relative to the jaen-data
        // directory. Reject anything resolving outside of it (path
        // traversal). path.resolve is lexical, so the containment check runs
        // on real paths below as well — a symlink inside jaen-data must not
        // point outside of it.
        const resolvedPath = path.resolve(jaenDataDir, link)

        if (!resolvedPath.startsWith(jaenDataDir + path.sep)) {
          reporter.panicOnBuild(
            `Invalid patch path "${link}": local patch files must resolve inside ${jaenDataDir}`
          )
          continue
        }

        let realPath: string
        try {
          realPath = await fs.realpath(resolvedPath)
        } catch {
          reporter.panicOnBuild(
            `Local patch file "${link}" not found (resolved to ${resolvedPath})`
          )
          continue
        }

        const realJaenDataDir = await fs.realpath(jaenDataDir)

        if (!realPath.startsWith(realJaenDataDir + path.sep)) {
          reporter.panicOnBuild(
            `Invalid patch path "${link}": local patch files must resolve inside ${jaenDataDir}`
          )
          continue
        }

        // The parsed file content is merged into jaenData below, so
        // createContentDigest(jaenData) invalidates the Gatsby cache
        // whenever the local patch file changes.
        const patchBuffer = await fs.readFile(realPath)
        response = JSON.parse(patchBuffer.toString())
      }

      jaenData.patches.push({
        createdAt: response.createdAt || new Date(2001, 20, 10),
        title: response.message,
        url: link
      })

      if (response) {
        jaenData = deepmerge(jaenData, response.data, {
          arrayMerge: deepmergeArrayIdMerge,
          customMerge: key => {
            if (key === 'IMA:MdxField') {
              return (target, source) => {
                return {...target, ...source}
              }
            }
          }
        })
      }
    }

    const contentDigest = createContentDigest(jaenData)

    // 3. Create JaenData node
    const jaenDataNode = {
      id: createNodeId('JaenData'),
      internal: {
        type: 'JaenData',
        contentDigest
      },
      ...jaenData
    }

    // 3. Deep remove all objects that contains the key 'deleted' with value true

    const deepRemoveDeleted = (obj: any) => {
      if (typeof obj === 'object' && obj !== null) {
        if (obj.deleted === true) {
          return undefined
        }

        for (const key in obj) {
          obj[key] = deepRemoveDeleted(obj[key])
          if (obj[key] === undefined) {
            // Remove the key if its value is undefined after recursion
            delete obj[key]
          }
        }
      }

      if (Array.isArray(obj)) {
        obj = obj.filter(item => item !== null)
      }

      return obj
    }

    deepRemoveDeleted(jaenDataNode)

    // 5. Create JaenData node using createNode action
    await createNode(jaenDataNode)

    // 6. Cache the contentDigest of the JaenData node
    await cache.set('JaenDataContentDigest', contentDigest)

    // Log a success message using the reporter
    reporter.info('Nodes sourced and created successfully!')
  } catch (error) {
    // Log an error message using the reporter
    reporter.panic('Error sourcing nodes:', error)
  }
}
