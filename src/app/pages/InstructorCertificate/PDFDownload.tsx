import React, { memo } from 'react';
import styled from 'styled-components/macro';
import { touchableOpacity } from 'styles/mixins';

const PDFDownloadLink = styled.a`
  color: ${props => props.theme.primary};
  text-decoration: underline;
  font-weight: bold;
  ${touchableOpacity};
`;

interface Props {
  languages: string[];
  onClick(language: string): void;
}

function Component(props: Props) {
  function onItemClick(language: string) {
    return e => {
      props.onClick(language);
    };
  }
  return (
    <Wrapper>
      {props.languages.map((l, index) => (
        <React.Fragment key={l}>
          <PDFDownloadLink onClick={onItemClick(l)}>{l}</PDFDownloadLink>
          {index !== props.languages.length - 1 && <span>|</span>}
        </React.Fragment>
      ))}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  & span {
    margin-right: 1px;
    margin-left: 1px;
  }
`;

export const CertificateDownloadButton = memo(Component);
