import { translate } from '@lib/translatePage';

import { isNull } from 'util';
import type { NextPage, GetStaticProps } from 'next';

import { Fragment } from 'react';
import Head from 'next/head';

import type { HomeLayoutGroup } from '@layouts/home/abstract/layout';
import Intro from '@layouts/home/Intro';

export default Home as NextPage;
export { getStaticProps };
export type { HomeProps };

type HomeStaticProps = {
   translation: HomeLayoutGroup;
};

type HomeProps = {} & HomeStaticProps;

function Home({ translation }: HomeProps) {
   const pageTitle = `${translation.page.title} | Ruan Moreira`;

   return (
      <Fragment>
         <Head>
            <title>{pageTitle}</title>
         </Head>

         <Intro
            translation={{
               ...translation.intro,
               contactBar: translation.partials.contactBar,
            }}
         />
      </Fragment>
   );
}

const getStaticProps: GetStaticProps<HomeStaticProps> = async (ctx) => {
   const translation = await translate<HomeLayoutGroup>('home', ctx);

   if (isNull(translation)) {
      return {
         notFound: true,
      };
   }

   return {
      props: {
         translation,
      },
      revalidate: 60 * 60 * 24 * 7, // 7 day(s)
   };
};
