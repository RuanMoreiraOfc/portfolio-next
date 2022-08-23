import { UnwrapArray } from '@~types/unwrap';
import { translate } from '@lib/translatePage';

import { api } from '@services/github/api';
import type {
   GetPortfolioReposInput,
   GetPortfolioReposResponse,
} from '@services/github/queries/getPortfolioRepos';
import { getPortfolioRepos } from '@services/github/queries/getPortfolioRepos';

import { isNull } from 'util';
import type { NextPage, GetStaticProps } from 'next';

import { useId, useRef } from 'react';

import { Fragment } from 'react';
import Head from 'next/head';
import { Box } from '@chakra-ui/react';

import type { HomeLayoutGroup } from '@layouts/home/abstract/layout';
import HeaderLandingPage from '@layouts/home/HeaderLandingPage';
import Intro from '@layouts/home/Intro';
import AboutMe from '@layouts/home/AboutMe';
import Skills from '@layouts/home/Skills';
import type { ProjectsProps } from '@layouts/home/Projects';
import Projects from '@layouts/home/Projects';
import ContactMe from '@layouts/home/ContactMe';

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
   const id = useId();
   const pageRef = useRef<HTMLDivElement>(null);

   // ***

   const pageTitle = `${translation.page.title} | Ruan Moreira`;
   const topicIds = translation.navigator.topics.map((e) => e.slug);

   return (
      <Fragment>
         <Head>
            <title>{pageTitle}</title>
         </Head>

         <HeaderLandingPage
            id={id}
            pageRef={pageRef}
            translation={translation.navigator}
         />

         <Box //
            ref={pageRef}
            as='main'
            data-crop='viewport'
            data-snapped-scroll='y'
         >
            <Intro
               id={topicIds[0]}
               data-snapped-item
               pageRef={pageRef}
               translation={{
                  ...translation.intro,
                  contactBar: translation.partials.contactBar,
               }}
            />
            <AboutMe //
               id={topicIds[1]}
               data-snapped-item
               translation={translation.aboutMe}
            />
            <Skills //
               id={topicIds[2]}
               data-snapped-item
               translation={translation.skills}
            />
            <Projects
               id={topicIds[3]}
               data-snapped-item
               projects={projects}
               translation={translation.projects}
            />
            <ContactMe //
               id={topicIds[4]}
               data-snapped-item
               pageRef={pageRef}
               translation={{
                  ...translation.contactMe,
                  contactBar: translation.partials.contactBar,
               }}
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

   const response = await api.query<
      GetPortfolioReposResponse,
      GetPortfolioReposInput
   >({ query: getPortfolioRepos });

   if (response.error) {
      console.error({
         where: '/',
         error: response.error,
      });

      return {
         notFound: true,
         revalidate: 60 * 5, // 5 min(s)
      };
   }

   type GithubProjectData = UnwrapArray<typeof repos>;

   const repos = response.data.profile?.repos ?? [];
   const byPriority = <T extends GithubProjectData>(...sortingList: [T, T]) => {
      const hasPriority = (rawRepo: T) =>
         Boolean(
            rawRepo?.repositoryTopics.list.find(
               (item) => item.topic.name === 'professional-project',
            ),
         );

      const isPriorityList = sortingList.map(hasPriority);
      if (isPriorityList.every((item) => item === false)) return 0;
      if (isPriorityList.every((item) => item === true)) {
         if (
            new Date(sortingList[0].updatedAt).valueOf() <
            new Date(sortingList[1].updatedAt).valueOf()
         )
            return 1;

         return -1;
      }

      if (isPriorityList[1] === true) return 1;

      return -1;
   };

   const projects: ProjectData[] = Array.from(repos)
      .sort(byPriority)
      .flatMap((repo) => {
         const name = repo.name
            .replace(/-\w*$/, '')
            .replace(/-\w|^\w/g, (match) =>
               match.toUpperCase().replace('-', ' '),
            );

         const topicList = repo.repositoryTopics.list.map(
            (item) => item.topic.name,
         );

         const projectType = (topicList.find(
            (item) =>
               item === 'fullstack' ||
               item === 'backend' ||
               item === 'frontend',
         ) ?? null) as ProjectData['projectType'];

         const tags = topicList.filter(
            (item) =>
               item !== 'portfolio-project' &&
               item !== 'professional-project' &&
               item !== 'fullstack' &&
               item !== 'backend' &&
               item !== 'frontend',
         );

         const thumbnail = repo.hasThumbnail ? repo.thumbnail : null;
         const description = repo.description || 'Description unavailable';

         return {
            projectType,
            repoName: repo.name,
            name,
            description,
            thumbnail,
            repoUrl: repo.visibility === 'PUBLIC' ? repo.url : null,
            demoUrl: repo.demoUrl,
            tags,
         };
      });

   return {
      props: {
         projects,
         translation,
      },
      revalidate: 60 * 60 * 24 * 7, // 7 day(s)
   };
};
