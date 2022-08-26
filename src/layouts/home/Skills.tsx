import type { FunctionComponent } from 'react';

import { useState, useCallback } from 'react';

import type { TableCellProps } from '@chakra-ui/react';
import {
   Box,
   Flex,
   Grid,
   Heading,
   Button,
   Icon,
   Table,
   Text,
   Th,
   Thead,
   Tbody,
   Td,
   Tr,
} from '@chakra-ui/react';
import type { IconType } from 'react-icons';
import { AiFillSmile } from 'react-icons/ai';
import { ImNeutral2 } from 'react-icons/im';
import { BsFillEmojiSunglassesFill } from 'react-icons/bs';
import {
   SiPhp,
   SiNodedotjs,
   SiNextdotjs,
   SiElixir,
   SiHtml5,
   SiCss3,
   SiChakraui,
   SiReact,
   SiSass,
   SiJavascript,
   SiTypescript,
} from 'react-icons/si';

import type { HomeLayout } from '@layouts/home/abstract/layout';
import InvisibleText from '@components/InvisibleText';

export default Skills;
export type { SkillsProps };

type SkillsProps = {} & HomeLayout<'skills'>;

function Skills({ id, translation, ...props }: SkillsProps) {
   const [showAll, setShowAll] = useState(false);

   const displayAfterMd = showAll ? 'revert' : 'md';
   const displayAfterSm = showAll ? 'revert' : 'sm';
   const borderWidthAfterToggle = showAll
      ? undefined
      : { base: '0', sm: '0 0 1px .2em' };

   const onClickHandler = useCallback(
      () => setShowAll((oldState) => !oldState),
      [],
   );

   const CustomTDCell = TDCell.bind(null) as FunctionComponent<TDCellProps>;
   CustomTDCell.defaultProps = {
      usedInThisProjectTitle: translation.table.title,
   };

   return (
      <Grid
         as='section'
         id={id}
         data-limited-box='expanded'
         minH='100vh'
         pt='32'
         pb='16'
         bgColor='neutral.800'
         color='white'
         alignContent='center'
         gap='8'
         {...props}
      >
         <Flex gap='8' align='center' justify='space-between' flexWrap='wrap'>
            <Heading as='h2'>{translation.topic}</Heading>
            <Button
               display={{ md: 'none' }}
               colorScheme='blue'
               onClick={onClickHandler}
               aria-pressed={showAll}
            >
               {translation.btnToggle.content}{' '}
               {showAll
                  ? translation.btnToggle.active
                  : translation.btnToggle.inactive}
            </Button>
         </Flex>
         <Box
            overflowX='auto'
            sx={{
               '--thumb-color': 'var(--chakra-colors-neutral-500)',
               '--track-color': 'var(--chakra-colors-neutral-400)',

               msScrollbarArrowColor: 'transparent',
               msScrollbarFaceColor: 'var(--thumb-color)',
               msScrollbarHighlightColor: 'var(--track-color)',

               scrollbarWidth: 'thin',
               scrollbarColor: 'var(--thumb-color) var(--track-color)',

               '&::-webkit-scrollbar': {
                  h: '8px',
               },
               '&::-webkit-scrollbar-thumb': {
                  background: 'var(--thumb-color)',
               },
               '&::-webkit-scrollbar-track': {
                  background: 'var(--track-color)',
               },
            }}
         >
            <Table aria-rowcount={4} aria-colcount={4}>
               <Thead>
                  <Tr aria-rowindex={1}>
                     <THCell
                        aria-colindex={1}
                        scope='row'
                        role='rowheader'
                        minW='52'
                        color='blue.200'
                        display={displayAfterSm}
                     >
                        {translation.table.headers[0]}
                     </THCell>

                     <THCell
                        aria-colindex={2}
                        color='gray.500'
                        textAlign='center'
                        display={displayAfterMd}
                        pos='relative'
                     >
                        <Icon as={ImNeutral2} fontSize='2xl' />
                        <InvisibleText>
                           {translation.table.headers[1]}
                        </InvisibleText>
                     </THCell>
                     <THCell
                        aria-colindex={3}
                        color='yellow.200'
                        textAlign='center'
                        display={displayAfterMd}
                        pos='relative'
                     >
                        <Icon as={AiFillSmile} fontSize='26' />
                        <InvisibleText>
                           {translation.table.headers[2]}
                        </InvisibleText>
                     </THCell>
                     <THCell
                        aria-colindex={4}
                        color='yellow.400'
                        textAlign='center'
                        display={displayAfterSm}
                        pos='relative'
                     >
                        <Icon as={BsFillEmojiSunglassesFill} fontSize='2xl' />
                        <InvisibleText>
                           {translation.table.headers[3]}
                        </InvisibleText>
                     </THCell>
                  </Tr>
               </Thead>
               <Tbody>
                  <Tr aria-rowindex={2}>
                     <THCell
                        scope='row'
                        role='rowheader'
                        color='blue.200'
                        display={displayAfterSm}
                     >
                        Backend
                     </THCell>

                     <CustomTDCell //
                        icons={[{ icon: SiPhp, text: 'PHP' }]}
                        display={displayAfterMd}
                     />
                     <CustomTDCell //
                        icons={[{ icon: SiNodedotjs, text: 'NodeJS' }]}
                        display={displayAfterMd}
                     />
                     <CustomTDCell //
                        icons={[{ icon: SiElixir, text: 'Elixir' }]}
                        borderWidth={borderWidthAfterToggle}
                     />
                  </Tr>
                  <Tr aria-rowindex={3}>
                     <THCell
                        scope='row'
                        role='rowheader'
                        color='blue.200'
                        display={displayAfterSm}
                     >
                        Frontend
                     </THCell>
                     <CustomTDCell //
                        icons={[]}
                        display={displayAfterMd}
                     />
                     <CustomTDCell //
                        icons={[
                           { icon: SiHtml5, text: 'Html5' },
                           { icon: SiCss3, text: 'Css3' },
                        ]}
                        display={displayAfterMd}
                     />
                     <CustomTDCell //
                        icons={[
                           {
                              icon: SiChakraui,
                              text: 'ChakraUI',
                              usedInThisProject: true,
                           },
                           {
                              icon: SiReact,
                              text: 'React',
                           },
                           { icon: SiSass, text: 'Sass' },
                        ]}
                        borderWidth={borderWidthAfterToggle}
                     />
                  </Tr>
                  <Tr aria-rowindex={4}>
                     <THCell
                        scope='row'
                        role='rowheader'
                        color='blue.200'
                        display={displayAfterSm}
                     >
                        Fullstack
                     </THCell>
                     <CustomTDCell //
                        icons={[]}
                        display={displayAfterMd}
                     />
                     <CustomTDCell //
                        icons={[{ icon: SiJavascript, text: 'Javascript' }]}
                        display={displayAfterMd}
                     />
                     <CustomTDCell //
                        icons={[
                           {
                              icon: SiNextdotjs,
                              text: 'NextJS',
                              usedInThisProject: true,
                           },
                           {
                              icon: SiTypescript,
                              text: 'Typescript',
                              usedInThisProject: true,
                           },
                        ]}
                        borderWidth={borderWidthAfterToggle}
                     />
                  </Tr>
               </Tbody>
            </Table>
         </Box>
      </Grid>
   );
}

