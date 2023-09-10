import {
  ReactNode,
  ElementType,
  forwardRef,
  ReactElement,
  ComponentPropsWithRef,
} from 'react'

import cx from 'classnames'

interface ButtonProps<TButtonElement extends ElementType = 'button'> {
  as?: TButtonElement
  children: ReactNode
  className?: string
  size?: 'xs' | 'sm' | 'md'
  variant: 'primary' | 'secondary' | 'ghost' | 'hollow'
}

type ButtonComponent = <TButtonElement extends ElementType = 'button'>(
  props: ButtonProps<TButtonElement>
) => ReactElement | ReactNode | null

const Button: ButtonComponent = forwardRef(function Button<
  TButtonElement extends ElementType = 'button'
>(
  {
    as,
    children,
    className,
    size = 'md',
    variant,
    ...props
  }: ButtonProps<TButtonElement>,
  ref?: ComponentPropsWithRef<TButtonElement>['ref']
) {
  const ButtonElement = as || 'button'

  return (
    <ButtonElement
      {...props}
      ref={ref}
      data-size={size}
      className={cx(
        className,
        'inline-flex scale-100 transform-gpu cursor-pointer items-center rounded-[10rem] border-2 border-solid text-xl uppercase transition-all duration-150 ease-in-out [backface-visibility:hidden]',
        'hover:scale-[1.05] hover:no-underline aria-expanded:scale-[1.05]',
        'focus:outline-0',
        {
          ['px-5 py-2 text-xxs tracking-wide']: size === 'xs',
          ['px-8 py-3 text-xs tracking-wide']: size === 'sm',
          ['px-9 py-3 text-base']: size === 'md',
          ['border-green bg-green text-white hover:border-green-light hover:bg-green-light']:
            variant === 'primary',
          ['border-offwhite bg-transparent text-white hover:border-white']:
            variant === 'hollow',
          ['hover:background-black-pure/10 border-transparent bg-transparent text-white']:
            variant === 'ghost',
          'border-white bg-white text-black-base': variant === 'secondary',
        }
      )}
    >
      {children}
    </ButtonElement>
  )
})

export default Button
