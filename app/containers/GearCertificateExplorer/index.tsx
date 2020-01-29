import React, { useState, useEffect } from 'react';
import styled from 'styles/styled-components';
import media from 'styles/media';
import {
  GearItem,
  queryGears,
  getBrands,
  getProductTypes,
} from './spreadsheet';
import { ToggleSwitch } from 'components/ToggleSwitch';
import { GearTable } from './GearTable';
import { LoadingSpinner } from 'components/Spinner/LoadingSpinner';
import { touchableOpacity } from 'styles/mixins';
import { DetailsModal } from './DetailsModal';
import Portal from 'components/Modal';

export default function CertificateExplorer() {
  const [selectedBrandFilter, setSelectedBrandFilter] = useState();
  const [brandFilters, setBrandFilters] = useState<string[]>([]);
  const [selectedProductTypeFilter, setSelectedProductTypeFilter] = useState();
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

  const closeLightbox = () => {
    setViewerIsOpen(false);
  };

  return (
    <Wrapper>
      <Header>Gear Certificate Explorer</Header>
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
        <LoadingSpinner />
      )}
      {viewerIsOpen && currentViewingGear && (
        <Portal backgroundClicked={closeLightbox}>
          <DetailsModal gear={currentViewingGear} />
        </Portal>
      )}
      {/* 
      <ModalGateway>
        {viewerIsOpen && currentViewingGear ? (
          <Modal
            onClose={closeLightbox}
            allowFullscreen={false}
            closeOnBackdropClick={true}
            // styles={{
            //   blanket: base => ({
            //     ...base,
            //     backgroundColor: 'rgba(0,0,0,0.20)',
            //   }),
            //   dialog: base => ({
            //     ...base,
            //   }),
            // }}
          ></Modal>
        ) : null}
      </ModalGateway> */}
    </Wrapper>
  );
}

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
