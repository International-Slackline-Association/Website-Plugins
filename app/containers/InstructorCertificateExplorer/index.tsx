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
import { ToggleSwitch } from 'components/ToggleSwitch';
import { CountryTable } from './CountryTable';
import { CertificateDownloadButton } from './PDFDownload';
import {
  generateInstructorCertificate,
  canGenerateCertificate,
  availableLanguages,
} from './pdfGenerator/certificateGenerator';

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
    if (inputValue && selectedSwitch === 'id') {
      setIsLoading(true);
      const instructor = await queryInstructor(inputValue);
      setIsLoading(false);
      setInstructor(instructor);
    } else if (selectedCountry && selectedSwitch === 'country') {
      setIsLoading(true);
      const instructors = await queryInstructorsByCountry(selectedCountry);
      setIsLoading(false);
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

  function downloadCertificate(instructor: InstructorItem) {
    return async (language: string) => {
      await generateInstructorCertificate({
        instructor: instructor,
        language: language,
      });
    };
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
        <Select onChange={countryChanged} value={selectedCountry}>
          {countryList.map(country => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </Select>
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
            <React.Fragment>
              <ValidText>
                <b>{`${instructor.firstname} ${instructor.name}`}</b>
                <span>&nbsp;has a&nbsp;</span>
                <b>{instructor.level} Certificate</b>
                <span>&nbsp;valid until&nbsp;</span>
                <b>{instructor.expiresAt}</b>
              </ValidText>
              {canGenerateCertificate(instructor) && (
                <React.Fragment>
                  <DownloadText>
                    Download Certificate (Select Language)
                  </DownloadText>

                  <CertificateDownloadButton
                    languages={availableLanguages(instructor)}
                    onClick={downloadCertificate(instructor)}
                  />
                </React.Fragment>
              )}
            </React.Fragment>
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
                    <td>Download Certificate</td>
                  </tr>
                </thead>
                <tbody>
                  {countryInstructors.map(instructor => (
                    <tr key={instructor.id}>
                      <td>{instructor.id}</td>
                      <td>{instructor.firstname}</td>
                      <td>{instructor.name}</td>
                      <td>{instructor.level}</td>
                      <td>{instructor.expiresAt}</td>
                      <td>
                        {canGenerateCertificate(instructor) && (
                          <CertificateDownloadButton
                            languages={availableLanguages(instructor)}
                            onClick={downloadCertificate(instructor)}
                          />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CountryTable>
          )}
    </Wrapper>
  );
}

const Select = styled.select`
  max-width: 50vw;
`;

const Switch = styled(ToggleSwitch)`
  margin-bottom: 2rem;
`;

const DownloadText = styled.span`
  font-size: 1rem;
  font-weight: bold;
  font-style: italic;
  text-align: center;
  margin-bottom: 0.5rem;
  color: ${props => props.theme.primary};
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
  margin-bottom: 1rem;
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
