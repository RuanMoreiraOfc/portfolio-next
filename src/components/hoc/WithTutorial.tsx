import type { OmitDistributive } from '@~types/omitDistributive';
import type { FunctionComponent, ReactElement } from 'react';

import { useState, useCallback } from 'react';
import { useMediaQuery } from '@chakra-ui/react';

export default WithTutorial;
export type { WithTutorialProps, TutorialProps };

type Devices = 'mobile' | 'desktop' | 'both';
declare global {
   type TutorialProps = {
      'data-tutorial'?: Devices;
   };
}
type TImplementation = TutorialProps;

type TutorialComponentProps<T extends TImplementation> = {
   showOn?: Devices;
} & Partial<TutorialProps> &
   OmitDistributive<T, keyof TutorialProps>;

type WithTutorialProps<T extends TImplementation> = {
   tutorial: FunctionComponent<T>;
   children: (options: {
      selector: string;
      completeTutorialHandler: (() => void) | undefined;
      TutorialComponent: FunctionComponent<TutorialComponentProps<T>>;
   }) => ReactElement<T>;
};

function WithTutorial<T extends TutorialProps>({
   tutorial: TutorialBaseComponent,
   children,
}: WithTutorialProps<T>) {
   const [isOnTutorial, setIsOnTutorial] = useState(true);

   const completeTutorialHandler = useCallback(() => {
      setIsOnTutorial(false);
   }, []);

   // ***

   const TutorialComponent: FunctionComponent<TutorialComponentProps<T>> = ({
      showOn,
      'data-tutorial': dataTutorial,
      ...props
   }: TutorialComponentProps<T>) => {
      const [isOnDeviceWithNoMouse] = useMediaQuery('(pointer: coarse)');

      if (isOnTutorial === false) return null;
      if (showOn === 'mobile' && isOnDeviceWithNoMouse === false) return null;
      if (showOn === 'desktop' && isOnDeviceWithNoMouse === true) return null;

      return (
         <TutorialBaseComponent
            {...(props as unknown as T)}
            data-tutorial={showOn ?? dataTutorial}
         />
      );
   };

   TutorialComponent.defaultProps = {
      showOn: 'mobile',
   } as Partial<TutorialComponentProps<T>>;

   return children({
      selector: '[data-tutorial]',
      TutorialComponent,
      completeTutorialHandler: isOnTutorial
         ? completeTutorialHandler
         : undefined,
   });
}
