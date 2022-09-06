import WorldMapImg from '@a-images/world-map.jpg';

import { isNull } from 'util';
import type { KeyboardEventHandler, KeyboardEvent, FocusEvent } from 'react';
import { keyframes } from '@chakra-ui/react';

import { useState, useEffect, useCallback, useId, useRef } from 'react';
import { useRouter } from 'next/router';
import { useDisclosure } from '@chakra-ui/react';

import { Box, Text, List, ListItem } from '@chakra-ui/react';
import SafeLink from '@components/SafeLink';

import { AppLayout } from '@layouts/app/abstract/layout';

export default LocalePicker;
export type { LocalePickerProps };

type LocalePickerProps = AppLayout<'localePicker'>;

const mapaMundiPlaceholder =
   'data:image/png;base64,/9j/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAgADkDASIAAhEBAxEB/8QAGgAAAgMBAQAAAAAAAAAAAAAABQYDBAcCAf/EADQQAAEDAgQDBgUCBwAAAAAAAAECAwQFEQAGEiETMUEHUWFxkaEUFRciQiOBMlJUVZTR4f/EABkBAAMBAQEAAAAAAAAAAAAAAAABAgMEBf/EACERAAICAQUAAwEAAAAAAAAAAAECAAMRBBIhMVFBYXGB/9oADAMBAAIRAxEAPwDLKqmrU6zbT+nibqKQd9uRHQ/tiDK/aHV8jVybOy44wlUqOphxlSSWgro5pBCSpPS4tz23wGnZlm1hEZuUtXHbBRdGweufytvfpcYET6c9EJKglSBzUhWoDzxemqatttzfg9kk88QnV61WM6Vv4muTXps5YI4yxulI6WFgEjnsMTw6THdaslbLgsL8NJWrxPfbBzsYr+WsuVuVNzNB+KcCEiKskaWjc6jY7EkWHrjX6lnnJNQcVJpVFaVXHNDsecYrWsOjkdXUW25e+MdfqGR9gBA9HWZaopGS0zKDkSa5SW5bCo5hlwtIub/fexGk9bjuvi6/k/MUaGpUlptuKEal8RYSEp8QcWc39q6F5odiQYrKKMTaR94e/UO5W0oAaQDyG/XwwlVLN8qrNOSFoc+L4mlA1FadPP1A9ccrabUNhm+fv2Nti8DMoVSazFWWQxGdBUOJYA29Njgd8xhf25n0/wC4GulRWbqJFzbEePYq0iqoBJP9MyyZ02tTS0rQbKSdQPjh0qEqNSojLyW0qkPsoUG9X8KikEm3cD34pJ7Ps1qYLvyOUlAOkhRSlQ/Ym/XHub8t1qFLjvT2kPyJLYWpMMcRLVtgklOwNhew5YL6q72XJ6j6isSSbnmeeGuFUabGymkpdV81SVt8E3sQTsrysfbHFDyDmatp1wKWsIPJT60tA+Wog+2C30hzjf7qfHSP5jLbsPfF3rVaArno5guR8RDeLZcVwUqS3+IUbnEsAIVLabffUwwtQS44BfSO+2H+Z2P5kjcEJdpb63NiG5BsjzUUge+LbfYlmJxehqdR1rvuA+q3ncptizbWRjdDB8gCsw8unLrr1IqKzJbWAWVkkr8dwOd+ndhNxp8zsVzGwFcGZRpBTa4RJKfQqSBhd+nmYv6aP/lI/wB4zo2ICN+f2NuTnGJ//9k=';

