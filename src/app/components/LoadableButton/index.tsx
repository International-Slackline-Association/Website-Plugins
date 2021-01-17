import styled, { css, keyframes } from 'styled-components/macro';
import { lighten, rgba } from 'polished';
import { StyledProps } from 'styled-components';

interface Props {
  isLoading: boolean;
}
const buttonLoadingAnimtionSpin = keyframes`
  100% {
    transform: rotate(360deg);
  }
`;

export const LoadableButton = styled.button<Props>`
  display: block;
  border: none;
  background-color: ${props => props.theme.primary};
  border-radius: 3px;
  font-weight: 600;
  padding: 1em 2em;
  outline: none;
  cursor: pointer;
  transition: all 0.2s;
  color: ${props => props.theme.textInverted};
  user-select: none;
  position: relative;

  ${props =>
    props.isLoading &&
    css`
      background-color: ${(p: StyledProps<Props>) =>
        `${lighten(0.05, p.theme.primary)} !important`};
      color: rgba(0, 0, 0, 0) !important;

      &::after {
        position: absolute;
        display: block;
        content: '';
        width: 1em;
        height: 1em;
        border: 2px solid ${p => rgba(p.theme.textInverted, 0.1)};
        border-top-color: ${p => p.theme.textInverted};
        border-left-color: ${p => p.theme.textInverted};
        border-radius: 50%;
        animation: ${buttonLoadingAnimtionSpin} 0.75s linear infinite;
        top: 50%;
        left: 50%;
        margin-top: -0.5em;
        margin-left: -0.5em;
      }
    `} &:hover {
    transition: all 0.2s;
    background-color: ${props => lighten(0.05, props.theme.primary)};
  }

  &:active {
    transition: none;
    background-color: ${props => lighten(0.1, props.theme.primary)};
    color: ${props => rgba(props.theme.textInverted, 0.4)};
  }

  &:disabled {
    background-color: ${props => rgba(props.theme.primary, 0.4)};
    color: ${props => rgba(props.theme.textInverted, 0.4)};
    cursor: default;
  }

  &:focus {
    outline: none;
  }
`;
