import type { CSSObject } from '@emotion/react';

import { keyframes } from '@emotion/react';

import type { BoxProps } from '@chakra-ui/react';
import { Box } from '@chakra-ui/react';
import type { SafeLinkProps } from '@components/SafeLink';
import SafeLink from '@components/SafeLink';

export default Orb;
export type { OrbProps };

type OrbDefaultProps = {
   initialPercentageInDecimal: number;
   orb: {
      size: `${number}em`;
   };
   wave: {
      size: `${number}em`;
      clipPath: string;
   };
};

type OrbProps = {} & OrbDefaultProps & Pick<SafeLinkProps, 'to'> & BoxProps;

const defaultProps: Readonly<OrbDefaultProps> = Object.freeze({
   initialPercentageInDecimal: 0,
   orb: {
      size: '4em',
   },
   wave: {
      size: '3em',
      clipPath:
         'polygon(0% 65%, 1% 64.95%, 2% 64.8%, 3% 64.6%, 4% 64.3%, 5% 63.9%, 6% 63.45%, 7% 62.9%, 8% 62.25%, 9% 61.55%, 10% 60.8%, 11% 59.95%, 12% 59.05%, 13% 58.1%, 14% 57.1%, 15% 56.05%, 16% 55%, 17% 53.9%, 18% 52.8%, 19% 51.65%, 20% 50.5%, 21% 49.35%, 22% 48.2%, 23% 47.05%, 24% 45.9%, 25% 44.8%, 26% 43.75%, 27% 42.75%, 28% 41.75%, 29% 40.8%, 30% 39.9%, 31% 39.1%, 32% 38.35%, 33% 37.65%, 34% 37.05%, 35% 36.5%, 36% 36.05%, 37% 35.65%, 38% 35.35%, 39% 35.15%, 40% 35.05%, 41% 35%, 42% 35.05%, 43% 35.2%, 44% 35.45%, 45% 35.75%, 46% 36.15%, 47% 36.65%, 48% 37.2%, 49% 37.85%, 50% 38.55%, 51% 39.35%, 52% 40.2%, 53% 41.1%, 54% 42.05%, 55% 43.05%, 56% 44.1%, 57% 45.15%, 58% 46.3%, 59% 47.4%, 60% 48.55%, 61% 49.7%, 62% 50.85%, 63% 52%, 64% 53.15%, 65% 54.25%, 66% 55.35%, 67% 56.4%, 68% 57.45%, 69% 58.4%, 70% 59.35%, 71% 60.2%, 72% 61.05%, 73% 61.8%, 74% 62.45%, 75% 63.05%, 76% 63.6%, 77% 64.05%, 78% 64.4%, 79% 64.7%, 80% 64.85%, 81% 65%, 82% 65%, 83% 64.9%, 84% 64.75%, 85% 64.5%, 86% 64.2%, 87% 63.75%, 88% 63.25%, 89% 62.7%, 90% 62.05%, 91% 61.3%, 92% 60.5%, 93% 59.65%, 94% 58.75%, 95% 57.8%, 96% 56.8%, 97% 55.75%, 98% 54.65%, 99% 53.55%, 100% 52.4%, 100% 100%, 0% 100%)',
   },
} as OrbDefaultProps);

Orb.defaultProps = defaultProps;

function Orb({
   to,
   children,
   initialPercentageInDecimal,
   orb: {
      size, //
   },
   wave: {
      size: waveSize, //
      clipPath,
   },
   ...props
}: OrbProps) {
   const SIZE_AS_RAW_NUMBER = parseFloat(size) * 16;
   const MAX_SPIKE_POINT = Math.max(...getData(clipPath));
   const MIN_SPIKE_POINT = Math.min(...getData(clipPath));
   const MAX_BOTTOM_SPACING_AS_CALC = `calc(${size} + ${waveSize} * ${MIN_SPIKE_POINT} / 100)`; // Low point at top
   const MIN_BOTTOM_SPACING_AS_CALC = `calc(-1 * (${waveSize} * ${MAX_SPIKE_POINT} / 100) / ${SIZE_AS_RAW_NUMBER})`; // Low point at bottom

   const percentageVar = `var(--percentage-in-decimal, ${initialPercentageInDecimal})`;

   const bottom = `calc((${unwrapFromCalc(
      MAX_BOTTOM_SPACING_AS_CALC,
   )} + ${unwrapFromCalc(
      MIN_BOTTOM_SPACING_AS_CALC,
   )} * -1) * ${percentageVar} + ${unwrapFromCalc(
      MIN_BOTTOM_SPACING_AS_CALC,
   )} * ${SIZE_AS_RAW_NUMBER})`;
   const rotateY = 'rotateY(var(--rotateY, 0))';
   const translateX = `translateX(calc(-100% + ${size}))`;
   const animation = keyframes`
      from {
         transform: ${rotateY} ${translateX};
      }
      50% {
         transform: ${rotateY} translateX(0%);
      }
      to {
         transform: ${rotateY} ${translateX};
      }
   `;

   const pseudoElement = {
      '--percentage-in-decimal': 'inherit',
      content: '""',
      w: '50vw',
      h: waveSize,
      bgColor: 'currentColor',
      clipPath,
      animation: `${animation} 10s infinite alternate`,
      pos: 'absolute',
      bottom,
      zIndex: -1,
      transitionProperty: 'bottom',
      transitionDuration: 'inherit',
   } as CSSObject;

   return (
      <SafeLink
         to={to}
         display='grid'
         placeItems='center'
         _hover={{ textDecor: 'none' }}
      >
         <Box
            w={size}
            h={size}
            color='green.400'
            fontSize='1rem'
            borderRadius='50%'
            boxShadow='0 0 1em .2em #0005 inset'
            bgImg='linear-gradient(to top, currentColor, currentColor)'
            bgRepeat='no-repeat'
            bgPos={`0 calc(${size} - ${bottom})`}
            transitionProperty='outline-offset, background-position'
            overflow='hidden'
            pos='relative'
            _before={{
               ...pseudoElement,
               opacity: '.5',
               left: '0',
            }}
            _after={{
               ...pseudoElement,
               right: '0',
               '--rotateY': '180deg',
               animationDelay: '2s',
               animationDirection: 'alternate-reverse',
            }}
            {...props}
         />

         {children}
      </SafeLink>
   );
}

const unwrapFromCalc = (calcExp: string) => calcExp.replace('calc', '');
const getData = (clipPathForm: string) =>
   clipPathForm
      .replace(/^.+\((.+)\)$/, (_match, group) => group)
      .split(' ')
      .filter((e, i) => (i + 1) % 2 === 0 && e.includes('100') === false)
      .map(parseFloat);
