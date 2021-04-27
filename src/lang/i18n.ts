import i18next from 'i18next';

import lv from './lv';

export const resources = {
  lv,
} as const;

type Keys<S extends string> = S extends ''
  ? []
  : S extends `${infer _}{{${infer B}}}${infer C}`
  ? [B, ...Keys<C>]
  : never;

type Interpolate<
  S extends string,
  I extends Record<Keys<S>[number], string>
> = S extends ''
  ? ''
  : S extends `${infer A}{{${infer B}}}${infer C}`
  ? `${A}${I[Extract<B, keyof I>]}${Interpolate<C, I>}`
  : never;

type Dict = typeof resources['lv']['translation'];

export const translate = <
  K extends keyof Dict,
  I extends Record<Keys<Dict[K]>[number], string>
>(
  k: K,
  args: I
): Interpolate<Dict[K], I> => i18next.t(k, args);

export default i18next.init({
  lng: 'lv',
  debug: true,
  resources,
});
