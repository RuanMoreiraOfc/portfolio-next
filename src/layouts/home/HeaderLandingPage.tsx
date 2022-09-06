import { isNull } from 'util';
import type { RefObject } from 'react';

import { useRef } from 'react';
import useScroll from '@hooks/useScroll';

import { FlexProps, Text } from '@chakra-ui/react';
import { Flex, List, ListItem } from '@chakra-ui/react';
import Orb from '@components/Orb';

import { HomeLayout } from '@layouts/home/abstract/layout';

export default HeaderLandingPage;
export type { HeaderLandingPageProps };

type HeaderLandingPageProps = {
   pageRef: RefObject<HTMLElement>;
} & FlexProps &
   HomeLayout<'navigator'>;

function HeaderLandingPage({
   translation,
   pageRef,
   ...props
}: HeaderLandingPageProps) {
   const headerRef = useRef<HTMLDivElement>(null);
   useScroll({
      axis: 'y',
      target: pageRef,
      call({ target, currentScrollY }) {
         const header = headerRef.current;

         if (isNull(header)) {
            throw new Error('No `Header` found!');
         }

         const orbs = Array.from(
            header.querySelectorAll<HTMLElement>('[data-snapped-item]'),
         );
         const sections = Array.from(
            target.querySelectorAll<HTMLElement>('[data-snapped-item]'),
         );

         const sectionOffsetList = sections.map((item) => item.offsetHeight);

         const isOnMobile = header.scrollWidth - header.offsetWidth !== 0;
         let headerScrollX = header.scrollLeft;

         orbs.forEach((item, i, arr) => {
            const index = i + 1;
            const maxScrollCurrentItem =
               sectionOffsetList
                  .slice(0, i)
                  .reduce((acc, cur) => acc + cur, 0) +
               (sectionOffsetList[i] > target.offsetHeight
                  ? sectionOffsetList[i] - target.offsetHeight
                  : 0);

            const progressPercentageInDecimal =
               currentScrollY / maxScrollCurrentItem || 0;

            const itemsCovered = index * progressPercentageInDecimal || 1;
            const itemsCoveredCeiled = Math.ceil(itemsCovered);
            const itemsCoveredFloored = Math.floor(itemsCovered);

            const setCssVariable = (x: number) => {
               item.style.setProperty('--percentage-in-decimal', x.toFixed(2));
            };

            if (index > itemsCoveredCeiled) {
               return setCssVariable(0);
            }

            if (isOnMobile) {
               const prevItem = arr[i - 1]?.parentElement;
               const currentHeaderScrollX =
                  (prevItem?.offsetLeft || 0) - (prevItem?.offsetWidth || 0);

               headerScrollX = currentHeaderScrollX;
            }

            if (index <= itemsCoveredFloored) {
               return setCssVariable(1);
            }

            return setCssVariable(itemsCovered - itemsCoveredFloored);
         });

         header.scrollLeft = headerScrollX;
      },
      callDeps: [],
   });

   return (
      <Flex //
         ref={headerRef}
         as='header'
         data-snapped-scroll='x'
         role='banner'
         w='full'
         px='mobile-base'
         py='4'
         gap='16'
         zIndex='sticky'
         position='fixed'
         top='0'
         sx={{
            justifyContent: 'flex-start',

            '@media (min-width: 672px)': {
               justifyContent: 'space-evenly',
            },
            '& [data-snapped-item]': {
               '--snap-at': 'center',
            },
         }}
         {...props}
      >
         <nav>
            <List as='ol' display='contents' aria-label={translation.ariaLabel}>
               {translation.topics.map(({ name: topic, slug }, i) => (
                  <ListItem key={topic}>
                     <Orb
                        data-selector
                        data-snapped-item
                        initialPercentageInDecimal={i === 0 ? 1 : 0}
                        title={`${translation.title} ${topic}`}
                        to={`#${slug}`}
                        replace
                     >
                        <Text //
                           as='span'
                           color='green.700'
                           fontWeight='bold'
                           textAlign='center'
                           aria-hidden='true'
                        >
                           {topic}
                        </Text>
                     </Orb>
                  </ListItem>
               ))}
            </List>
         </nav>
      </Flex>
   );
}
