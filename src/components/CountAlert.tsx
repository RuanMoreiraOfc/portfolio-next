import type { GridProps } from '@chakra-ui/react';
import { Grid, Text } from '@chakra-ui/react';
import Translate from '@components/Translate';

export default CountAlert;
export type { CountAlertProps };

type CountAlertProps = {
   itemsCount: number;
   noItemsMessage: string;
   withItemsMessage: string;
   children?: never;
} & GridProps;

function CountAlert({
   itemsCount,
   noItemsMessage,
   withItemsMessage,
   ...props
}: CountAlertProps) {
   const hasNoItems = itemsCount === 0;

   return (
      <Grid placeItems='center' {...props}>
         <Translate
            replaceList={[
               (props) => (
                  <Text as='strong' {...props}>
                     {hasNoItems ? props.children : itemsCount}
                  </Text>
               ), //
            ]}
            role={'alert'}
            color={hasNoItems === false ? 'transparent' : undefined}
         >
            {hasNoItems ? noItemsMessage : withItemsMessage}
         </Translate>
      </Grid>
   );
}
