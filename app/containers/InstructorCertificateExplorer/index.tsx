import React, { useState, useEffect } from 'react';
import styled from 'styles/styled-components';
import media from 'styles/media';
import { TextInput } from 'components/TextInput';
import { LoadableButton } from 'components/LoadableButton';
import {
  queryInstructor,
  InstructorItem,
  preLoadData,
  getCountries,
  queryInstructorsByCountry,
} from './spreadsheet';
import { RouteComponentProps } from 'react-router';
import { Utils } from 'utils/index';
import { useDispatch } from 'react-redux';
import { replace } from 'connected-react-router';
import { ToggleSwitch } from 'components/ToggleSwitch';
import { CountryTable } from './CountryTable';

type SwitchType = 'id' | 'country';

export default function CertificateExplorer() {
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [instructor, setInstructor] = useState<InstructorItem | null>();
  const [selectedSwitch, setSelectedSwitch] = useState<SwitchType>('id');
  const [countryList, setCountryList] = useState<string[]>([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [countryInstructors, setCountryInstructors] = useState<
    InstructorItem[] | null
  >();

  function updateValue(value: string) {
    setInputValue(value);
    setInstructor(undefined);
  }

  async function checkClicked(evt?: any) {
    if (evt !== undefined && evt.preventDefault) {
      evt.preventDefault();
    }
    console.log(selectedCountry);
    if (inputValue && selectedSwitch === 'id') {
      setIsLoading(true);
      const instructor = await queryInstructor(inputValue);
      setIsLoading(false);
      setInstructor(instructor);
    } else if (selectedCountry && selectedSwitch === 'country') {
      setIsLoading(true);
      const instructors = await queryInstructorsByCountry(selectedCountry);
      setIsLoading(false);
      console.log(instructors);
      setCountryInstructors(instructors);
    }
  }

  async function toggleSelected(value: boolean) {
    if (value) {
      setIsLoading(true);
      const countries = await getCountries();
      setCountryList(countries);
      if (!selectedCountry) {
        setSelectedCountry(countries[0]);
      }
      setSelectedSwitch('country');
      setIsLoading(false);
    } else {
      setSelectedSwitch('id');
    }
  }

  function countryChanged(evt: any) {
    setSelectedCountry(evt.target.value);
  }
  return (
    <Wrapper>
      <Header>Instructor Certificate Explorer</Header>
      <SwitchLabel>Explore by</SwitchLabel>
      <Switch
        leftText={'ID/Name'}
        rightText={'Country'}
        id={'toggleCountry'}
        toggleSelected={toggleSelected}
      />
      {selectedSwitch === 'id' ? (
        <form onSubmit={checkClicked}>
          <Input
            type="text"
            label="ID or Name of the instructor"
            onChange={updateValue}
            value={inputValue}
          />
        </form>
      ) : (
        <select onChange={countryChanged} value={selectedCountry}>
          {countryList.map(country => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </select>
      )}
      <CustomLoadableButton isLoading={isLoading} onClick={checkClicked}>
        CHECK
      </CustomLoadableButton>
      {/* <Divider show={instructor !== undefined} /> */}
      {selectedSwitch === 'id'
        ? instructor !== undefined &&
          (instructor === null || !instructor.level ? (
            <InvalidText>
              Cannot find the instructor &nbsp;
              <b>{inputValue}</b>
            </InvalidText>
          ) : (
            <ValidText>
              <b>{`${instructor.firstname} ${instructor.name}`}</b>
              <span>&nbsp;has a&nbsp;</span>
              {instructor.rigger ? (
                <b>
                  {instructor.level && `${instructor.level} / `} Rigger
                  Certificate
                </b>
              ) : (
                <b>{instructor.level} Certificate</b>
              )}
              <span>&nbsp;valid until&nbsp;</span>
              <b>{instructor.valid}</b>
            </ValidText>
          ))
        : countryInstructors && (
            <CountryTable>
              <table>
                <thead>
                  <tr>
                    <td>Id</td>
                    <td>Firstname</td>
                    <td>Lastname</td>
                    <td>Certificate</td>
                    <td>Expiration Date</td>
                  </tr>
                </thead>
                <tbody>
                  {countryInstructors.map(instructor => (
                    <tr key={instructor.id}>
                      <td>{instructor.id}</td>
                      <td>{instructor.firstname}</td>
                      <td>{instructor.name}</td>
                      <td>{instructor.level}</td>
                      <td>{instructor.valid}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CountryTable>
          )}
    </Wrapper>
  );
}

const Switch = styled(ToggleSwitch)`
  margin-bottom: 2rem;
`;

const SwitchLabel = styled.span`
  font-size: 0.7rem;
  font-style: italic;
  text-align: center;
  margin-bottom: 0.5rem;
  color: ${props => props.theme.textSecondary};
`;

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