function LocalePicker({ translation }: LocalePickerProps) {
   const selfRef = useRef<HTMLDivElement>(null);
   const router = useRouter();
   const { isOpen, onToggle, onOpen, onClose } = useDisclosure();
   const [isDisabled, setIsDisabled] = useState(false);

   useEffect(() => {
      let isRemovingLocale = false;
      const verifyIfIsRouting = (destination: string) => {
         const isWaitingFinish = isRemovingLocale === true;
         const hasNoLocaleQueryParam =
            destination.includes('locale=') === false;

         return isWaitingFinish || hasNoLocaleQueryParam;
      };
      const getLocale = (destination: string) => {
         const LOCALE_REGEX = /locale=(?<locale>.*?)(?:&|$)/g;

         return Array.from(destination.matchAll(LOCALE_REGEX))
            .map((e) => e?.groups?.locale ?? '')
            .join('');
      };

      const handleRouteChangeStart = async (destination: string) => {
         if (verifyIfIsRouting(destination)) {
            return;
         }

         // TODO: ADD COOKIE SETTER

         onClose();
         setIsDisabled(true);
      };

      const handleRouteChangeComplete = async (
         destination: string,
         options: { shallow: boolean },
      ) => {
         if (verifyIfIsRouting(destination)) {
            return;
         }

         isRemovingLocale = true;

         replacingPhase: {
            const locale = getLocale(destination);
            const destinationWithoutLocale = destination
               .replace(`/${locale}`, '/')
               .replace('//', '/');

            await router.replace(destinationWithoutLocale, undefined, {
               ...options,
               shallow: true,
               locale: false,
            });
         }

         isRemovingLocale = false;
         setIsDisabled(false);
      };

      router.events.on('routeChangeStart', handleRouteChangeStart);
      router.events.on('routeChangeComplete', handleRouteChangeComplete);

      return () => {
         router.events.off('routeChangeStart', handleRouteChangeStart);
         router.events.off('routeChangeComplete', handleRouteChangeComplete);
      };
   }, [router, onClose]);

   useEffect(() => {
      const thisAside = selfRef.current;
      const option = thisAside?.dataset.option;

      if (isNull(thisAside)) {
         throw new Error('No `Aside` found!');
      }

      if (isOpen === false) return;

      const {
         length,
         0: firstItem,
         [length - 1]: lastItem,
      } = Array.from(
         thisAside?.querySelectorAll?.(`[role=menuitem]`) || [],
      ) as Array<HTMLElement | undefined>;

      const focusOption = () => {
         if (option === 'last') {
            lastItem?.focus();
         } else {
            firstItem?.focus();
         }
      };

      thisAside.removeAttribute('data-option');
      thisAside.addEventListener('transitionend', focusOption, {
         once: true,
      });

      return () => {
         thisAside.removeEventListener('transitionend', focusOption);
      };
   }, [isOpen]);

   // ***

   const idBase = useId();
   const idMenuButton = `menu-button-${idBase}`;
   const idMenu = `menu-${idBase}`;

   const globeHeight = 'max(7.5vmin, var(--chakra-space-mobile-base) * 2)';
   const rotationAnimationName = keyframes`
      0% { background-position: 0 0; }
      100% { background-position: -230% 0 }
   `;

   const CloseMenuByBlurHandler = useCallback(
      <T extends FocusEvent<HTMLElement>>(event: T) => {
         const self = event.currentTarget;
         const currentFocusedElement = event.relatedTarget;

         if (self?.contains(currentFocusedElement)) return;

         onClose();
      },
      [onClose],
   );

   const CloseMenuByKeyboardHandler = useCallback(
      <T extends KeyboardEvent<HTMLElement>>(event: T) => {
         if (event.key !== 'Escape') return;

         onClose();
         document.getElementById(idMenuButton)?.focus?.();
      },
      [onClose, idMenuButton],
   );
   const MenuOpenByKeboardHandler = useCallback(
      (event: KeyboardEvent<HTMLElement>) =>
         initMenuOpenByKeboardHandler(onOpen)(event),
      [onOpen],
   );

   const PreventDefaultHandler = useCallback(
      <T extends Pick<Event, 'preventDefault'>>(event: T) => {
         event.preventDefault();
      },
      [],
   );

   // ***

   const getIsCurrent = useCallback(
      (locale: string) => {
         const primaryLocale = router.locale;
         const currentLocale = router.query.locale;

         return (currentLocale ?? primaryLocale) === locale;
      },
      [router.locale, router.query.locale],
   );

   const getIsDisabled = useCallback(
      (locale: string) => {
         return isDisabled || getIsCurrent(locale);
      },
      [isDisabled, getIsCurrent],
   );

   return (
      <Box
         ref={selfRef}
         as='aside'
         id={idBase}
         data-open={isOpen}
         h='0'
         zIndex='dropdown'
         pos='fixed'
         top='75%'
         left='0'
         transform='translate(var(--translateX, -100%), 0%)'
         transitionDuration='365ms'
         sx={{
            '&[data-open=true]': {
               '--translateX': '50%',
            },
         }}
         onBlur={CloseMenuByBlurHandler}
         onKeyDown={CloseMenuByKeyboardHandler}
      >
         <Box
            as='button'
            id={idMenuButton}
            h={globeHeight}
            borderRadius='50%'
            bgSize='cover'
            zIndex='-1'
            pos='absolute'
            left='100%'
            transform='translateX(-50%) rotateZ(23deg) rotateX(23deg)'
            animation={`${rotationAnimationName} 24s linear infinite paused`}
            sx={{
               '[data-open=true] > &': {
                  animationPlayState: 'running',
               },

               aspectRatio: '1/1',

               '::before, ::after': {
                  content: '""',
                  borderRadius: 'inherit',
                  bgSize: 'inherit',
                  bgPos: 'inherit',
                  pos: 'absolute',
                  inset: '0',
               },

               '&': {
                  bgImage: `url(${WorldMapImg.blurDataURL})`,
               },
               _before: {
                  bgImage: `url(${mapaMundiPlaceholder})`,
               },
               _after: {
                  bgImage: `url(${WorldMapImg.src})`,
               },
            }}
            aria-label={translation.button.label}
            aria-haspopup='true'
            aria-expanded={isOpen}
            aria-controls={idMenu}
            onClick={onToggle}
            onKeyDown={MenuOpenByKeboardHandler}
         />
         <List
            as='ul'
            id={idMenu}
            display='grid'
            gap='2'
            sx={{
               '[data-open=false] > &': {
                  visibility: 'hidden',
               },

               li: {
                  display: 'contents',

                  '& > *': {
                     fontSize: '3ch',

                     '& > :first-of-type': {
                        mt: '0.5',

                        fontSize: '90%',
                     },
                  },
               },
            }}
            role='menu'
            aria-labelledby={idMenuButton}
            aria-orientation='vertical'
            onKeyDown={MenuMoveHandler}
         >
            <ListItem role='none'>
               <SafeLink
                  to={{ query: { locale: 'pt' } }}
                  locale='pt'
                  unreachable
                  colorScheme='blackAlpha'
                  role='menuitem'
                  aria-disabled={getIsDisabled('pt')}
                  aria-current={getIsCurrent('pt')}
                  onClick={
                     getIsDisabled('pt') ? PreventDefaultHandler : undefined
                  }
               >
                  <Text as='span'>pt-</Text>
                  🇧🇷
               </SafeLink>
            </ListItem>
            <ListItem role='none'>
               <SafeLink
                  to={{ query: { locale: 'en' } }}
                  locale='en'
                  unreachable
                  colorScheme='blackAlpha'
                  role='menuitem'
                  aria-disabled={getIsDisabled('en')}
                  aria-current={getIsCurrent('en')}
                  onClick={
                     getIsDisabled('en') ? PreventDefaultHandler : undefined
                  }
               >
                  <Text as='span'>en-</Text>
                  🇺🇸
               </SafeLink>
            </ListItem>
         </List>
      </Box>
   );
}

