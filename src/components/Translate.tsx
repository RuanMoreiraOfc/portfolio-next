import type { OmitDistributive } from '@~types/omitDistributive';

import type { FC } from 'react';

import type { TextProps } from '@chakra-ui/react';
import { Text } from '@chakra-ui/react';

export default Translate;
export type { TranslateProps };

type TranslateProps = {
   children: string;
   replaceList: FC<any>[];
} & OmitDistributive<TextProps, 'children'>;

const regex = /<1>(.*?)<\/1>/g;

function Translate({ replaceList, children, ...props }: TranslateProps) {
   const contentList = (() => {
      let i = 0;

      return children.split(regex).map((childrenPart, j) => {
         if (j % 2 === 0)
            return childrenPart
               .split(/(\n)/)
               .map((fragment, fragmentIndex) =>
                  fragment.includes('\n') === false ? (
                     fragment
                  ) : (
                     <br key={`${i}${j}${fragmentIndex}`} />
                  ),
               );

         const oldIndex = i++;
         return replaceList[oldIndex]({
            key: oldIndex,
            children: childrenPart,
         });
      });
   })();

   return <Text {...props}>{contentList}</Text>;
}
