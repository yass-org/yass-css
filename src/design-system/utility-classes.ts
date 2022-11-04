import { base } from './tokens'


interface UtilityClassDefinition {
  name: string;
  declarations: {
    property: string;
    value: string;
  }[]
};

export const utility: UtilityClassDefinition[] = [
  {
    name: 'debug',
    declarations: [
      {
        property: 'background-color',
        value: base.color.tokens['red-900']
      },
      {
        property: 'opacity',
        value: base.opacity.tokens['10']
      },
    ],
  },
  {
    name: 'debug-red',
    declarations: [
      {
        property: 'background-color',
        value: base.color.tokens['red-900']
      },
      {
        property: 'opacity',
        value: base.opacity.tokens['10']
      },
    ],
  },
  {
    name: 'debug-orange',
    declarations: [
      {
        property: 'background-color',
        value: base.color.tokens['orange-900']
      },
      {
        property: 'opacity',
        value: base.opacity.tokens['10']
      },
    ],
  },
  {
    name: 'debug-yellow',
    declarations: [
      {
        property: 'background-color',
        value: base.color.tokens['yellow-900']
      },
      {
        property: 'opacity',
        value: base.opacity.tokens['10']
      },
    ],
  },
  {
    name: 'debug-green',
    declarations: [
      {
        property: 'background-color',
        value: base.color.tokens['red-900']
      },
      {
        property: 'opacity',
        value: base.opacity.tokens['10']
      },
    ],
  },
  {
    name: 'debug-teal',
    declarations: [
      {
        property: 'background-color',
        value: base.color.tokens['teal-900']
      },
      {
        property: 'opacity',
        value: base.opacity.tokens['10']
      },
    ],
  },
  {
    name: 'debug-blue',
    declarations: [
      {
        property: 'background-color',
        value: base.color.tokens['blue-900']
      },
      {
        property: 'opacity',
        value: base.opacity.tokens['10']
      },
    ],
  },
  {
    name: 'debug-purple',
    declarations: [
      {
        property: 'background-color',
        value: base.color.tokens['purple-900']
      },
      {
        property: 'opacity',
        value: base.opacity.tokens['10']
      },
    ],
  },
  {
    name: 'debug-pink',
    declarations: [
      {
        property: 'background-color',
        value: base.color.tokens['pink-900']
      },
      {
        property: 'opacity',
        value: base.opacity.tokens['10']
      },
    ],
  },
]

