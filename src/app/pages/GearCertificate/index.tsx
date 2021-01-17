import React, { useState, useEffect } from 'react';
import styled from 'styled-components/macro';
import { media } from 'styles/media';
import {
  GearItem,
  queryGears,
  getBrands,
  getProductTypes,
} from './spreadsheet';
import { GearTable } from './GearTable';
import { touchableOpacity } from 'styles/mixins';
import { DetailsModal } from './DetailsModal';
import Modal, { ModalTransition } from '@atlaskit/modal-dialog';
import { LoadingIndicator } from 'app/components/LoadingIndicator/index';

export const GearCertificate = () => {
  const [selectedBrandFilter, setSelectedBrandFilter] = useState<string>();
  const [brandFilters, setBrandFilters] = useState<string[]>([]);
  const [selectedProductTypeFilter, setSelectedProductTypeFilter] = useState<
    string
  >();
  const [productTypeFilters, setProductTypeFilters] = useState<string[]>([]);
  const [gearList, setGearList] = useState<GearItem[] | undefined>();
  const [viewerIsOpen, setViewerIsOpen] = useState(false);
  const [currentViewingGear, setCurrentViewingGear] = useState<GearItem>();

  useEffect(() => {
    const setFilters = async () => {
      const brands = await getBrands();
      setBrandFilters(brands);
      setSelectedBrandFilter(brands[0]);
      const types = await getProductTypes();
      setProductTypeFilters(types);
      setSelectedProductTypeFilter(types[0]);
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

  function detailsClicked(id: string) {
    return () => {
      const gear = gearList?.find(g => g.id === id);
      if (gear) {
        setCurrentViewingGear(gear);
        setViewerIsOpen(true);
      }
    };
  }

  return (
    <Wrapper>
      <Header>ISA Safety Label Explorer</Header>
      <FilterArea>
        <span>Filter by</span>
        <DropdownMenuContainer>
          <DropdownMenu
            onChange={brandFilterChanged}
            value={selectedBrandFilter}
          >
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
      </FilterArea>
      {gearList ? (
        <GearTable>
          <table>
            <thead>
              <tr>
                <td>Brand</td>
                <td>Model Name</td>
                <td>Product Type</td>
                <td />
              </tr>
            </thead>
            <tbody>
              {gearList.map(gear => (
                <tr key={gear.modelDescription}>
                  <td>{gear.brand}</td>
                  <td>{gear.modelName}</td>
                  <td>{gear.productType}</td>
                  <DetailsButton onClick={detailsClicked(gear.id)}>
                    Details
                  </DetailsButton>
                </tr>
              ))}
            </tbody>
          </table>
        </GearTable>
      ) : (
        <LoadingIndicator />
      )}
      <ModalTransition>
        {viewerIsOpen && currentViewingGear && (
          <Modal
            actions={[{ text: 'Close', onClick: () => setViewerIsOpen(false) }]}
            onClose={() => setViewerIsOpen(false)}
            heading={currentViewingGear.modelName}
          >
            <DetailsModal gear={currentViewingGear} />
          </Modal>
        )}
      </ModalTransition>
    </Wrapper>
  );
};

const DetailsButton = styled.td`
  color: ${props => props.theme.textInvertedSecondary};
  ${touchableOpacity}
`;

const FilterArea = styled.div`
  display: flex;
  flex-direction: column;
  width: 80%;

  & span {
    font-size: 0.8rem;
    font-style: italic;
    margin-bottom: 0.5rem;
    color: ${props => props.theme.textSecondary};
  }
`;

const DropdownMenu = styled.select`
  margin-right: 1rem;
  align-self: flex-start;
`;

const DropdownMenuContainer = styled.div`
  display: flex;
  width: 100%;
  margin-bottom: 2rem;
  align-items: center;
  align-self: flex-start;
`;

const Header = styled.span`
  font-size: 1rem;
  font-weight: bold;
  text-align: center;
  letter-spacing: 0.05rem;
  margin-top: 1rem;
  margin-bottom: 2rem;

  color: ${props => props.theme.text};
  ${media.large`
      font-size: 1.5rem;
    `};
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  align-self: center;
`;
