import { UnwrapArray } from '@~types/unwrap';
import { translate } from '@lib/translatePage';

import { isNull } from 'util';
import type { NextPage, GetStaticProps } from 'next';

import { useRef } from 'react';

import { Fragment } from 'react';
import Head from 'next/head';
import { Box } from '@chakra-ui/react';

import type { HomeLayoutGroup } from '@layouts/home/abstract/layout';
import Intro from '@layouts/home/Intro';
import AboutMe from '@layouts/home/AboutMe';
import Skills from '@layouts/home/Skills';
import type { ProjectsProps } from '@layouts/home/Projects';
import Projects from '@layouts/home/Projects';

export default Home as NextPage;
export { getStaticProps };
export type { HomeProps };

type ProjectData = UnwrapArray<ProjectsProps['projects']>;

type HomeStaticProps = {
   projects: ProjectData[];
   translation: HomeLayoutGroup;
};

type HomeProps = {} & HomeStaticProps;

function Home({ projects, translation }: HomeProps) {
   const pageRef = useRef<HTMLDivElement>(null);

   // ***

   const pageTitle = `${translation.page.title} | Ruan Moreira`;

   return (
      <Fragment>
         <Head>
            <title>{pageTitle}</title>
         </Head>

         <Box //
            ref={pageRef}
            as='main'
            data-crop='viewport'
            data-snapped-scroll='y'
         >
            <Intro
               data-snapped-item
               pageRef={pageRef}
               translation={{
                  ...translation.intro,
                  contactBar: translation.partials.contactBar,
               }}
            />
            <AboutMe //
               data-snapped-item
               translation={translation.aboutMe}
            />
            <Skills //
               data-snapped-item
               translation={translation.skills}
            />
            <Projects
               data-snapped-item
               projects={projects}
               translation={translation.projects}
            />
         </Box>
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
         projects: [],
         translation,
      },
      revalidate: 60 * 60 * 24 * 7, // 7 day(s)
   };
};
