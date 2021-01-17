import { createGlobalStyle } from 'styled-components/macro';
import { fontFamily } from './mixins';
import { media } from './media';
// import './font-face.css';

/* tslint:disable:max-line-length */
export const GlobalStyles = createGlobalStyle`
    html {
        font-size: 100%;
        height: 100%;
        width: 100%;
    }
    body {
        font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
        background-color: ${props => props.theme.background};
        height: 100%;
        width: 100%;
        color: ${p => p.theme.text};
        -webkit-font-smoothing: antialiased;
	      -moz-osx-font-smoothing: grayscale;
        /* a {
            text-decoration: none;
            color: ${p => p.theme.text};
        } */
        input, select, textarea, button {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            color: ${p => p.theme.text};
        }
    }
`;
