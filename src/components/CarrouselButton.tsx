import { isNull } from 'util';
import type { MouseEventHandler, RefObject } from 'react';

import { useRef, useState, useCallback } from 'react';
import useScroll from '@hooks/useScroll';

import type { ButtonProps } from '@chakra-ui/react';
import { Button, Icon } from '@chakra-ui/react';
import type { IconType } from 'react-icons';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';

export default CarrouselButton;
export type { CarrouselButtonProps };

type CarrouselButtonProps = {
   as?: IconType;
   direction: 'left' | 'right';
   carouselRef: RefObject<HTMLElement>;
} & ButtonProps;

function CarrouselButton({
   as,
   direction,
   carouselRef,
   disabled: isDisabled,
   ...props
}: CarrouselButtonProps) {
   const [disabled, setDisabled] = useState(
      direction === 'left' || Boolean(isDisabled),
   );
   const selfRef = useRef<HTMLButtonElement>(null);
   useScroll({
      axis: 'x',
      target: carouselRef,
      call({ currentPercentageInDecimalScrollX }) {
         const self = selfRef.current;

         const isStart = currentPercentageInDecimalScrollX === 0;
         const isEnd = currentPercentageInDecimalScrollX === 1;

         if (isNull(self)) {
            throw new Error(`No ${direction} \`button\` found!`);
         }

         if (direction === 'left' && isStart) {
            setDisabled(true);
            return;
         }
         if (direction === 'right' && isEnd) {
            setDisabled(true);
            return;
         }
         setDisabled(false);
      },
      callDeps: [direction],
   });

   const clickHandler: MouseEventHandler<HTMLElement> = useCallback(
      (event) => {
         const carousel = carouselRef.current;

         if (isNull(carousel)) {
            throw new Error('No `carousel` found!');
         }

         carousel.scrollLeft +=
            carousel.children[0].clientWidth *
            Number(direction === 'left' ? -1 : 1);
      },
      [direction, carouselRef],
   );

   return (
      <Button
         ref={selfRef}
         w='14'
         h='auto'
         sx={{
            aspectRatio: '1/1',
            '@media (pointer: coarse)': {
               display: 'none',
            },
         }}
         p='unset'
         borderRadius='full'
         colorScheme='green'
         fontSize='48'
         pos='absolute'
         top='50%'
         left={direction === 'left' ? 0 : undefined}
         right={direction === 'right' ? 0 : undefined}
         transform={`translate(calc(50% * ${
            direction === 'left' ? -1 : 1
         }), -50%)`}
         onClick={clickHandler}
         tabIndex={-1}
         zIndex={1}
         aria-hidden='true'
         disabled={disabled}
         {...props}
      >
         <Icon
            as={
               as ?? (direction === 'left' ? IoIosArrowBack : IoIosArrowForward)
            }
         />
      </Button>
   );
}
