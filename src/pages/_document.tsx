import { theme } from '@styles/theme';

import { Html, Head, Main, NextScript } from 'next/document';
import { ColorModeScript } from '@chakra-ui/react';

export default function Document() {
   return (
      <Html>
         <Head />
         <body>
            <ColorModeScript initialColorMode={theme.config.initialColorMode} />
            <Main />
            <NextScript />
         </body>
      </Html>
   );
}
