import React, { useState, useEffect } from 'react';
import styled from 'styles/styled-components';
import media from 'styles/media';
import { TextInput } from 'components/TextInput';
import { LoadableButton } from 'components/LoadableButton';
import {
  queryInstructor,
  InstructorItem,
} from '../InstructorCertificateExplorer/spreadsheet';

import { RouteComponentProps } from 'react-router';
export default function CertificateExplorer() {
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [rigger, setRigger] = useState<InstructorItem | null>();

  function updateValue(value: string) {
    setInputValue(value);
    setRigger(undefined);
  }

  async function checkInstructor(evt?: any) {
    if (evt !== undefined && evt.preventDefault) {
      evt.preventDefault();
    }

    if (inputValue) {
      setIsLoading(true);
      const rigger = await queryInstructor(inputValue);
      setIsLoading(false);
      setRigger(rigger);
    }
  }

  return (
    <Wrapper>
      <Header>
        <span>Rigger Certificate Explorer</span>
      </Header>
      <form onSubmit={checkInstructor}>
        <Input
          type="text"
          label="ID or Name of the rigger"
          onChange={updateValue}
          value={inputValue}
        />
      </form>

      <CustomLoadableButton isLoading={isLoading} onClick={checkInstructor}>
        CHECK
      </CustomLoadableButton>
      {/* <Divider show={instructor !== undefined} /> */}
      {rigger !== undefined &&
        (rigger === null || !rigger.rigger ? (
          <InvalidText>
            Cannot find the rigger &nbsp;
            <b>{inputValue}</b>
          </InvalidText>
        ) : (
          <ValidText>
            <b>{`${rigger.firstname} ${rigger.name}`}</b>
            <span>&nbsp;has a&nbsp;</span>
            {rigger.rigger ? (
              <b>{rigger.level && `${rigger.level} / `} Rigger Certificate</b>
            ) : (
              <b>{rigger.level} Certificate</b>
            )}
            <span>&nbsp;valid until&nbsp;</span>
            <b>{rigger.valid}</b>
          </ValidText>
        ))}
    </Wrapper>
  );
}

const Input = styled(TextInput)`
  width: 15rem;
`;

const ValidText = styled.span`
  display: flex;
  width: 100%;
  white-space: nowrap;
  flex-wrap: wrap;
  justify-content: center;
`;

const InvalidText = styled.span`
  display: flex;
  color: ${props => props.theme.textAccent};
  font-style: bold;
  & b {
    color: ${props => props.theme.text};
  }
`;

const CustomLoadableButton = styled(LoadableButton)`
  margin-top: 2rem;
  margin-bottom: 2rem;
  font-size: 0.8rem;
  border-radius: 2rem;
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 4rem;
  ${media.desktop`
    margin-top: 3rem;
  `};
  & span {
    /* text-transform: uppercase; */
    font-size: 1rem;
    font-weight: bold;
    text-align: center;
    letter-spacing: 0.05rem;
    margin-top: 1rem;
    color: ${props => props.theme.text};
    ${media.desktop`
      font-size: 1.5rem;
  `};
  }
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  align-self: center;
  ${media.desktop`
  `};
`;
