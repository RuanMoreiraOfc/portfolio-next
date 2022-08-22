import type { OmitDistributive } from '@~types/omitDistributive';

import type { ReactNode, FunctionComponent } from 'react';
import NextLink from 'next/link';
import type { LinkProps as ChakraLinkProps } from '@chakra-ui/react';
import {
   Link as ChakraLink,
   Button as ChakraButton,
   Icon as ChakraIcon,
} from '@chakra-ui/react';

import { MdOpenInNew } from 'react-icons/md';

export default SafeLink;
export type { SafeLinkProps, SafeLinkDefaultProps };

type ChakraLinkPropsFiltered = OmitDistributive<
   ChakraLinkProps,
   'as' | 'href' | 'children'
>;

type SafeLinkDefaultProps = {
   shouldRemoveIcon: boolean;
   shouldSuppressWarnings: boolean;
   isSelfExternal: boolean;
   unreachable: boolean;
};

type SafeLinkProps = {
   to: string;
   children: ReactNode;
} & (SafeLinkDefaultProps & ChakraLinkPropsFiltered);

const defaultProps: Readonly<SafeLinkDefaultProps> = Object.freeze({
   shouldRemoveIcon: false,
   shouldSuppressWarnings: false,
   isSelfExternal: true,
   unreachable: false,
} as SafeLinkDefaultProps);

SafeLink.defaultProps = defaultProps;

function SafeLink({
   children,
   to,
   isSelfExternal,
   shouldRemoveIcon,
   shouldSuppressWarnings,
   unreachable,
   download,
   ...restLinkProps
}: SafeLinkProps) {
   const isNoHTTPS =
      to.startsWith('http:') ||
      (to.startsWith('//') && to.startsWith('//www.') === false);

   if (isNoHTTPS) {
      if (shouldSuppressWarnings === false) {
         throw new Error(
            `\`${to}\` is an invalid \`to\` prop! Don't use external links without \`https\` protocol!`,
         );
      }
   }

   const isExternal =
      isNoHTTPS ||
      to.startsWith('tel:') ||
      to.startsWith('mailto:') ||
      to.startsWith('http://') ||
      to.startsWith('https://');

   const isForeign = isExternal && !isSelfExternal;
   const linkProps: ChakraLinkPropsFiltered = Object.assign(
      {},
      {
         tabIndex: unreachable ? -1 : undefined,
         target: isExternal ? '_blank' : undefined,
         rel:
            Object.entries({
               nofollow: isForeign,
               external: isExternal,
               noopener: isExternal,
               noreferrer: isForeign,
            })
               .reduce(
                  (acc, [key, shouldAdd]) => acc.concat(shouldAdd ? key : []),
                  [] as string[],
               )
               .join(' ') || undefined,
      },
      restLinkProps,
   );

   // ***

   const Tag = (restLinkProps.colorScheme
      ? ChakraButton
      : ChakraLink) as unknown as FunctionComponent<ChakraLinkProps>;

   return (
      <NextLink href={to} passHref locale={false}>
         <Tag as='a' display='inline-flex' {...linkProps}>
            {children}
            {shouldRemoveIcon === false && isExternal === true && (
               <ChakraIcon as={MdOpenInNew} ml='0.2em' />
            )}
         </Tag>
      </NextLink>
   );
}
