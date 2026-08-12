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

export const AddIcon = (props: IconProps) => (
  <Icon asChild={false} boxSize="1em" viewBox="0 0 24 24" {...props}>
    <path
      fill="currentColor"
      d="M0,12a1.5,1.5,0,0,0,1.5,1.5h8.75a.25.25,0,0,1,.25.25V22.5a1.5,1.5,0,0,0,3,0V13.75a.25.25,0,0,1,.25-.25H22.5a1.5,1.5,0,0,0,0-3H13.75a.25.25,0,0,1-.25-.25V1.5a1.5,1.5,0,0,0-3,0v8.75a.25.25,0,0,1-.25.25H1.5A1.5,1.5,0,0,0,0,12Z"
    />
  </Icon>
)

export const EditIcon = (props: IconProps) => (
  <Icon asChild={false} boxSize="1em" viewBox="0 0 24 24" {...props}>
    <g fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </g>
  </Icon>
)

export const ViewIcon = (props: IconProps) => (
  <Icon asChild={false} boxSize="1em" viewBox="0 0 24 24" {...props}>
    <g fill="currentColor">
      <path d="M23.432,10.524C20.787,7.614,16.4,4.538,12,4.6,7.6,4.537,3.213,7.615.568,10.524a2.211,2.211,0,0,0,0,2.948C3.182,16.351,7.507,19.4,11.839,19.4h.308c4.347,0,8.671-3.049,11.288-5.929A2.21,2.21,0,0,0,23.432,10.524ZM7.4,12A4.6,4.6,0,1,1,12,16.6,4.6,4.6,0,0,1,7.4,12Z" />
      <circle cx="12" cy="12" r="2" />
    </g>
  </Icon>
)
