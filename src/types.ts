

type Value = string;

export interface Theme {
  [theme: string]: Value;
}

export interface DesignToken {
  name: string;
  value: Value;
  theme?: Theme;
  namespace: string;
  category?: 'color' | 'elevation' | 'motion' | 'font-weight' | 'opacity' | 'scale';
  properties?: string[];
  // comment?: string; // TODO
}
