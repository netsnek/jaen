/**
 * The computed icon import, in a module of its own.
 *
 * `import(`@react-icons/all-files/fa/${name}`)` makes webpack emit a context
 * module: a table of every file under that directory, so the runtime can pick
 * one by name. The icons themselves stay in separate chunks, but the TABLE is
 * part of whichever module contains the expression.
 *
 * That module used to be `jaen-frame.tsx`, which is a Gatsby slice and
 * therefore fetched on every page. Lighthouse measured the result on
 * netsnek.com: the slice transferred 75.0 KiB of which 74.2 KiB was never
 * executed, and 70.3 KiB of that was this table alone, shipped to every
 * anonymous visitor for a menu only an admin ever sees.
 *
 * Moving the expression here puts the table in its own chunk. `jaen-frame`
 * imports this module dynamically, inside the effect that builds the admin
 * menu, so the table is fetched when someone is actually going to use it.
 *
 * Behaviour is unchanged, including for consuming sites: any icon name their
 * page config names still resolves, because the table still covers the whole
 * directory. Only the moment of loading moves.
 */
export const resolveJaenIcon = async (
  name: string
): Promise<React.ComponentType | undefined> => {
  try {
    const mod = await import(`@react-icons/all-files/fa/${name}`)

    return mod[name]
  } catch {
    // An unknown name used to reject the same way; a missing icon must never
    // take the whole menu down with it.
    return undefined
  }
}
