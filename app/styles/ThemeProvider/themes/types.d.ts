export interface IThemesInterface {
  default: IThemeInterface;
}

interface IThemeInterface {
  name: keyof IThemesInterface;

  text: string;
  textSecondary: string;
  textTertiary: string;
  textInverted: string;
  textAccent: string;
  textInvertedSecondary: string;

  background: string;
  backgroundSecondary: string;

  primary: string;

}
