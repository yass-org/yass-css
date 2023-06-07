

type Value = string;
export type Category = 'color' | 'scale';

export interface DesignToken {
  key: string;
  value: Value;

  name?: string;
  themes?: {
    [theme: string]: Value;
  };
  category?: Category;
  properties?: string[];
  meta?: object;
}

export interface CSSRules {
  [property: string]: string[];
}
