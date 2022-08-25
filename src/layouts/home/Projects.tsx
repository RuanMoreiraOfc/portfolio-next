import { isNull, isNumber } from 'util';

import type { KeyboardEventHandler, MouseEvent } from 'react';

import { useRef, useState, useCallback } from 'react';

import { Fragment } from 'react';
import { Grid, Heading, List, ListItem, Box } from '@chakra-ui/react';

import { ThreeState as TagState } from '@components/ThreeStateButton';
import ThreeStateButton from '@components/ThreeStateButton';
import WithTutorial from '@components/hoc/WithTutorial';
import ScrollWithFingerTutorial from '@components/ScrollWithFingerTutorial';
import CountAlert from '@components/CountAlert';
import type { Project, ProjectCardProps } from '@components/impure/ProjectCard';
import ProjectCard from '@components/impure/ProjectCard';
import CarrouselButton from '@components/CarrouselButton';

import type { HomeLayout } from '@layouts/home/abstract/layout';

export default Projects;
export type { ProjectsProps };

type ProjectsProps = {
   id: HomeLayout<'projects'>['id'];
   projects: Project[];
   translation: ProjectCardProps['translation'] &
      HomeLayout<'projects'>['translation'];
};

function Projects({
   id,
   projects,
   translation: {
      tags: {
         btnToggleAll: btnToggleAllTranslation,
         ariaLabel: tagsAriaLabelTranslation,
      },
      ...translation
   },
   ...props
}: ProjectsProps) {
   const carouselRef = useRef<HTMLOListElement>(null);
   const [hasChangeOnce, setHasChangeOnce] = useState(false);
   const [carouselCanScroll, setCarouselCanScroll] = useState(true);
   const [statedTags, setStatedTags] = useState<Record<string, TagState>>(
      Object.fromEntries(
         [btnToggleAllTranslation]
            .concat(
               Array.from(
                  new Set(
                     projects.flatMap((e) => e.tags),
                     // .sort((a, b) => a.length - b.length),
                  ),
               ),
            )
            .map((e) => [e, 'active' as TagState]),
      ),
   );

   // ***

   const initTagClickHandler = useCallback(
      (tag: string) =>
         (
            event: MouseEvent<HTMLButtonElement>,
            transitionSteps: Record<TagState, TagState>,
         ) => {
            const carousel = carouselRef.current;

            if (isNull(carousel)) {
               throw new Error('No `Carousel` found');
            }

            setTimeout(
               () =>
                  setCarouselCanScroll(
                     carousel.scrollWidth > carousel.offsetWidth,
                  ),
               0,
            );
            setHasChangeOnce(true);
            setStatedTags((oldState) => {
               const oldAllTagState = oldState[btnToggleAllTranslation];

               const oldTagState = oldState[tag];
               const newTagState = transitionSteps[oldTagState];
               const newState = {
                  ...oldState,
                  [tag]: newTagState,
               };

               const allButAllTag = Object.entries(newState).filter(
                  ([key]) => key !== btnToggleAllTranslation,
               );
               const currentValuesButAllTagValue = allButAllTag.map(
                  ([key, value]) => value,
               );
               const isAllButAllTagLikewise = currentValuesButAllTagValue.every(
                  (e) => e === newTagState,
               );

               if (tag === btnToggleAllTranslation) {
                  const state = currentValuesButAllTagValue.every(
                     (e) => e === oldTagState,
                  )
                     ? newTagState
                     : oldTagState;

                  return Object.fromEntries(
                     Object.keys(oldState).map((key) => [key, state]),
                  );
               }

               return {
                  ...oldState,
                  [btnToggleAllTranslation]: isAllButAllTagLikewise
                     ? newTagState
                     : oldAllTagState,
                  [tag]: newTagState,
               };
            });
         },
      [btnToggleAllTranslation],
   );

   // ***

   const tags = Object.keys(statedTags);
   const filteredProjects = projects
      .filter((e) => e.tags.some((e) => statedTags[e] === 'inactive') === false)
      .filter((e) => e.tags.some((e) => statedTags[e] === 'active') === true);

   return (
      <Grid //
         as='section'
         id={id}
         data-limited-box='expanded'
         minH='100vh'
         pt='32'
         pb='16'
         bgColor='gray.50'
         alignContent='center'
         gap='8'
         pos='relative'
         {...props}
      >
         <Heading>{translation.topic}</Heading>

         <List
            as='ol'
            listStyleType='revert'
            aria-label={tagsAriaLabelTranslation}
            data-scrollbar='thin'
            h={'max(var(--chakra-sizes-32), 15vmin)'}
            p='1'
            overflowY='auto'
            display='flex'
            flexWrap='wrap'
            alignItems='center'
            alignContent='flex-start'
            justifyContent='center'
            gap='2'
            onKeyDown={TagsArrowMoveHandler}
         >
            {tags.map((tag) => {
               const tagState = statedTags[tag];

               return (
                  <ListItem key={tag}>
                     <ThreeStateButton
                        currentState={tagState}
                        onClick={initTagClickHandler(tag)}
                     >
                        {tag}
                     </ThreeStateButton>
                  </ListItem>
               );
            })}
         </List>

         <WithTutorial tutorial={ScrollWithFingerTutorial}>
            {({ TutorialComponent, completeTutorialHandler }) => (
               <Box //
                  minH='25rem'
                  gap='inherit'
                  pos='relative'
                  overflow='hidden'
               >
                  {hasChangeOnce && (
                     <CountAlert
                        h={filteredProjects.length ? 0 : 'full'}
                        itemsCount={filteredProjects.length}
                        noItemsMessage={translation.tagsAlert.noRepoMessage}
                        withItemsMessage={translation.tagsAlert.withRepoMessage}
                     />
                  )}

                  <List //
                     ref={carouselRef}
                     data-snapped-scroll='x'
                     p='1'
                     display='flex'
                     gap='inherit'
                     sx={{
                        [`& [data-snapped-item]`]: {
                           '--snap-at': 'center',
                           w: 'min(100%, var(--chakra-sizes-sm))',
                           flexShrink: '0',
                        },
                     }}
                     onScroll={completeTutorialHandler}
                     onKeyDown={ReposArrowMoveHandler}
                  >
                     {filteredProjects.map((data) => (
                        <ListItem key={data.name} data-snapped-item>
                           <ProjectCard
                              translation={{
                                 btnDetails: translation.btnDetails,
                                 modal: translation.modal,
                              }}
                              {...data}
                              h='full'
                           />
                        </ListItem>
                     ))}
                  </List>
                  <TutorialComponent
                     pos='absolute'
                     top='60%'
                     transform='translateY(-50%)'
                  />
               </Box>
            )}
         </WithTutorial>

         {filteredProjects.length > 1 && (
            <Fragment>
               <CarrouselButton
                  direction='left'
                  carouselRef={carouselRef}
                  top='unset'
                  // pb_parent * 4 + minH_slider / 2
                  bottom='calc(16 * 4px + 25rem / 2)'
                  left='calc(var(--chakra-space-up-to-max-content))'
               />
               <CarrouselButton
                  direction='right'
                  carouselRef={carouselRef}
                  disabled={carouselCanScroll === false}
                  top='unset'
                  // pb_parent * 4 + minH_slider / 2
                  bottom='calc(16 * 4px + 25rem / 2)'
                  right='calc(var(--chakra-space-up-to-max-content))'
               />
            </Fragment>
         )}
      </Grid>
   );
}

