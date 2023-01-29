import { validateToken } from ".";
import { Category } from "../types";

describe('validateToken()', () => {
  it.each([
    [
      {
        key: undefined,
        value: 'rgb(255, 0, 0)',
        properties: ['color'],
      },
      { isValid: false, reason: 'A token must define a key' },
    ],
    [
      {
        key: '',
        value: 'rgb(255, 0, 0)',
        properties: ['color'],
      },
      { isValid: false, reason: 'A token must define a key' },
    ],
    [
      {
        key: 'color-red',
        value: '',
        properties: ['color'],
      },
      { isValid: false, reason: 'A token must define a value' },
    ],
    [
      {
        key: 'color-red',
        value: undefined,
        properties: ['color'],
      },
      { isValid: false, reason: 'A token must define a value' },
    ],
    [
      {
        key: 'color-red',
        value: 'rgb(255, 0, 0)',
      },
      { isValid: false, reason: 'A token must define either a category, or a list of properties' },
    ],
    [
      {
        key: 'color-red',
        value: 'rgb(255, 0, 0)',
        category: 'color' as Category,
      },
      { isValid: true },
    ],    
    [
      {
        key: 'color-red',
        value: 'rgb(255, 0, 0)',
        properties: ['color'],
      },
      { isValid: true },
    ],
  ])('should return %p for %p and %s', (token, expected) => {
    expect(validateToken(token)).toEqual(expected);
  })
})
