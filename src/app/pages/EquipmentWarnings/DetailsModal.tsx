import React, { memo, useEffect } from 'react';
import styled from 'styled-components/macro';
import { EquipmentWarningItem } from './spreadsheet';

interface Props {
  equipment: EquipmentWarningItem;
}

function Component(props: Props) {
  const eq = props.equipment;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [eq]);
  return (
    <Wrapper>
      {eq.image && (
        <PictureContainer>
          <img src={eq.image} alt={'Product cannot be displayed'} />
        </PictureContainer>
      )}
      <Field>
        <span id="key">Date:&nbsp;</span>
        <span id="value">{eq.dateString}</span>
      </Field>
      <Field>
        <span id="key">Status:&nbsp;</span>
        <span id="value">{eq.status}</span>
      </Field>
      <Field>
        <span id="key">Product Type:&nbsp;</span>
        <span id="value">{eq.productType}</span>
      </Field>
      <Field>
        <span id="key">Name:&nbsp;</span>
        <span id="value">{eq.name}</span>
      </Field>
      <Field>
        <span id="key">Manufacturer:&nbsp;</span>
        <span id="value">{eq.manufacturer}</span>
      </Field>
      <Field>
        <span id="key">In Production?:&nbsp;</span>
        <span id="value">{eq.inProduction ? 'Yes' : 'No'}</span>
      </Field>
      <Field>
        <span id="key">Description:&nbsp;</span>
        <span id="value">{eq.description}</span>
      </Field>
      <Field>
        <span id="key">Solution:&nbsp;</span>
        <span id="value">{eq.solution}</span>
      </Field>
      {(eq.link1 || eq.link2) && (
        <Field>
          <span id="key">More Info:&nbsp;</span>
          {eq.link1 && (
            <a id="value" href={eq.link1} target="_blank" rel="noreferrer">
              Link 1
            </a>
          )}
          ,
          {eq.link2 && (
            <a id="value" href={eq.link1} target="_blank" rel="noreferrer">
              Link 2
            </a>
          )}
        </Field>
      )}
    </Wrapper>
  );
}
const Field = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
  #key {
    text-align: left;
    font-weight: bold;
    word-break: keep-all;
    white-space: nowrap;
  }
  #value {
    text-align: left;
    word-break: keep-all;
  }
`;

const PictureContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  width: 100%;
  & img {
    object-fit: contain;
    border: none;
    width: 90%;
    height: 25vh;
  }
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  background-color: ${props => props.theme.background};
`;

export const DetailsModal = memo(Component);