const TagsArrowMoveHandler: KeyboardEventHandler<HTMLOListElement> = (
   event,
) => {
   const self = event.currentTarget;
   const focusedElement = document.activeElement;

   if (
      isNull(focusedElement) ||
      self.contains(focusedElement) === false ||
      ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'] //
         .includes(event.key) === false
   ) {
      return;
   }

   event.preventDefault();

   const ITEM_SELECTOR = 'li';
   const isGoingVertically = ['ArrowUp', 'ArrowDown'].includes(event.key);
   const isGoingUp = event.key === 'ArrowUp';
   const isGoingLeft = event.key === 'ArrowLeft';

   const { x: selfX, width: selfWidth } = self.getBoundingClientRect();
   const minWidthItem = Math.min(
      ...Array.from(self.querySelectorAll(ITEM_SELECTOR)).map(
         (e) => e.clientWidth,
      ),
   );

   const isInvalid = (element: Element | null): element is null =>
      isNull(element) || self.contains(element) === false;

   const getElementFromPos = (
      (container: HTMLElement) =>
      (isInvalid: (element: Element | null) => element is null) => {
         return (reference: Element) => {
            const MINOR_DIFFERENCE = 1 / 10;
            const Y_DIFFERENCE = parseFloat(getComputedStyle(container).rowGap);
            const { y: currentLineY, height: currentLineHeight } =
               reference.getBoundingClientRect();

            const getLine = (y: number) => {
               const verifyCount = selfWidth / minWidthItem;

               return Array.from(
                  new Set(
                     Array.from(
                        { length: verifyCount },
                        (_, i) =>
                           document.elementsFromPoint(
                              selfX + minWidthItem * i,
                              y,
                           )[1],
                     ),
                  ),
               ).filter((e) => !isInvalid(e) && e !== container);
            };

            const thisLine = getLine(currentLineY);
            const thisLineIndex = thisLine.findIndex((e) =>
               e.contains(reference),
            );

            const getElementFromRelativeY = (relativeY: number) => {
               const nextLineY =
                  relativeY +
                  (relativeY < 0
                     ? currentLineY - MINOR_DIFFERENCE
                     : currentLineY + currentLineHeight);

               const { length: nextLineCount, ...nextLineArrayLike } =
                  getLine(nextLineY);

               const index =
                  thisLineIndex > nextLineCount - 1
                     ? nextLineCount - 1
                     : thisLineIndex;

               return (
                  ((nextLineArrayLike[index] ?? null) as HTMLElement) || null
               );
            };

            return {
               aboveElementSibling: getElementFromRelativeY(-Y_DIFFERENCE),
               belowElementSibling: getElementFromRelativeY(Y_DIFFERENCE),
            };
         };
      }
   )(self)(isInvalid);

   const focusOnButton = ((container: HTMLElement) => {
      const items = Array.from(
         container.querySelectorAll<HTMLElement>(ITEM_SELECTOR),
      );

      return (
         item: HTMLElement | null,
         options: ScrollIntoViewOptions = {},
      ): void => {
         const button = items.find((e) => item === e)?.querySelector('button');

         button?.focus?.({ preventScroll: true });
         button?.scrollIntoView?.({
            block: 'center',
            behavior: 'smooth',
            ...options,
         });
      };
   })(self);

   const {
      previousElementSibling: prev = null,
      nextElementSibling: next = null,
   } = (focusedElement.closest(ITEM_SELECTOR) ?? {}) as {
      previousElementSibling?: HTMLElement | null;
      nextElementSibling?: HTMLElement | null;
   };

   const {
      aboveElementSibling: above = null,
      belowElementSibling: below = null,
   } = getElementFromPos(focusedElement);

   const isPrevInvalid = isInvalid(prev);
   const isNextInvalid = isInvalid(next);
   const isAboveInvalid = isInvalid(above);
   const isBelowInvalid = isInvalid(below);

   if (isPrevInvalid && isNextInvalid && isAboveInvalid && isBelowInvalid) {
      return;
   }

   verticallyCheck: {
      if (isGoingVertically === false) {
         break verticallyCheck;
      }

      if (isAboveInvalid && isGoingUp) {
         return;
      }

      if (isBelowInvalid && isGoingUp === false) {
         return;
      }

      if (isGoingUp) {
         focusOnButton(above);
         return;
      }

      focusOnButton(below);
      return;
   }

   if (isPrevInvalid && isGoingLeft) {
      return;
   }

   if (isNextInvalid && isGoingLeft === false) {
      return;
   }

   if (isGoingLeft) {
      focusOnButton(prev);
      return;
   }

   focusOnButton(next);
};

