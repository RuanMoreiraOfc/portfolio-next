import { keyframes } from '@chakra-ui/react';

import type { BoxProps } from '@chakra-ui/react';
import { Box, Icon } from '@chakra-ui/react';
import { BsFillHandIndexFill } from 'react-icons/bs';

export default ScrollWithFingerTutorial;
export type { ScrollWithFingerTutorialProps };

type ScrollWithFingerTutorialProps = {} & TutorialProps & BoxProps;

function ScrollWithFingerTutorial(props: ScrollWithFingerTutorialProps) {
   return (
      <Box animation={`${animationName} 3s ease-out infinite`} {...props}>
         <Icon //
            as={BsFillHandIndexFill}
            fontSize='9xl'
            color='gray.50'
            filter='drop-shadow(0 0 .1em black)'
            transform='rotate(-15deg)'
         />
      </Box>
   );
}

const animationName = keyframes`
   from {
      left: 60%;
      opacity: 0;
   }
   20%, 50% {
      opacity: 1;
   }
   to {
      left: 10%;
      opacity: 0;
   }
`;
