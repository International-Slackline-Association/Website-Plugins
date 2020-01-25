export interface IBreakpoints {
  isStandalone: any;
  mobile: number;
  desktop: number;
  tablet: number;
}

const breakpoints: IBreakpoints = {
  isStandalone: true,
  mobile: 0,
  desktop: 1024,
  tablet: 768,
};

export default breakpoints;
