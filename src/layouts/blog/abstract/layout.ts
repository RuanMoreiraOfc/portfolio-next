import schema from 'public/locales/blog/en.json';

export type { BlogLayout, BlogLayoutGroup };

type Internalization = Omit<Readonly<typeof schema>, '$schema'>;

type TImplementation = keyof Internalization;

type BlogLayoutGroup = Readonly<Internalization>;
type BlogLayout<T extends TImplementation> = {
  id: string;
  translation: Readonly<Internalization[T]>;
};
