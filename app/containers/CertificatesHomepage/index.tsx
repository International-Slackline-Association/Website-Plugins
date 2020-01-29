import React from 'react';
import media from 'styles/media';
import styled from 'styles/styled-components';
import { touchableOpacity } from 'styles/mixins';
import { useDispatch } from 'react-redux';
import { push } from 'connected-react-router';

export default function CertificatsHomePage() {
  const dispatch = useDispatch();

  function itemClick(path: string) {
    return () => {
      dispatch(push(path));
    };
  }
  return (
    <Wrapper>
      <Header>ISA Certificates</Header>
      <SubHeader>Select a certificate</SubHeader>
      <Item onClick={itemClick('instructor-certificate-explorer')}>Instructor Certificates</Item>
      <Divider />
      <Item onClick={itemClick('rigger-certificate-explorer')}>Rigger Certificates</Item>
    </Wrapper>
  );
}
const Divider = styled.div`
  width: 3rem;
  height: 2px;
  border-radius: 2px;
  background-color: ${props => props.theme.textSecondary};
  margin-bottom: 1rem;
`;
const Item = styled.button`
  display: flex;
  justify-content: center;
  border: none;
  background-color: ${props => props.theme.primary};
  width: 15rem;
  border-radius: 3px;
  font-weight: bold;
  padding: 1em 2em;
  margin-bottom: 1rem;
  outline: none;
  cursor: pointer;
  transition: all 0.2s;
  color: ${props => props.theme.textInverted};
  user-select: none;
  ${touchableOpacity};
`;

const SubHeader = styled.span`
  font-size: 1rem;
  text-align: center;
  margin-bottom: 1rem;
  color: ${props => props.theme.textSecondary};
`;

const Header = styled.span`
  font-size: 1rem;
  font-weight: bold;
  text-align: center;
  letter-spacing: 0.05rem;
  margin-top: 1rem;
  margin-bottom: 2rem;

  color: ${props => props.theme.text};
  ${media.desktop`
      font-size: 1.5rem;
    `};
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  align-self: center;
  ${media.desktop`
  `};
`;
