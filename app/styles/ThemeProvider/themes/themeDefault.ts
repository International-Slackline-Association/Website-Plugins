import {
  rgba,
  darken,
  lighten,
  setLightness,
  setSaturation,
  hsla,
} from 'polished';
import colors from './colors';
import { IThemeInterface } from './types';

export const theme: IThemeInterface = {
  name: 'default',

  text: rgba(colors.dark, 1),
  textSecondary: rgba(colors.dark, 0.5),
  textTertiary: rgba(colors.dark, 0.3),
  textInverted: rgba(colors.white, 1),
  textInvertedSecondary: rgba(colors.blue, 1),

  textAccent: rgba(colors.red, 1),

  background: rgba(colors.white, 1),
  backgroundSecondary: rgba(colors.darkWhite, 1),

  primary: rgba(colors.blue, 1),
};
