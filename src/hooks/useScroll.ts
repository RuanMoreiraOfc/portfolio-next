import { isFunction, isNumber } from 'util';
import type { RefObject } from 'react';

import { useRef, useEffect } from 'react';

export default useScroll;
export type { UseScrollProps };

type CallWithAxisExtendImplementation = 'x' | 'y' | undefined;

type CallWithAxis<TAxis extends CallWithAxisExtendImplementation> =
  TAxis extends 'x' | 'y'
    ? {
        axis: TAxis;
        call: (
          data: { target: HTMLElement } & Record<
            | `lastScroll${Uppercase<TAxis>}`
            | `currentScroll${Uppercase<TAxis>}`
            | `lastPercentageInDecimalScroll${Uppercase<TAxis>}`
            | `currentPercentageInDecimalScroll${Uppercase<TAxis>}`
            | `lastDirectionScroll${Uppercase<TAxis>}`
            | `currentDirectionScroll${Uppercase<TAxis>}`,
            number
          >,
        ) => void;
      }
    : {
        axis?: never;
        call: (data: {
          target: HTMLElement;
          lastScroll: Readonly<Record<'x' | 'y', number>>;
          currentScroll: Readonly<Record<'x' | 'y', number>>;
          lastPercentageInDecimalScroll: Readonly<Record<'x' | 'y', number>>;
          currentPercentageInDecimalScroll: Readonly<Record<'x' | 'y', number>>;
          lastDirectionScroll: Readonly<Record<'x' | 'y', number>>;
          currentDirectionScroll: Readonly<Record<'x' | 'y', number>>;
        }) => void;
      };

type Vector2 = { x: number; y: number };
const initiateXY = <T extends 'normal' | 'immutable'>(
  shouldBeFreezed: T,
  x: number | Vector2 = 0,
  y: number = 0,
): T extends 'normal' ? Vector2 : Readonly<Vector2> => {
  const obj = isNumber(x) ? { x, y } : { ...x };
  return shouldBeFreezed === 'normal' ? obj : Object.freeze(obj);
};

type UseScrollProps<
  T extends HTMLElement,
  TAxis extends CallWithAxisExtendImplementation,
> = {
  target?: RefObject<T> | (() => T | null);
  callDeps: readonly unknown[];
} & CallWithAxis<TAxis>;

function useScroll<
  T extends HTMLElement,
  TAxis extends CallWithAxisExtendImplementation = undefined,
>({ axis, target: targetElement, call, callDeps }: UseScrollProps<T, TAxis>) {
  const callRef = useRef(call);

  useEffect(
    () => {
      callRef.current = call;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    callDeps,
  );

  useEffect(() => {
    let paused = false;
    const cache = {
      scroll: initiateXY('normal'),
      dir: initiateXY('normal'),
      percent: initiateXY('normal'),
    };

    const target =
      (isFunction(targetElement) ? targetElement() : targetElement?.current) ??
      document.documentElement;

    const handler = (event: Event) => {
      if (paused === true) return;

      requestAnimationFrame(function () {
        const {
          scrollLeft,
          scrollTop,
          scrollWidth,
          scrollHeight,
          offsetWidth,
          offsetHeight,
        } = target;

        const lastScroll = initiateXY(
          'immutable', //
          cache.scroll,
        );
        const lastDirectionScroll = initiateXY(
          'immutable', //
          cache.dir,
        );
        const lastPercentageInDecimalScroll = initiateXY(
          'immutable',
          cache.percent,
        );

        const currentScroll = initiateXY(
          'immutable', //
          scrollLeft,
          scrollTop,
        );
        const currentDirectionScroll = initiateXY(
          'immutable',
          Math.sign(currentScroll.x - lastScroll.x),
          Math.sign(currentScroll.y - lastScroll.y),
        );
        const currentPercentageInDecimalScroll = initiateXY(
          'immutable',
          currentScroll.x / (scrollWidth - offsetWidth) || 0,
          currentScroll.y / (scrollHeight - offsetHeight) || 0,
        );

        cache.scroll = initiateXY('normal', currentScroll);
        cache.dir = initiateXY('normal', currentDirectionScroll);
        cache.percent = initiateXY('normal', currentPercentageInDecimalScroll);

        const getAxisInfo = (term: string, obj: any) => {
          const axisKey = axis?.toUpperCase() ?? '';
          const axisResponse = axis ?? 'valueOf';

          const object = isNumber(obj[axisResponse])
            ? obj[axisResponse]
            : Object.freeze({ ...obj[axisResponse] });

          const executeIfPossible = (term: unknown) =>
            isFunction(term) ? term() : term;

          return {
            [`${term}${axisKey}`]: executeIfPossible(object),
          };
        };

        callVerify: {
          if (axis !== undefined) {
            if (currentDirectionScroll[axis] === 0) {
              break callVerify;
            }
          }

          callRef.current({
            target,
            ...getAxisInfo('lastScroll', lastScroll),
            ...getAxisInfo('currentScroll', currentScroll),
            ...getAxisInfo('lastDirectionScroll', lastDirectionScroll),
            ...getAxisInfo('currentDirectionScroll', currentDirectionScroll),
            ...getAxisInfo(
              'lastPercentageInDecimalScroll',
              lastPercentageInDecimalScroll,
            ),
            ...getAxisInfo(
              'currentPercentageInDecimalScroll',
              currentPercentageInDecimalScroll,
            ),
          } as any);
        }

        paused = false;
      });

      paused = true;
    };

    target.addEventListener('scroll', handler);

    return () => target.removeEventListener('scroll', handler);
  }, [axis, targetElement]);
}
