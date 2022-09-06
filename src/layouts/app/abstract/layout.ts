import schema from 'public/locales/app/en.json';

export type { AppLayout, AppLayoutGroup };

type Internalization = Omit<Readonly<typeof schema>, '$schema'>;

type TImplementation = keyof Internalization;

type AppLayoutGroup = Readonly<Internalization>;
type AppLayout<T extends TImplementation> = {
  translation: Readonly<Internalization[T]>;
};
