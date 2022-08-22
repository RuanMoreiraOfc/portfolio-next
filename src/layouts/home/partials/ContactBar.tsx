import { useRouter } from 'next/router';

import type { FlexProps } from '@chakra-ui/react';
import { Flex, Button, Icon } from '@chakra-ui/react';
import { BsLinkedin, BsGithub } from 'react-icons/bs';
import { MdOutlineAlternateEmail } from 'react-icons/md';
import SafeLink from '@components/SafeLink';

import { HomeLayout } from '@layouts/home/abstract/layout';

export default ContactBar;
export type { ContactBarProps };

type ContactBarProps = {
   translation: HomeLayout<'partials'>['translation']['contactBar'];
} & FlexProps;

ContactBar.defaultProps = {
   sx: {},
};

function ContactBar({ translation, sx, ...props }: ContactBarProps) {
   const { locale } = useRouter();

   return (
      <Flex
         color='white'
         textShadow='.05em .05em .5em var(--chakra-colors-blackAlpha-700)'
         flexWrap='wrap'
         alignItems='center'
         alignContent='flex-end'
         justifyContent={{ base: 'center', sm: 'right' }}
         gap='3'
         sx={{
            ...sx,
            '& > *': Object.assign({}, (sx as any)['& > *'], {
               filter: 'drop-shadow(0 0 .25em black)',
            }),
         }}
         {...props}
      >
         <SafeLink
            to='https://linkedin.com/in/ruanmoreiraofc'
            isSelfExternal
            shouldRemoveIcon
            title={`${translation.btnSocialMediaTitle} Linkedin`}
         >
            <Icon //
               as={BsLinkedin}
               color='linkedin.700'
               fontSize='4xl'
            />
         </SafeLink>
         <SafeLink
            to='mailto:ruanmoreiraofc@hotmail.com'
            isSelfExternal
            shouldRemoveIcon
            title={`${translation.btnEmailTitle} Email`}
         >
            <Icon
               as={MdOutlineAlternateEmail}
               color='blue.200'
               fontSize='4xl'
               transform='scale(1.2)'
            />
         </SafeLink>
         <SafeLink
            to='https://github.com/ruanmoreiraofc'
            isSelfExternal
            shouldRemoveIcon
            title={`${translation.btnSocialMediaTitle} Github`}
         >
            <Icon //
               as={BsGithub}
               fontSize='4xl'
            />
         </SafeLink>
         <Button //
            as='a'
            href={`/api/resume?lang=${locale}`}
            target='_blank'
            download
            colorScheme='blackAlpha'
         >
            {translation.btnResume}
         </Button>
      </Flex>
   );
}
