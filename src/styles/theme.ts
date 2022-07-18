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
        bg: 'neutral.100',
        color: 'neutral.500',
      },
      'nav, ul': {
        display: 'contents',
      },
      'ul, ol': {
        'li::marker': {
          color: 'transparent',
        },
      },
    },
  },
} as DefaultThemeType);
