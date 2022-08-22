import type { TextProps } from '@chakra-ui/react';
import { Text } from '@chakra-ui/react';

export default InvisibleText;
export type { InvisibleTextProps };

type InvisibleTextProps = {} & TextProps;

function InvisibleText(props: InvisibleTextProps) {
   return (
      <Text
         as='span'
         h='0'
         lineHeight='0'
         overflow='hidden'
         pos='absolute'
         top='50%'
         left='50%'
         transform='translate(-50%, -50%)'
         {...props}
      />
   );
}
