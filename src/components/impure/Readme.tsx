import type { UnwrapComponent } from '@~types/unwrap';
import { getInnerText } from '@lib/reactTree';

import useSWR from 'swr';
import { useRouter } from 'next/router';

import { Fragment } from 'react';
import type { BoxProps } from '@chakra-ui/react';
import { Box, Flex, Spinner } from '@chakra-ui/react';
import Markdown from 'markdown-to-jsx';
import SafeLink from '@components/SafeLink';

export default Readme;
export type { ReadmeProps };

type APITreatedResponse = {
   lang: string | null;
   html: string;
};

type ReadmeProps = {
   repoName: string;
} & BoxProps;

function Readme({ repoName, ...props }: any) {
   const { locale } = useRouter();
   const { data: { html: content = '', lang } = {} } =
      useSWR<APITreatedResponse>(
         `/api/github/readme?name=${repoName}&lang=${locale}`,
         fetcher,
      );

   return (
      <Fragment>
         {content === '' ? (
            <Flex {...props} justify='center' align='center'>
               <Spinner size='xl' />
            </Flex>
         ) : (
            <Box
               as={Markdown}
               options={
                  {
                     wrapper: 'article',
                     overrides: {
                        h1: headingOverride(1),
                        h2: headingOverride(2),
                        h3: headingOverride(3),
                        h4: headingOverride(4),
                        h5: headingOverride(5),
                        h6: headingOverride(6),
                        a: anchorOverride(lang),
                     },
                  } as UnwrapComponent<typeof Markdown>['options']
               }
               sx={{
                  'img:not([alt^=":"][alt$=":"])': {
                     filter: 'drop-shadow(0 0 .05em var(--border-color-muted))',
                  },
                  'img[alt^=":"][alt$=":"]': {
                     '--vertical-align': '-10%',
                     '--size': '1em',

                     minW: '1em',
                     height: '1em',
                     display: 'inline-block',
                     verticalAlign: 'var(--vertical-align)',
                     pos: 'relative',

                     _after: {
                        content: 'attr(alt)',
                        bgColor: 'var(--background-color)',
                        textAlign: 'center',
                        display: 'block',
                        pos: 'absolute',
                        top: 'var(--vertical-align)',
                        bottom: 'calc(2 * var(--vertical-align))',
                        left: '0',
                        right: '0',
                     },
                  },
                  '[align="center"]': {
                     '--spacing': '.5em',
                     display: 'flex',
                     flexWrap: 'wrap',
                     alignItems: 'center',
                     justifyContent: 'center',
                     gap: 'var(--spacing)',

                     '*': {
                        display: 'inherit',
                        flexWrap: 'inherit',
                        alignItems: 'inherit',
                        justifyContent: 'inherit',
                        gap: 'inherit',
                     },

                     '&:last-of-type': {
                        flexDirection: 'column',

                        '[title="Ruan Moreira de Jesus"]': {
                           borderRadius: 'full',
                        },
                     },
                  },

                  '*': {
                     borderBottom: '1px solid var(--border-color-muted)',
                     borderStyle: 'unset',

                     _first: {
                        marginTop: '0 !important',
                     },
                  },
                  'ul, ol': {
                     all: 'revert',
                  },
                  img: {
                     maxW: '100%',
                  },
                  a: {
                     color: 'blue.500',
                     _hover: {
                        textDecoration: 'underline',
                     },
                  },
                  'p, blockquote, ul, ol, dl, table, pre, details': {
                     marginTop: '0',
                     marginBottom: '16px',
                  },

                  pre: {
                     padding: '16px',
                     overflow: 'auto',
                     fontSize: '85%',
                     lineHeight: '1.45',
                     bgColor: 'var(--color-code)',
                     borderRadius: '6px',
                     marginBottom: '0',
                     wordBreak: 'normal',
                  },
                  'code:not(pre code)': {
                     px: '0.4em',
                     py: '0.2em',
                     bgColor: 'var(--color-mention)',
                     borderRadius: '2',
                  },
                  '[data-level]': {
                     marginTop: '24px',
                     marginBottom: '16px',
                     fontWeight: '600',
                     lineHeight: '1.25',

                     '&[data-level="h1"]': {
                        paddingBottom: '0.3em',
                        fontSize: '2em',
                        borderStyle: 'solid',
                     },
                     '&[data-level="h2"]': {
                        paddingBottom: '0.3em',
                        fontSize: '1.5em',
                        borderStyle: 'solid',
                     },
                     '&[data-level="h3"]': {
                        fontSize: '1.25em',
                     },
                     '&[data-level="h4"]': {
                        fontSize: '1em',
                     },
                     '&[data-level="h5"]': {
                        fontSize: '.875em',
                     },
                     '&[data-level="h6"]': {
                        fontSize: '.85em',
                        color: 'var(--color-muted)',
                     },
                  },
               }}
               {...props}
            >
               {content}
            </Box>
         )}
      </Fragment>
   );
}

const fetcher = (url: string) =>
   fetch(url)
      .then((res) =>
         Promise.all([
            Promise.resolve(res.headers.get('content-language')),
            res.text(),
         ]),
      )
      .then((res) => ({
         lang: res[0],
         html: res[1],
      }));

const headingOverride = (
   level: 1 | 2 | 3 | 4 | 5 | 6,
   props: any = undefined,
) => ({
   props,
   component(props: any) {
      const Tag = level > 4 ? `h${level - 1}` : `h${level + 1}`;
      const dataLevel = `h${level}`;

      return <Tag data-level={dataLevel} {...props} />;
   },
});

const anchorOverride = (lang?: null | string) => ({
   component(props: any) {
      const innerText = getInnerText(props.children);

      const isSelfExternal =
         innerText.includes('Preview') ||
         props.href.toLowerCase().includes('ruanmoreiraofc');

      const to = props.href;

      if (to === '#') {
         const transformLang = {
            en: 'ENGLISH',
            pt: 'PORTUGUÊS',
            jp: '日本語',
         } as Record<string, string>;

         const isSameLanguage = lang && transformLang[lang] === innerText;

         return (
            <Box
               as='span'
               color={isSameLanguage ? 'green' : 'red'}
               cursor={isSameLanguage ? 'not-allowed' : undefined}
               textDecor={isSameLanguage ? 'underline' : undefined}
            >
               {props.children}
            </Box>
         );
      }

      return (
         <SafeLink
            {...props}
            to={to}
            href={undefined}
            isSelfExternal={isSelfExternal}
            shouldRemoveIcon
            shouldSuppressWarnings
         />
      );
   },
});
