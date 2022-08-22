import { Fragment } from 'react';
import Image from 'next/image';
import { Box, Flex, Grid, Heading, Text } from '@chakra-ui/react';
import Translate from '@components/Translate';

import type { HomeLayout } from '@layouts/home/abstract/layout';

export default AboutMe;
export type { AboutMeProps };

type AboutMeProps = {} & HomeLayout<'aboutMe'>;

const myAge =
   new Date(0).getFullYear() -
   new Date(
      new Date('02/07/2003 UTC 3:00').valueOf() - Date.now(),
   ).getFullYear();

const myPhoto =
   'https://drive.google.com/uc?id=1IB8JnGFkt6CNu0I0kNp-PzjaizOy5Qcd';

function AboutMe({ translation, ...props }: AboutMeProps) {
   return (
      <Grid
         as='section'
         data-limited-box='expanded'
         minH='100vh'
         pt='32'
         pb='16'
         bgColor='gray.50'
         alignContent='center'
         gap='8'
         {...props}
      >
         <Heading as='h2'>{translation.topic}</Heading>
         <Flex
            w='full'
            flexWrap='wrap'
            alignItems='center'
            justifyContent='center'
            gap='20'
         >
            <Box
               w='min(var(--chakra-sizes-xs), calc(100vw - var(--chakra-space-mobile-base) * 2))'
               flexShrink='0'
            >
               <Image
                  src={myPhoto}
                  width={320}
                  height={425}
                  alt={translation.imageAlt}
                  layout='intrinsic'
                  style={{
                     borderRadius: '90%/35%',
                     filter: 'contrast(1.2)',
                  }}
               />
            </Box>
            <Box
               flex='1'
               minW='min(var(--chakra-sizes-xs), calc(100vw - var(--chakra-space-mobile-base) * 2))'
               textAlign='justify'
               sx={{ hyphens: 'auto' }}
            >
               <Translate
                  replaceList={[
                     (props) => (
                        <Text
                           as='abbr'
                           lang={translation.paragraph.tags.abbr.lang}
                           title={translation.paragraph.tags.abbr.title}
                           {...props}
                        />
                     ),
                     ({ key }) => <Fragment key={key}>{myAge}</Fragment>,
                  ]}
               >
                  {translation.paragraph.content}
               </Translate>
            </Box>
         </Flex>
      </Grid>
   );
}
