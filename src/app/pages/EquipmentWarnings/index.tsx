import React, { useState, useEffect } from 'react';
import styled from 'styled-components/macro';
import { media } from 'styles/media';
import {
  EquipmentWarningItem,
  FilterValues,
  getFilterValues,
  filterBy,
  SelectedFilters,
  FilterKeyType,
} from './spreadsheet';
import { Table } from './Table';
import { touchableOpacity } from 'styles/mixins';
import { DetailsModal } from './DetailsModal';
import Modal, { ModalTransition } from '@atlaskit/modal-dialog';
import { LoadingIndicator } from 'app/components/LoadingIndicator/index';

const defaultFilters: SelectedFilters = {
  status: 'All Statuses',
  manufacturer: 'All Manufacturer',
  productType: 'All Product Types',
};
export const EquipmentWarnings = () => {
  const [selectedFilters, setSelectedFilters] = useState<SelectedFilters>(
    defaultFilters,
  );
  const [filterValues, setFilterValues] = useState<FilterValues>({});
  const [equipmentList, setEquipmentList] = useState<
    EquipmentWarningItem[] | undefined
  >();
  const [viewerIsOpen, setViewerIsOpen] = useState(false);
  const [currentViewingEquipment, setCurrentViewingEquipment] = useState<
    EquipmentWarningItem
  >();

  useEffect(() => {
    const fillFilterValues = async () => {
      const filterValues = {};
      for (const key in defaultFilters) {
        const filterKey = key as FilterKeyType;
        const defaultValue = defaultFilters[filterKey]!;
        const values = await getFilterValues(filterKey, defaultValue);
        filterValues[filterKey] = values;
      }
      setFilterValues(filterValues);
    };
    fillFilterValues();
  }, []);

  useEffect(() => {
    const setList = async () => {
      const list = await filterBy(selectedFilters);
      setEquipmentList(list);
    };
    setList();
  }, [selectedFilters]);

  const selectFilter = (key: string, value: string) => {
    setSelectedFilters({ ...selectedFilters, [key]: value });
  };

  const detailsClicked = (eq: EquipmentWarningItem) => {
    return () => {
      setCurrentViewingEquipment(eq);
      setViewerIsOpen(true);
    };
  };

  return (
    <Wrapper>
      <Header>ISA Gear Warnings and Manufacturer Recalls</Header>
      <FilterArea>
        <span>Filter by</span>
        <DropdownMenuContainer>
          {Object.keys(selectedFilters).map(filterKey => (
            <DropdownMenu
              key={filterKey}
              onChange={(evt: any) => selectFilter(filterKey, evt.target.value)}
              value={selectedFilters[filterKey]}
            >
              {filterValues[filterKey]?.map(s => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </DropdownMenu>
          ))}
        </DropdownMenuContainer>
      </FilterArea>
      {equipmentList ? (
        <Table>
          <table>
            <thead>
              <tr>
                <td>Status</td>
                <td>Product Type</td>
                <td>Model</td>
                <td>Manufacturer</td>
                <td />
              </tr>
            </thead>
            <tbody>
              {equipmentList.map(eq => (
                <tr key={eq._id}>
                  <td className={eq.status}>{eq.status}</td>
                  <td>{eq.productType}</td>
                  <td>{eq.name}</td>
                  <td>{eq.manufacturer}</td>
                  <DetailsButton onClick={detailsClicked(eq)}>
                    Details
                  </DetailsButton>
                </tr>
              ))}
            </tbody>
          </table>
        </Table>
      ) : (
        <LoadingIndicator />
      )}
      <ModalTransition>
        {viewerIsOpen && currentViewingEquipment && (
          <Modal
            actions={[{ text: 'Close', onClick: () => setViewerIsOpen(false) }]}
            onClose={() => setViewerIsOpen(false)}
            heading={currentViewingEquipment.name}
          >
            <DetailsModal equipment={currentViewingEquipment} />
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
  width: 95%;

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