type CellProps = TableCellProps & {
   as?: never;
   display?: TableCellProps['display'] | 'sm' | 'md';
};

const getDisplay = (display: TableCellProps['display'] | 'sm' | 'md') =>
   display !== 'sm' && display !== 'md'
      ? display
      : { base: 'none', [display]: 'revert' };

type THCellProps = CellProps;

function THCell({ display, ...props }: THCellProps) {
   return (
      <Th //
         role='columnheader'
         scope='col'
         display={getDisplay(display)}
         {...props}
      />
   );
}

type TDCellProps = {
   icons: Array<Omit<CellIconProps, 'usedInThisProjectTitle'>>;
   usedInThisProjectTitle?: string;
} & CellProps;

function TDCell({
   display,
   usedInThisProjectTitle,
   icons,
   ...props
}: TDCellProps) {
   return (
      <Td //
         borderInlineStart='.2em solid currentColor'
         transition='unset'
         display={getDisplay(display)}
         {...props}
      >
         <Flex w='min-content' gap='2' m='auto'>
            {icons?.map((iconProps) => (
               <CellIcon
                  key={iconProps.text}
                  usedInThisProjectTitle={usedInThisProjectTitle}
                  {...iconProps}
               />
            ))}
         </Flex>
      </Td>
   );
}

type CellIconProps = {
   icon: IconType;
   text: string;
   usedInThisProject?: boolean;
   usedInThisProjectTitle?: string;
};

function CellIcon({
   icon,
   text,
   usedInThisProject,
   usedInThisProjectTitle,
}: CellIconProps) {
   const boxShadow = `
drop-shadow(0 0 .1em var(--chakra-colors-blue-500))`;

   const usedInThisProjectSentence = usedInThisProject
      ? usedInThisProjectTitle
      : undefined;

   return (
      <Grid //
         id={text}
         justifyItems='center'
         gap='2'
         pos='relative'
      >
         <Box as='span' aria-hidden>
            <Icon
               as={icon}
               title={usedInThisProjectSentence}
               fontSize='6xl'
               filter={usedInThisProject ? boxShadow : undefined}
            />
         </Box>
         <Text as='span' pos='relative'>
            {text}
            {usedInThisProjectSentence && (
               <InvisibleText>({usedInThisProjectSentence})</InvisibleText>
            )}
         </Text>
      </Grid>
   );
}
