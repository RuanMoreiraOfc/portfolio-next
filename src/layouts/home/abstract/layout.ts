import schema from 'public/locales/home/en.json';

export type { HomeLayout, HomeLayoutGroup };

type Internalization = Omit<Readonly<typeof schema>, '$schema'>;

type TImplementation = keyof Internalization;

type HomeLayoutGroup = Readonly<Internalization>;
type HomeLayout<T extends TImplementation> = {
  translation: Readonly<Internalization[T]>;
};
