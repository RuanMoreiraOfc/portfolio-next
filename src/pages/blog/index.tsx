import WriterSvg from '@a-icons/writer.svg';
import CookingSvg from '@a-icons/programming.svg';

import { translate } from '@lib/translatePage';

import { isNull } from 'util';
import type { GetStaticProps, NextPage } from 'next';

import { Grid, Heading, Icon } from '@chakra-ui/react';

import type { BlogLayoutGroup } from '@layouts/blog/abstract/layout';

export default Blog as NextPage;
export { getStaticProps };
export type { BlogProps };

type BlogStaticProps = {
   translation: BlogLayoutGroup;
};

type BlogProps = {} & BlogStaticProps;

function Blog({ translation }: BlogProps) {
   return (
      <Grid
         as='main'
         data-crop='viewport'
         data-limited-box='expanded'
         bgColor='neutral.300'
         placeItems='center'
         overflow='hidden'
      >
         <Icon
            as={WriterSvg}
            display={{ base: 'none', md: 'block' }}
            fontSize='25rem'
            justifySelf='flex-start'
         />
         <Heading //
            as='h1'
            mb={{ base: '96', md: 'revert' }}
            textShadow='.05em .025em .025em var(--chakra-colors-blackAlpha-900)'
            zIndex='1'
         >
            {translation.comingSoon}
         </Heading>
         <Icon
            as={CookingSvg}
            pos={{ base: 'fixed', md: 'static' }}
            top='50%'
            left='50%'
            transform={{ base: 'translate(-50%, -50%)', md: 'unset' }}
            fontSize='25rem'
            justifySelf='flex-end'
         />
      </Grid>
   );
}

const getStaticProps: GetStaticProps<BlogStaticProps> = async (ctx) => {
   const translation = await translate<BlogLayoutGroup>('blog', ctx);

   if (isNull(translation)) {
      return {
         notFound: true,
      };
   }

   return {
      props: {
         translation,
      },
   };
};
