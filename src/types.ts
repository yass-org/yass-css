

type Value = string;
export type Category = 'color' | 'scale' | 'elevation' | 'opacity';

export interface DesignToken {
  key: string;
  value: Value;
  name?: string;
  themes?: {
    [theme: string]: Value;
  };
  category?: Category;
  properties?: string[];
  customProperty?: boolean;
  meta?: object;
}

export interface CSSRules {
  [property: string]: string[];
}