const ReposArrowMoveHandler: KeyboardEventHandler<HTMLUListElement> = (
   event,
) => {
   const self = event.currentTarget;
   const focusedElement = document.activeElement;

   if (
      isNull(focusedElement) ||
      self.contains(focusedElement) === false ||
      ['ArrowLeft', 'ArrowRight'] //
         .includes(event.key) === false
   ) {
      return;
   }

   event.preventDefault();

   const ITEM_SELECTOR = '[data-snapped-item]';
   const isGoingLeft = event.key === 'ArrowLeft';

   const focusOnButton = ((container: HTMLElement) => {
      const items = Array.from(
         container.querySelectorAll<HTMLElement>(ITEM_SELECTOR),
      );

      return (
         item: HTMLElement | null | number,
         options: ScrollIntoViewOptions = {},
      ): void => {
         const button = (
            isNumber(item) ? items.at(item) : items.find((e) => item === e)
         )?.querySelector('button');

         button?.focus?.({ preventScroll: true });
         button?.scrollIntoView?.({
            inline: 'center',
            behavior: 'smooth',
            ...options,
         });
      };
   })(self);

   const {
      previousElementSibling: prev = null,
      nextElementSibling: next = null,
   } = (focusedElement.closest(ITEM_SELECTOR) ?? {}) as {
      previousElementSibling?: HTMLElement | null;
      nextElementSibling?: HTMLElement | null;
   };

   const isPrevInvalid = isNull(prev);
   const isNextInvalid = isNull(next);

   if (isPrevInvalid && isNextInvalid) {
      return;
   }

   if (isPrevInvalid && isGoingLeft) {
      focusOnButton(-1);
      return;
   }

   if (isNextInvalid && isGoingLeft === false) {
      focusOnButton(0);
      return;
   }

   if (isGoingLeft) {
      focusOnButton(prev);
      return;
   }

   focusOnButton(next);
};
