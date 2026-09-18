import { Fragment } from 'react';
import Image from 'next/image';
import { Box, Flex, Grid, Heading, Text } from '@chakra-ui/react';
import Translate from '@components/Translate';

import type { HomeLayout } from '@layouts/home/abstract/layout';

export default AboutMe;
export type { AboutMeProps };

type AboutMeProps = {} & HomeLayout<'aboutMe'>;

// UTC only: local-time getters differ between server and client timezones
// (and `new Date(0).getFullYear()` is 1969 west of UTC), breaking hydration
const BIRTH_DATE = Date.UTC(2003, 1, 7, 3);
const myAge = new Date(Date.now() - BIRTH_DATE).getUTCFullYear() - 1970;

function AboutMe({ id, translation, ...props }: AboutMeProps) {
   return (
      <Grid
         as='section'
         id={id}
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
                  src={'/api/selfie'}
                  width={320}
                  height={425}
                  alt={translation.imageAlt}
                  style={{
                     maxWidth: '100%',
                     height: 'auto',
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
