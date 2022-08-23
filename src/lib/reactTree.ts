import {
  isBoolean,
  isFunction,
  isNullOrUndefined,
  isNumber,
  isString,
} from 'util';
import type {
  FunctionComponent,
  ReactElement,
  ReactFragment,
  ReactNode,
} from 'react';

export { manipulateTree, getInnerText };
export type { ManipulateCallbackOrOptions };

type ManipulationCallback<T> = (
  child: T,
  originalElement: unknown,
  depth: number,
) => ReactNode;

type Element = Exclude<ReactElement, undefined>;

type ElseCaseType =
  | 'array'
  | 'string'
  | `no-children-${'component' | 'element'}`
  | 'component-or-element';

type ManipulateCallbackOrOptions =
  | ((child: unknown) => ReactNode)
  | {
      ifArray?: ManipulationCallback<unknown[]>;
      ifString?: ManipulationCallback<string>;
      ifNoChildrenComponent?: ManipulationCallback<Element>;
      ifComponent?: ManipulationCallback<Element>;
      ifNoChildrenElement?: ManipulationCallback<Element>;
      ifElement?: ManipulationCallback<Element>;
      elseCase?: (
        type: ElseCaseType,
        child: ReactNode,
        originalElement: unknown,
        depth: number,
      ) => ReactNode;
    };

/**
 * Manipulate the tree by steps
 * @param manipulate The manipulator
 * @returns Callback that receives the target to be manipulated
 */
const manipulateTree = (manipulate: ManipulateCallbackOrOptions) => {
  return Handler;

  function Handler(
    child: ReactNode,
    original: unknown = child,
    depth: number = -1,
  ): ReactNode {
    const isReactFragment = (term: any): term is ReactFragment =>
      typeof term?.[Symbol.iterator] === 'function';

    // --------

    const newDepth = depth + 1;
    let elseCaseType: ElseCaseType = 'array';

    // ***

    if (isFunction(manipulate)) {
      return manipulate(child);
    }

    controlledCase: {
      if (Array.isArray(child)) {
        if (isFunction(manipulate.ifArray)) {
          return manipulate.ifArray(child, original, depth);
        }

        if (isFunction(manipulate.elseCase)) {
          elseCaseType = 'array';
          break controlledCase;
        }

        return child.map((e, i) =>
          Handler(
            e,
            Array.isArray(original) ? original[i] : original,
            newDepth,
          ),
        );
      }

      if (isString(child)) {
        if (isFunction(manipulate.ifString)) {
          return manipulate.ifString(child, original, depth);
        }

        if (isFunction(manipulate.elseCase)) {
          elseCaseType = 'string';
          break controlledCase;
        }
      }

      if (
        isNumber(child) ||
        isBoolean(child) ||
        isReactFragment(child) ||
        isNullOrUndefined(child) ||
        'props' in child === false
      ) {
        return [];
      }

      const childrenFromChild = child.props.children;

      if (isFunction(child.type)) {
        const resolvedComponent = (child.type as FunctionComponent<any>)({
          ...child.props,
          children: Handler(childrenFromChild, child, newDepth),
        }) as any;

        if (!childrenFromChild) {
          if (isFunction(manipulate.ifNoChildrenComponent)) {
            return manipulate.ifNoChildrenComponent(
              resolvedComponent,
              child,
              depth,
            );
          }

          if (isFunction(manipulate.elseCase)) {
            elseCaseType = 'no-children-component';
            break controlledCase;
          }
        }

        if (isFunction(manipulate.ifComponent)) {
          return manipulate.ifComponent(resolvedComponent, child, depth);
        }
      }

      if (!childrenFromChild) {
        if (isFunction(manipulate.ifNoChildrenElement)) {
          return manipulate.ifNoChildrenElement(child, original, depth);
        }

        if (isFunction(manipulate.elseCase)) {
          elseCaseType = 'no-children-element';
          break controlledCase;
        }
      }

      if (isFunction(manipulate.ifElement)) {
        const newElement = {
          ...child,
          props: {
            ...child.props,
            children: Handler(childrenFromChild, child, newDepth),
          },
        };

        return manipulate.ifElement(newElement, child, depth);
      }

      if (isFunction(manipulate.elseCase)) {
        elseCaseType = 'component-or-element';
        break controlledCase;
      }

      return Handler(childrenFromChild, child, newDepth);
    }

    return manipulate.elseCase(elseCaseType, child, original, depth);
  }
};

const getInnerText = (target: ReactNode): string => {
  const children = [
    manipulateTree({
      ifString(str) {
        return str;
      },
    })(target),
  ];

  const childrenAsString = children.flat(Infinity).join(' ');

  return childrenAsString;
};
