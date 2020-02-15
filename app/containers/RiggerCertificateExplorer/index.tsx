import React, { useState, useEffect } from 'react';
import styled from 'styles/styled-components';
import media from 'styles/media';
import { TextInput } from 'components/TextInput';
import { LoadableButton } from 'components/LoadableButton';
import { ToggleSwitch } from 'components/ToggleSwitch';
import { CountryTable } from './CountryTable';
import {
  RiggerItem,
  queryRigger,
  queryRiggersByCountry,
  getCountries,
} from './spreadsheet';
import { generateRiggerCertificate } from './pdfGenerator/certificateGenerator';
import { PDFDownloadLink } from 'containers/InstructorCertificateExplorer/PdfLink';

type SwitchType = 'id' | 'country';

export default function CertificateExplorer() {
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [rigger, setRigger] = useState<RiggerItem | null>();
  const [selectedSwitch, setSelectedSwitch] = useState<SwitchType>('id');
  const [countryList, setCountryList] = useState<string[]>([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [countryRiggers, setCountryRiggers] = useState<RiggerItem[] | null>();

  function updateValue(value: string) {
    setInputValue(value);
    setRigger(undefined);
  }

  async function checkClicked(evt?: any) {
    if (evt !== undefined && evt.preventDefault) {
      evt.preventDefault();
    }
    if (inputValue && selectedSwitch === 'id') {
      setIsLoading(true);
      const rigger = await queryRigger(inputValue);
      setIsLoading(false);
      setRigger(rigger);
    } else if (selectedCountry && selectedSwitch === 'country') {
      setIsLoading(true);
      const riggers = await queryRiggersByCountry(selectedCountry);
      setIsLoading(false);
      setCountryRiggers(riggers);
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

  function downloadCertificate(rigger: RiggerItem) {
    return async evt => {
      await generateRiggerCertificate({ rigger: rigger });
    };
  }
  return (
    <Wrapper>
      <Header>Rigger Certificate Explorer</Header>
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
            label="ID or Name of the rigger"
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
        ? rigger !== undefined &&
          (rigger === null || !rigger.rigger ? (
            <InvalidText>
              Cannot find the rigger &nbsp;
              <b>{inputValue}</b>
            </InvalidText>
          ) : (
            <React.Fragment>
              <ValidText>
                <b>{`${rigger.firstname} ${rigger.name}`}</b>
                <span>&nbsp;has a&nbsp;</span>
                <b>{rigger.rigger} Certificate</b>
                <span>&nbsp;valid until&nbsp;</span>
                <b>{rigger.valid}</b>
              </ValidText>
              <PDFDownloadLink onClick={downloadCertificate(rigger)}>
                Download Certificate
              </PDFDownloadLink>
            </React.Fragment>
          ))
        : countryRiggers && (
            <CountryTable>
              <table>
                <thead>
                  <tr>
                    <td>Id</td>
                    <td>Firstname</td>
                    <td>Lastname</td>
                    <td>Expiration Date</td>
                  </tr>
                </thead>
                <tbody>
                  {countryRiggers.map(rigger => (
                    <tr key={rigger.id}>
                      <td>{rigger.id}</td>
                      <td>{rigger.firstname}</td>
                      <td>{rigger.name}</td>
                      <td>{rigger.valid}</td>
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
