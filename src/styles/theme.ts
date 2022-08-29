import { RecursivePartial } from '@~types/recursivePartial';

import { extendTheme, theme as defaultTheme } from '@chakra-ui/react';

export { theme };

type DefaultThemeType = RecursivePartial<typeof defaultTheme>;

const theme = extendTheme({
  components: {
    Button: {
      baseStyle: {
        position: false,
        outline: false,
        _focus: {
          boxShadow: false,
        },
        _focusVisible: {
          boxShadow: false,
        },
      },
    },
    Input: {
      baseStyle: {
        field: {
          outline: false,
        },
      },
    },
    Link: {
      baseStyle: {
        outline: false,
        _focus: {
          boxShadow: false,
        },
        _focusVisible: {
          boxShadow: false,
        },
      },
    },
    Checkbox: {
      baseStyle: {
        control: {
          outlineOffset: 7,
          transitionDuration: false,
          transitionProperty: false,
          _focus: {
            outlineOffset: 2,
            outlineStyle: 'auto',
            boxShadow: false,
          },
        },
      },
    },
    Drawer: {
      baseStyle: {
        closeButton: {
          outline: false,
          _focus: {
            boxShadow: false,
          },
        },
      },
    },
  },
  transition: {
    property: {
      common: defaultTheme.transition.property.common + ', outline-offset',
    },
  },
  colors: {
    neutral: {
      '900': '#000000',
      '800': '#181B23',
      '700': '#1F2029',
      '500': '#464646',
      '400': '#ADADAD',
      '300': '#ECECEC',
      '200': '#F7F7F7',
      '150': '#FAFAFA',
      '100': '#FFFFFF',
    },
  },
  fonts: {
    heading: 'sans-serif',
    body: 'sans-serif',
  },
  semanticTokens: {
    colors: {
      base: 'neutral.100',
    },
    sizes: {
      'max-page': '3xl',
      header: '28',
    },
    space: {
      base: '4rem',
      'mobile-base': '2rem',
      'up-to-max-content': `max(var(--chakra-space-mobile-base), (100vw - var(--chakra-sizes-max-page) - var(--chakra-space-base)) / 2)`,
    },
  },
  styles: {
    global: {
      '*': {
        outline: 'auto',
        outlineStyle: 'unset',
        outlineOffset: 5,
        outlineColor: 'revert',

        font: 'inherit',

        transitionDuration: '200ms',

        ':focus, :focus-visible, :focus-within': {
          outlineOffset: 0,
        },

        _focusVisible: {
          outlineStyle: 'auto',
        },
      },
      "a, label, button, [role='button'], [tabindex]:not([tabindex^='-'])": {
        cursor: 'pointer',
      },
      body: {
        color: 'neutral.500',
        bgColor: 'base',
      },
      'nav, ul': {
        display: 'contents',
      },
      'ul, ol': {
        'li::marker': {
          color: 'transparent',
        },
      },
      '.chakra-modal__content-container': {
        px: { base: 'mobile-base', md: 'unset' },
      },
      "[data-scrollbar='thin'], .chakra-modal__content-container": {
        '--thumb-color': 'var(--chakra-colors-neutral-500)',
        '--track-color': 'var(--chakra-colors-neutral-400)',

        scrollBehavior: 'smooth',

        msScrollbarArrowColor: 'transparent',
        msScrollbarFaceColor: 'var(--thumb-color)',
        msScrollbarHighlightColor: 'var(--track-color)',

        scrollbarWidth: 'thin',
        scrollbarColor: 'var(--thumb-color) var(--track-color)',

        '&::-webkit-scrollbar': {
          w: '8px',
        },
        '&::-webkit-scrollbar-thumb': {
          background: 'var(--thumb-color)',
        },
        '&::-webkit-scrollbar-track': {
          background: 'var(--track-color)',
        },
      },
      "[data-crop='viewport']": {
        w: '100vw',
        h: '100vh',
      },
      '[data-snapped-scroll]': {
        scrollBehavior: 'smooth',

        "&[data-snapped-scroll='x']": {
          overflowX: 'scroll',
          scrollSnapType: 'x mandatory',
        },
        "&[data-snapped-scroll='y']": {
          overflowY: 'scroll',
          scrollSnapType: { lg: 'y mandatory' },
        },

        msOverflowStyle: 'none',
        scrollbarWidth: 'none',
        '::-webkit-scrollbar': {
          display: 'none',
        },

        '&  [data-snapped-item]': {
          scrollSnapAlign: 'var(--snap-at, start)',
        },
      },
      '[data-limited-box]': {
        w: 'full !important',
        minW: 'unset !important',
        maxW: 'unset !important',

        "&[data-limited-box='expanded']": {
          mx: 'auto',
          px: 'up-to-max-content',
        },
        "&[data-limited-box='squashed']": {
          mx: 'up-to-max-content',
          px: 'auto',
        },
      },
      '[data-tutorial]': {
        "&[data-tutorial='mobile']": {
          display: 'none',
        },
        "&[data-tutorial='desktop']": {
          '@media (pointer: coarse)': {
            display: 'none',
          },
        },
        "&:not([data-tutorial='desktop'])": {
          '@media (pointer: coarse)': {
            display: 'revert',
          },
        },
      },
    },
  },
} as DefaultThemeType);
