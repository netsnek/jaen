/**
 * The handful of Chakra icons this package used, as local components.
 *
 * `@chakra-ui/icons` stopped at v2 and peers on `@chakra-ui/react >=2.0.0`,
 * so it cannot come along to v3 and had to go. The glyphs themselves are
 * fine, and swapping them for another icon set would have changed how the
 * package looks for no reason, so the paths are vendored here instead,
 * unchanged, in the wrapper shape this repo uses elsewhere.
 *
 * `asChild={false}` and `boxSize="1em"` are what that wrapper shape costs in
 * v3. v3's Icon computes `asChild: !props.as`, and with `asChild` the factory
 * drops its own <svg> tag, renders the FIRST child element in its place and
 * merges the svg's props onto it, so these wrappers emitted a bare <path>/<g>
 * that paints nothing and lost every later child. Chakra's own `createIcon`
 * passes `asChild: false` for the same reason. v2's Icon base also carried
 * `w: 1em, h: 1em`, which v3 moved into a recipe variant defaulting to the
 * empty `size: "inherit"`; without boxSize the <svg> falls back to the
 * 300x150 replaced-element default. Both sit before `{...props}` so a
 * caller's boxSize/w/h/fontSize still wins, as it did in v2.
 */
import {Icon, IconProps} from '@chakra-ui/react'

export const CopyIcon = (props: IconProps) => (
  <Icon asChild={false} boxSize="1em" viewBox="0 0 24 24" {...props}>
    <path
      fill="currentColor"
      d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"
    />
  </Icon>
)

export const DeleteIcon = (props: IconProps) => (
  <Icon asChild={false} boxSize="1em" viewBox="0 0 24 24" {...props}>
    <g fill="currentColor">
      <path d="M19.452 7.5H4.547a.5.5 0 00-.5.545l1.287 14.136A2 2 0 007.326 24h9.347a2 2 0 001.992-1.819L19.95 8.045a.5.5 0 00-.129-.382.5.5 0 00-.369-.163zm-9.2 13a.75.75 0 01-1.5 0v-9a.75.75 0 011.5 0zm5 0a.75.75 0 01-1.5 0v-9a.75.75 0 011.5 0zM22 4h-4.75a.25.25 0 01-.25-.25V2.5A2.5 2.5 0 0014.5 0h-5A2.5 2.5 0 007 2.5v1.25a.25.25 0 01-.25.25H2a1 1 0 000 2h20a1 1 0 000-2zM9 3.75V2.5a.5.5 0 01.5-.5h5a.5.5 0 01.5.5v1.25a.25.25 0 01-.25.25h-5.5A.25.25 0 019 3.75z" />
    </g>
  </Icon>
)
