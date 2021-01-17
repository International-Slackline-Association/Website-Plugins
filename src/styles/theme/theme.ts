import { rgba } from 'polished';
import colors from './colors';

export const theme = {
  text: rgba(colors.dark, 1),
  textSecondary: rgba(colors.dark, 0.5),
  textTertiary: rgba(colors.dark, 0.3),
  textInverted: rgba(colors.white, 1),
  textInvertedSecondary: rgba(colors.blue, 1),

  textAccent: rgba(colors.red, 1),

  background: rgba(colors.white, 1),
  backgroundOverlay: rgba(colors.dark, 0.3),

  backgroundSecondary: rgba(colors.grey, 1),

  primary: rgba(colors.blue, 1),
};

export type Theme = typeof theme;
