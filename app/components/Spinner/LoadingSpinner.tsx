import styled, { keyframes } from 'styles/styled-components';
import { rgba } from 'polished';

const loadingAnimationSpin = keyframes`
  100% {
    transform: rotate(360deg);
  }
`;

export const LoadingSpinner = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  /* position: absolute; */
  top: 0;
  left: 0;

  &::after {
    display: block;
    content: '';
    width: 25px;
    height: 25px;
    border: 2px solid
      ${props => props.theme.primary && rgba(props.theme.primary, 0.1)};
    border-top-color: ${props => props.theme.primary};
    border-radius: 50%;
    animation: ${loadingAnimationSpin} 1s linear infinite;
  }
`;
