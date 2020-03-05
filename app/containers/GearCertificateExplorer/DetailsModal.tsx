import React, { memo } from 'react';
import styled from 'styles/styled-components';
import media from 'styles/media';
import { GearItem } from './spreadsheet';
import { Variants, motion } from 'framer-motion';
const variants: Variants = {
  initial: {
    y: 50,
    opacity: 0.5,
  },
  enter: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.3,
    },
  },
};

interface Props {
  gear: GearItem;
}

function Component(props: Props) {
  const gear = props.gear;
  return (
    <Wrapper variants={variants} initial="initial" animate="enter">
      <PictureContainer>
        <div style={{ backgroundImage: `url(${gear.picture1})` }} />
        <div style={{ backgroundImage: `url(${gear.picture2})` }} />
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
      <Field>
        <span id="key">Product Link:&nbsp;</span>
        <span id="value">{gear.productLink}</span>
      </Field>
      <Field>
        <span id="key">Manual Link:&nbsp;</span>
        <span id="value">{gear.manualLink}</span>
      </Field>
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
  & div {
    border: none;
    width: 45%;
    height: 25vh;
    background-position: center;
    background-size: contain;
    background-repeat: no-repeat;
  }
`;

const Wrapper = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 2rem;
  background-color: ${props => props.theme.background};
  border-radius: 10px;
  overflow-y: scroll;
  width: 90vw;

  ${media.desktop`
    width: 50vw;
  `};
`;

export const DetailsModal = memo(Component);
