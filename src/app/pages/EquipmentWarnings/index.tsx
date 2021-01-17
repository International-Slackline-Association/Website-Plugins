import React, { useState, useEffect } from 'react';
import styled from 'styled-components/macro';
import { media } from 'styles/media';
import {
  EquipmentWarningItem,
  queryData,
  getStatuses,
  getManufacturers,
} from './spreadsheet';
import { Table } from './Table';
import { touchableOpacity } from 'styles/mixins';
import { DetailsModal } from './DetailsModal';
import Modal, { ModalTransition } from '@atlaskit/modal-dialog';
import { LoadingIndicator } from 'app/components/LoadingIndicator/index';

export const EquipmentWarnings = () => {
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>();
  const [statusFilters, setStatusFilters] = useState<string[]>([]);
  const [selectedManufacturerFilter, setSelectedManufacturerFilter] = useState<
    string
  >();
  const [manufacturersFilters, setManufacturerFilters] = useState<string[]>([]);
  const [equipmentList, setEquipmentList] = useState<
    EquipmentWarningItem[] | undefined
  >();
  const [viewerIsOpen, setViewerIsOpen] = useState(false);
  const [currentViewingEquipment, setCurrentViewingEquipment] = useState<
    EquipmentWarningItem
  >();

  useEffect(() => {
    const setFilters = async () => {
      const statuses = await getStatuses();
      setStatusFilters(statuses);
      setSelectedStatusFilter(statuses[0]);
      const types = await getManufacturers();
      setManufacturerFilters(types);
      setSelectedManufacturerFilter(types[0]);
    };
    setFilters();
  }, []);

  useEffect(() => {
    const setGearlist = async () => {
      const gearList = await queryData(
        selectedStatusFilter,
        selectedManufacturerFilter,
      );
      setEquipmentList(gearList);
    };
    setGearlist();
  }, [selectedStatusFilter, selectedManufacturerFilter]);

  function detailsClicked(eq: EquipmentWarningItem) {
    return () => {
      setCurrentViewingEquipment(eq);
      setViewerIsOpen(true);
    };
  }

  return (
    <Wrapper>
      <Header>ISA Equipment Warnings and Recalls</Header>
      <FilterArea>
        <span>Filter by</span>
        <DropdownMenuContainer>
          <DropdownMenu
            onChange={(evt: any) => setSelectedStatusFilter(evt.target.value)}
            value={selectedStatusFilter}
          >
            {statusFilters.map(s => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </DropdownMenu>
          <DropdownMenu
            onChange={(evt: any) =>
              setSelectedManufacturerFilter(evt.target.value)
            }
            value={selectedManufacturerFilter}
          >
            {manufacturersFilters.map(type => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </DropdownMenu>
        </DropdownMenuContainer>
      </FilterArea>
      {equipmentList ? (
        <Table>
          <table>
            <thead>
              <tr>
                <td>Date</td>
                <td>Status</td>
                <td>Product Type</td>
                <td>Name</td>
                <td>Manufacturer</td>
                <td />
              </tr>
            </thead>
            <tbody>
              {equipmentList.map(eq => (
                <tr key={eq._id}>
                  <td>{eq.dateString}</td>
                  <td>{eq.status}</td>
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
