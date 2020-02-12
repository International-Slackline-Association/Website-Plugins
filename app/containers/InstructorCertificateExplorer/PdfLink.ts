import React, { memo } from 'react';
import styled from 'styles/styled-components';
import media from 'styles/media';
import { touchableOpacity } from 'styles/mixins';

export const PDFDownloadLink = styled.a<{ small?: boolean }>`
  color: ${props => props.theme.primary};
  text-decoration: underline;
  font-weight: ${props => (props.small ? 'bold' : 'normal')};
  ${touchableOpacity};
`;
