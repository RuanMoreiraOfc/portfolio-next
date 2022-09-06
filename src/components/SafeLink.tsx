import type { OmitDistributive } from '@~types/omitDistributive';

import { isString } from 'util';
import type { ReactNode, FunctionComponent } from 'react';
import type { LinkProps as NextLinkProps } from 'next/link';
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
   shouldSuppressUnsecureWarnings: boolean;
   isSelfExternal: boolean;
   unreachable: boolean;
};

type SafeLinkProps = {
   to: NextLinkProps['href'];
   toMask?: NextLinkProps['as'];
   locale?: NextLinkProps['locale'];
   replace?: NextLinkProps['replace'];
   children: ReactNode;
} & (SafeLinkDefaultProps & ChakraLinkPropsFiltered);

const defaultProps: Readonly<SafeLinkDefaultProps> = Object.freeze({
   shouldRemoveIcon: false,
   shouldSuppressUnsecureWarnings: false,
   isSelfExternal: true,
   unreachable: false,
} as SafeLinkDefaultProps);

SafeLink.defaultProps = defaultProps;

function SafeLink({
   children,
   replace,
   locale,
   to,
   toMask,
   isSelfExternal,
   shouldRemoveIcon,
   shouldSuppressUnsecureWarnings,
   unreachable,
   download,
   ...restLinkProps
}: SafeLinkProps) {
   const URLOrProtocol = isString(to) ? to : to.protocol ?? 'same-origin';

   const isNoHTTPS =
      URLOrProtocol.startsWith('http:') ||
      (URLOrProtocol.startsWith('//') &&
         URLOrProtocol.startsWith('//www.') === false);

   if (isNoHTTPS) {
      if (shouldSuppressUnsecureWarnings === false) {
         throw new Error(
            `\`${URLOrProtocol}\` is an invalid \`to\` prop! Don't use external links without \`https\` protocol!`,
         );
      }
   }

   const isExternal =
      isNoHTTPS ||
      URLOrProtocol.startsWith('tel:') ||
      URLOrProtocol.startsWith('mailto:') ||
      URLOrProtocol.startsWith('http:') ||
      URLOrProtocol.startsWith('https:');

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
      <NextLink //
         href={to}
         as={toMask}
         locale={locale ?? false}
         replace={replace}
         passHref
      >
         <Tag as='a' display='inline-flex' {...linkProps}>
            {children}
            {shouldRemoveIcon === false && isExternal === true && (
               <ChakraIcon as={MdOpenInNew} ml='0.2em' />
            )}
         </Tag>
      </NextLink>
   );
}
