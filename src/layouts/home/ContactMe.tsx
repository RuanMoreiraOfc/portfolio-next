import { Grid, Heading } from '@chakra-ui/react';
import SafeLink from '@components/SafeLink';
import Translate from '@components/Translate';

import type { HomeLayout } from '@layouts/home/abstract/layout';
import type { ContactBarProps } from '@layouts/home/partials/ContactBar';
import ContactBar from '@layouts/home/partials/ContactBar';

export default ContactMe;
export type { ContactMeProps };

type ContactMeProps = {
   id: HomeLayout<'contactMe'>['id'];
   translation: {
      contactBar: ContactBarProps['translation'];
   } & HomeLayout<'contactMe'>['translation'];
};

function ContactMe({ id, translation, ...props }: ContactMeProps) {
   return (
      <Grid
         as='section'
         id={id}
         data-limited-box='expanded'
         w='full'
         minH='100vh'
         pt='32'
         pb='16'
         bgColor='orange.200'
         pos='relative'
         pointerEvents='none'
         clipPath='inset(0)'
         sx={{
            '& > *': {
               pos: 'fixed',
               inset: 0,
            },
         }}
         {...props}
      >
         <Grid
            p='inherit'
            alignContent='center'
            gap='8'
            sx={{
               '& > *': {
                  w: 'fit-content',
                  pointerEvents: 'all',
               },
            }}
         >
            <Heading as='h2'>{translation.topic}</Heading>
            <Translate
               replaceList={[
                  (props) => (
                     <SafeLink
                        color='blue'
                        to={translation.paragraph.tags.a.href}
                        {...props}
                     />
                  ),
               ]}
            >
               {translation.paragraph.content}
            </Translate>
            <ContactBar
               translation={translation.contactBar}
               justifySelf={{ base: 'center', sm: 'flex-end' }}
               sx={{
                  '& > *': {
                     pointerEvents: 'all',
                  },
               }}
            />
         </Grid>
      </Grid>
   );
}
