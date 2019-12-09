import styled from "@emotion/styled/macro";
import colors from './colors';

const borderWidth = 1;

export const Table = styled.div`
  display: inline-block;
  border-spacing: 0;
`

export const Cell = styled.div`
  margin: 0;
  padding: 0.5rem;
  border-bottom: ${borderWidth}px solid black;
  border-right: ${borderWidth}px solid black;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;

  &:last-child {
    border-right: 0;
  }
`
export const HeaderCell = styled(Cell)`
`

export const Row = styled.div`
  &:last-child {
    .td {
      border-bottom: 0;
    }
  }
`
export const HeaderRow = styled(Row)`
  overflow-y: scroll;
`
