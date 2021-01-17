import React, { memo, useEffect } from 'react';
import styled from 'styled-components/macro';
import { GearItem } from './spreadsheet';

interface Props {
  gear: GearItem;
}

function Component(props: Props) {
  const gear = props.gear;
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <Wrapper>
      <PictureContainer>
        <img src={gear.picture1} alt={'Product cannot be displayed'} />
        <img src={gear.picture2} alt={'Product cannot be displayed'} />
      </PictureContainer>
      <Field>
        <span id="key">Brand:&nbsp;</span>
        <span id="value">{gear.brand}</span>
      </Field>
      <Field>
        <span id="key">Model Name:&nbsp;</span>
        <span id="value">{gear.modelName}</span>
      </Field>
      <Field>
        <span id="key">Model Version:&nbsp;</span>
        <span id="value">{gear.modelVersion}</span>
      </Field>
      <Field>
        <span id="key">Release Year of Model:&nbsp;</span>
        <span id="value">{gear.releaseYear}</span>
      </Field>
      {gear.productLink && (
        <Field>
          <span id="key">Product Link:&nbsp;</span>
          <a
            id="value"
            href={gear.productLink}
            target="_blank"
            rel="noreferrer"
          >
            Product
          </a>
        </Field>
      )}
      {gear.manualLink && (
        <Field>
          <span id="key">Manual Link:&nbsp;</span>
          <a id="value" href={gear.manualLink} target="_blank" rel="noreferrer">
            Product Manual
          </a>
        </Field>
      )}
      <Field>
        <span id="key">Testing Lab:&nbsp;</span>
        <span id="value">{gear.testingLab}</span>
      </Field>
      <Field>
        <span id="key">Test Date:&nbsp;</span>
        <span id="value">{gear.testDate}</span>
      </Field>
      <Field>
        <span id="key">Product Type:&nbsp;</span>
        <span id="value">{gear.productType}</span>
      </Field>
      <Field>
        <span id="key">Standard:&nbsp;</span>
        <span id="value">{gear.standard}</span>
      </Field>
      <Field>
        <span id="key">Standard Version:&nbsp;</span>
        <span id="value">{gear.standardVersion}</span>
      </Field>
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
    /* white-space: nowrap; */
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
    width: 45%;
  }
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  background-color: ${props => props.theme.background};
`;

export const DetailsModal = memo(Component);
