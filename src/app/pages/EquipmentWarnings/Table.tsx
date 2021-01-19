import styled from 'styled-components/macro';

export const Table = styled.div`
  width: 95%;

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

  td.Recall {
    background-color: red;
    color: white;
  }
  td.Warning {
    background-color: yellow;
    font-weight: bold;
  }

  tr:nth-child(even) {
    background-color: ${props => props.theme.textTertiary};
  }
`;
