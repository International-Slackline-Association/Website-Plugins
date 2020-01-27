import React, { useState, useEffect } from 'react';
import styled from 'styles/styled-components';
import media from 'styles/media';
import { TextInput } from 'components/TextInput';
import { LoadableButton } from 'components/LoadableButton';
import {
  GearItem,
  queryGears,
  getBrands,
  getProductTypes,
} from './spreadsheet';
import { ToggleSwitch } from 'components/ToggleSwitch';
import { GearTable } from './GearTable';
import { LoadingSpinner } from 'components/Spinner/LoadingSpinner';

export default function CertificateExplorer() {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedBrandFilter, setSelectedBrandFilter] = useState('All Brands');
  const [brandFilters, setBrandFilters] = useState<string[]>([]);
  const [selectedProductTypeFilter, setSelectedProductTypeFilter] = useState(
    'All Product Types',
  );
  const [productTypeFilters, setProductTypeFilters] = useState<string[]>([]);

  const [gearList, setGearList] = useState<GearItem[] | undefined>();

  useEffect(() => {
    const setFilters = async () => {
      const brands = await getBrands();
      setBrandFilters(brands);
      const types = await getProductTypes();
      setProductTypeFilters(types);
    };
    setFilters();
  }, []);

  useEffect(() => {
    const setGearlist = async () => {
      const gearList = await queryGears(
        selectedBrandFilter,
        selectedProductTypeFilter,
      );
      setGearList(gearList);
    };
    setGearlist();
  }, [selectedBrandFilter, selectedProductTypeFilter]);

  async function brandFilterChanged(evt: any) {
    setSelectedBrandFilter(evt.target.value);
  }

  async function productTypeFilterChanged(evt: any) {
    setSelectedProductTypeFilter(evt.target.value);
  }

  return (
    <Wrapper>
      <Header>Gear Certificate Explorer</Header>
      <DropdownMenuContainer>
        <DropdownMenu onChange={brandFilterChanged} value={selectedBrandFilter}>
          {brandFilters.map(brand => (
            <option key={brand} value={brand}>
              {brand}
            </option>
          ))}
        </DropdownMenu>
        <DropdownMenu
          onChange={productTypeFilterChanged}
          value={selectedProductTypeFilter}
        >
          {productTypeFilters.map(type => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </DropdownMenu>
      </DropdownMenuContainer>
      {gearList ? (
        <GearTable>
          <table>
            <thead>
              <tr>
                <td>Brand</td>
                <td>Model Name</td>
                <td>Product Type</td>
              </tr>
            </thead>
            <tbody>
              {gearList.map(gear => (
                <tr key={gear.brand}>
                  <td>{gear.brand}</td>
                  <td>{gear.modelName}</td>
                  <td>{gear.productType}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </GearTable>
      ) : (
        <LoadingSpinner />
      )}
    </Wrapper>
  );
}

const DropdownMenu = styled.select`
  margin-right: 1rem;
`;

const DropdownMenuContainer = styled.div`
  display: flex;
  margin-bottom: 2rem;
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
