import styled from 'styles/styled-components';

export const GearTable = styled.div`
  width: 80%;

  & table {
    font-family: arial, sans-serif;
    border-collapse: collapse;
    width: 100%;
  }

  td,
  th {
    font-size: 0.8rem;
    border-bottom: 1px solid ${props => props.theme.textTertiary};
    text-align: left;
    padding: 8px;
    white-space: nowrap;
  }

  tr:nth-child(even) {
    background-color: ${props => props.theme.textTertiary};
  }
`;
