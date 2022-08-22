import { isNull } from 'util';
import type { RefObject } from 'react';

import { useRef } from 'react';
import useScroll from '@hooks/useScroll';

import Image from 'next/image';
import { Box, Grid, Heading, Text } from '@chakra-ui/react';

import type { HomeLayout } from '@layouts/home/abstract/layout';
import type { ContactBarProps } from '@layouts/home/partials/ContactBar';
import ContactBar from '@layouts/home/partials/ContactBar';

export default Intro;
export type { IntroProps };

type IntroProps = {
   pageRef?: RefObject<HTMLElement>;
   translation: {
      contactBar: ContactBarProps['translation'];
   } & HomeLayout<'intro'>['translation'];
};

const blurDataURL =
   'data:image/jpeg;base64,/9j/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAWACADASIAAhEBAxEB/8QAGAAAAwEBAAAAAAAAAAAAAAAAAAUGBAf/xAAqEAACAQMEAQMCBwAAAAAAAAABAgMEBREABiExEhMiURRhFSNBcYGh0f/EABgBAAIDAAAAAAAAAAAAAAAAAAIGAQME/8QAJREAAQMCAwkAAAAAAAAAAAAAAQACAxEhBAUSFBUxQUOBkcHw/9oADAMBAAIRAxEAPwBrtLaEtLBEJKaRWI4BXk/xq7pbExjYJCzeIPlgdY7zqH21ZmWagqb9c6lrokK/nguxGCcgN/ePudObXWUO4bQ6ecgjaVw/08RAchjlWwAzEYGQwxnrIwdWnGw0qZAs+wTCtIzZMbjtt5V8RCxJ6GNc13rsmVIm9eBofJgg9QeOWPQGe866GYBTzrVmruHkqlBJhiRGRgqAdQO56NZqVI4/xKqWmLGnE3Kr8EKWPOccY/fUbwgHUb5QDL5XG8ZHZOLNuW9Vc7wmqhBZcrmHyA49uef0J5+cAca22Ka82OJ6ad7dO0ULVUjiAgu3AIHPAxjA+3ejRpOe4taKcz6Kdy0Eqmt+4ZLnTwPHEnnP7SzqAF6PQ/3WG8yI1XUU7J7khWR/EBcg9YbHfHxo0aNo1Xd9ZBTTwX//2Q==';

function Intro({ pageRef, translation, ...props }: IntroProps) {
   const selfRef = useRef<HTMLDivElement>(null);
   useScroll({
      axis: 'y',
      target: pageRef,
      call({ currentPercentageInDecimalScrollY }) {
         const thisSection = selfRef.current;

         if (isNull(thisSection)) {
            throw new Error('No `Intro` found!');
         }

         if (currentPercentageInDecimalScrollY === 0) {
            thisSection.style.removeProperty('z-index');
            return;
         }

         if (currentPercentageInDecimalScrollY > 0.5) {
            return;
         }

         thisSection.style.zIndex = '-1';
      },
      callDeps: [],
   });

   return (
      <Box
         ref={selfRef}
         as='section'
         w='full'
         minH='100vh'
         color='neutral.200'
         pos='relative'
         pointerEvents='none'
         sx={{
            '&:focus-within': {
               // FIXES STOPING IN NEXT SIBBLING ON SCROLL
               "&[style*='z-index'] ~ *": {
                  display: 'none',
               },
               '& > *': {
                  pos: 'absolute',
               },
            },
            '& > *': {
               pos: 'fixed',
               inset: 0,
            },
         }}
         {...props}
      >
         <Box bgColor='blue.50'>
            <Image
               src='https://images.pexels.com/photos/2695232/pexels-photo-2695232.jpeg?auto=compress&cs=tinysrgb'
               placeholder='blur'
               blurDataURL={blurDataURL}
               alt={translation.imageAlt}
               sizes='120vw'
               layout='fill'
               objectFit='cover'
               objectPosition='22.5% 35%'
            />
         </Box>
         <Grid
            pl={{ base: '0', sm: '25vmin' }}
            mb='10'
            textShadow='.05em .05em .5em var(--chakra-colors-blackAlpha-700)'
            alignContent='center'
            justifyContent={{ base: 'center', sm: 'left' }}
            sx={{
               '@media (min-aspect-ratio: 9/16)': {
                  pt: '20',
               },

               '& > *': {
                  w: 'fit-content',
                  pointerEvents: 'all',
               },
            }}
         >
            <Heading as='h1' fontSize={{ base: '10vw', sm: '4xl', md: '6xl' }}>
               Ruan Moreira
            </Heading>
            <Text
               pl='1'
               color='cyan.100'
               textShadow='.05em .05em .5em var(--chakra-colors-black)'
               fontSize={{ base: '5vw', sm: '2xl', md: '3xl' }}
            >
               {translation.expertise}
            </Text>
         </Grid>
         <ContactBar
            translation={translation.contactBar}
            pr={{ base: 'mobile-base', sm: '15vmin' }}
            pl={{ base: 'mobile-base', sm: 'auto' }}
            mb='5'
            sx={{
               '& > *': {
                  pointerEvents: 'all',
               },
            }}
         />
      </Box>
   );
}
