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

export const InfoIcon = (props: IconProps) => (
  <Icon asChild={false} boxSize="1em" viewBox="0 0 24 24" {...props}>
    <path
      fill="currentColor"
      d="M12,0A12,12,0,1,0,24,12,12.013,12.013,0,0,0,12,0Zm.25,5a1.5,1.5,0,1,1-1.5,1.5A1.5,1.5,0,0,1,12.25,5ZM14.5,18.5h-4a1,1,0,0,1,0-2h.75a.25.25,0,0,0,.25-.25v-4.5a.25.25,0,0,0-.25-.25H10.5a1,1,0,0,1,0-2h1a2,2,0,0,1,2,2v4.75a.25.25,0,0,0,.25.25h.75a1,1,0,1,1,0,2Z"
    />
  </Icon>
)
