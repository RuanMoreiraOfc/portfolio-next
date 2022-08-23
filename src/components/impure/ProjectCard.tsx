import FrontendSvg from '@a-icons/frontend.svg';
import FullstackSvg from '@a-icons/fullstack.svg';
import BackendSvg from '@a-icons/backend.svg';

import type { OmitDistributive } from '@~types/omitDistributive';

import { useDisclosure } from '@chakra-ui/react';
import { useId } from 'react';

import { Fragment } from 'react';
import Image from 'next/image';
import { BoxProps, Icon, ModalProps } from '@chakra-ui/react';
import {
   Box,
   Flex,
   Modal,
   ModalBody,
   ModalCloseButton,
   ModalContent,
   ModalFooter,
   ModalHeader,
   ModalOverlay,
   Text,
} from '@chakra-ui/react';
import Readme from '@components/impure/Readme';
import SafeLink from '@components/SafeLink';

export default ProjectCard;
export type { ProjectCardProps, Project };

type Project = {
   tags: string[];
   projectType: null | 'fullstack' | 'backend' | 'frontend';
   repoName: string;
   name: string;
   description: null | string;
   thumbnail: null | string;
   repoUrl: null | string;
   demoUrl: null | string;
};

type ProjectCardProps = {
   translation: {
      btnDetails: {
         ariaLabel: string;
      };
      modal: ProjectModalProps['translation'];
   };
} & Project &
   BoxProps;

function ProjectCard({
   translation,
   tags,
   projectType,
   repoName,
   name,
   description,
   thumbnail,
   demoUrl,
   repoUrl,
   ...props
}: ProjectCardProps) {
   const {
      isOpen,
      onOpen: openHandler,
      onClose: closeHandler,
   } = useDisclosure();

   // ***

   const idBase = useId();
   const idLabel = `label-${idBase}`;
   const idDescription = `description-${idBase}`;

   return (
      <Box //
         as='article'
         aria-labelledby={idLabel}
         aria-describedby={idDescription}
         borderRadius='4'
         bgColor='gray.50'
         boxShadow='0 0 2px 2px var(--chakra-colors-blackAlpha-400)'
         {...props}
      >
         <Flex //
            as='button'
            onClick={openHandler}
            aria-label={`${translation.btnDetails.ariaLabel} ${name}`}
            w='full'
            borderTopRadius='inherit'
            flexDirection='column'
            align='center'
            justify='center'
            gap='2'
            overflow='hidden'
            pos='relative'
            sx={{ aspectRatio: '16/9' }}
         >
            {thumbnail ? (
               <Image
                  layout='fill'
                  src={thumbnail}
                  alt={`${name} screenshot`}
               />
            ) : (
               projectType && (
                  <Fragment>
                     <Icon
                        as={PROJECT_TYPE_ICONS[projectType]}
                        w='min(50vw, var(--chakra-sizes-40))'
                        h='auto'
                     />
                     <Text
                        color='purple.600'
                        fontWeight='bold'
                        textTransform='capitalize'
                     >
                        {projectType} App
                     </Text>
                  </Fragment>
               )
            )}
            <ProjectModal
               translation={translation.modal}
               repoName={repoName}
               name={name}
               repoUrl={repoUrl}
               demoUrl={demoUrl}
               isOpen={isOpen}
               onClose={closeHandler}
            />
         </Flex>

         <Text
            as='h3'
            id={idLabel}
            px='4'
            py='2'
            fontWeight='bold'
            border='1px solid var(--chakra-colors-gray-300)'
            borderInline='none'
         >
            {name}
         </Text>
         <Text //
            id={idDescription}
            px='4'
            py='4'
            textAlign='justify'
         >
            {description}
         </Text>
      </Box>
   );
}

const PROJECT_TYPE_ICONS = {
   frontend: FrontendSvg,
   fullstack: FullstackSvg,
   backend: BackendSvg,
};

type ProjectModalProps = {
   translation: Record<`btnGoTo${'Code' | 'Demo' | 'Bottom' | 'Top'}`, string>;
} & OmitDistributive<ModalProps, 'children'> &
   Pick<Project, 'repoName' | 'name' | 'repoUrl' | 'demoUrl'>;

// TODO: IMPLEMENT ABORT CONTROLLER
function ProjectModal({
   repoName,
   name,
   repoUrl,
   demoUrl,
   translation,
   ...props
}: ProjectModalProps) {
   const idBase = useId();
   const idHeader = `header-${idBase}`;
   const idFooter = `footer-${idBase}`;

   return (
      <Modal {...props}>
         <ModalOverlay />
         <ModalContent
            data-limited-box='squashed'
            sx={{
               '--background-color': '#f1f1f1',
               '--color-code': 'var(--chakra-colors-blackAlpha-50)',
               '--color-mention': 'var(--chakra-colors-blackAlpha-200)',
               '--color-muted': 'var(--chakra-colors-blackAlpha-700)',
               '--border-color-muted': 'var(--chakra-colors-blackAlpha-500)',

               '& > *': {
                  bgColor: 'var(--background-color)',
               },
            }}
         >
            <ModalCloseButton />
            <ModalHeader id={idHeader}>
               {name} | README
               <SafeLink
                  to={`#${idFooter}`}
                  sx={{
                     all: 'revert',
                     mr: '8',
                     mt: '-1',
                     fontSize: 'sm',
                     textTransform: 'lowercase',
                     float: 'right',
                  }}
               >
                  [{translation.btnGoToBottom}]
               </SafeLink>
            </ModalHeader>
            <ModalBody as={Readme} repoName={repoName} />
            <ModalFooter id={idFooter} justifyContent='space-between'>
               <SafeLink
                  to={`#${idHeader}`}
                  sx={{
                     all: 'revert',
                     fontSize: 'sm',
                     fontWeight: 'bold',
                     textTransform: 'lowercase',
                     alignSelf: 'flex-end',
                  }}
               >
                  [{translation.btnGoToTop}]
               </SafeLink>
               <Flex gap='2'>
                  {repoUrl && (
                     <SafeLink to={repoUrl} colorScheme='neutral'>
                        {translation.btnGoToCode}
                     </SafeLink>
                  )}
                  {demoUrl && (
                     <SafeLink to={demoUrl} colorScheme='blue'>
                        {translation.btnGoToDemo}
                     </SafeLink>
                  )}
               </Flex>
            </ModalFooter>
         </ModalContent>
      </Modal>
   );
}
