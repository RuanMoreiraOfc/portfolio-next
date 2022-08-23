import type { OmitDistributive } from '@~types/omitDistributive';

import type { MouseEvent } from 'react';

import type { ButtonProps } from '@chakra-ui/react';
import { Button, Icon } from '@chakra-ui/react';
import type { IconType } from 'react-icons';
import {
   AiOutlineCheckCircle,
   AiOutlineClose,
   AiFillApi,
} from 'react-icons/ai';

export default ThreeStateButton;
export type { ThreeStateButtonProps, State as ThreeState };

type State = 'inactive' | 'neutral' | 'active';

type ThreeStateButtonDefaultProps = {
   icons: { [key in State]?: IconType };
};

type ThreeStateButtonProps = {
   currentState: State;
   onClick: (
      event: MouseEvent<HTMLButtonElement>,
      transitionSteps: Record<State, State>,
   ) => void;
} & ThreeStateButtonDefaultProps &
   OmitDistributive<ButtonProps, 'onClick'>;

const defaultProps: ThreeStateButtonDefaultProps = {
   icons: {},
};

ThreeStateButton.defaultProps = defaultProps;

function ThreeStateButton({
   currentState,
   icons,
   children,
   onClick,
   ...props
}: ThreeStateButtonProps) {
   return (
      <Button
         display='flex'
         gap='2'
         aria-pressed={statePressingSteps[currentState]}
         colorScheme={stateColorSteps[currentState]}
         onClick={(e) => onClick(e, stateTransitionSteps)}
         {...props}
      >
         <Icon as={icons[currentState] ?? stateIconsSteps[currentState]} />{' '}
         {children}
      </Button>
   );
}

const stateTransitionSteps: Record<State, State> = {
   active: 'neutral',
   neutral: 'inactive',
   inactive: 'active',
};

const stateIconsSteps: Record<State, IconType | (() => null)> = {
   active: AiOutlineCheckCircle,
   neutral: AiFillApi,
   inactive: AiOutlineClose,
};

const stateColorSteps: Record<State, ButtonProps['colorScheme']> = {
   active: 'green',
   neutral: 'gray',
   inactive: 'red',
};

const statePressingSteps: Record<State, 'mixed' | boolean> = {
   active: true,
   neutral: 'mixed',
   inactive: false,
};