const initMenuOpenByKeboardHandler: (
   openHandler: () => void,
) => KeyboardEventHandler<HTMLElement> = (openHandler) => {
   return Handler;

   function Handler(event: KeyboardEvent<HTMLElement>) {
      const setDataOption = (itemPosition: 'first' | 'last') =>
         (event.currentTarget.parentElement!.dataset.option = itemPosition);

      if (['ArrowUp', 'ArrowDown'].includes(event.key) === false) return;

      event.preventDefault();

      const {
         length,
         0: firstItem,
         [length - 1]: lastItem,
      } = Array.from(
         event.currentTarget.parentElement?.querySelectorAll?.(
            `[role=menuitem]`,
         ) || [],
      ) as Array<HTMLElement | undefined>;

      openHandler();

      if (event.key === 'ArrowUp') {
         // focus when button already visible
         lastItem?.focus();
         // set data to focus when become visible
         setDataOption('last');
         return;
      }

      // focus when button already visible
      firstItem?.focus();
      // set data to focus when become visible
      setDataOption('first');
   }
};

const MenuMoveHandler: KeyboardEventHandler<HTMLElement> = (event) => {
   const items: HTMLElement[] = Array.from(
      event.currentTarget?.querySelectorAll?.<HTMLElement>(`[role=menuitem]`) ||
         [],
   );

   const {
      0: firstItem, //
      [items.length - 1]: lastItem,
   } = items as Array<HTMLElement | undefined>;

   if (
      [
         'Home', //
         'End',
         'ArrowUp',
         'ArrowDown',
      ].includes(event.key) === false
   ) {
      const filteredItems = items.filter(
         (item) =>
            event.key.toLocaleLowerCase() ===
            item.textContent?.[0]?.toLocaleLowerCase(),
      );
      const index = filteredItems.findIndex(
         (item) => item === document.activeElement,
      );

      filteredItems[
         index < 0 || index > filteredItems.length - 1 ? 0 : index + 1
      ]?.focus?.();
      return;
   }

   event.preventDefault();
   if (event.key === 'Home') {
      firstItem?.focus?.();
      return;
   }

   if (event.key === 'End') {
      lastItem?.focus?.();
      return;
   }

   const ITEM_SELECTOR = 'li';

   const {
      previousElementSibling: aboveItem = null,
      nextElementSibling: belowtItem = null,
   } = (items
      .find((e) => e === document.activeElement)
      ?.closest(ITEM_SELECTOR) || {}) as {
      previousElementSibling: HTMLElement | null;
      nextElementSibling: HTMLElement | null;
   };

   // ---

   const shouldSkipToTop = lastItem === document.activeElement;
   const shouldSkipToEnd = firstItem === document.activeElement;

   // ---

   if (event.key === 'ArrowUp') {
      if (shouldSkipToEnd === true) {
         lastItem?.focus?.();
         return;
      }

      aboveItem?.querySelector<HTMLElement>('[role=menuitem]')?.focus?.();
      return;
   }

   if (shouldSkipToTop === true) {
      firstItem?.focus?.();
      return;
   }

   belowtItem?.querySelector<HTMLElement>('[role=menuitem]')?.focus?.();
};
