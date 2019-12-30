import styled from "@emotion/styled/macro";
import colors from './colors';

const cellPaddingV = 14;
const cellPaddingH = 12;
const cellPaddingHLarge = 24;

export const Table = styled.div`
  display: inline-block;
  border-spacing: 0;
  font-size: 14px;
  color: ${colors.strongText};
`

export const Cell = styled.div`
  display: flex;
  align-items: center;
  margin: 0;
  padding: ${cellPaddingV}px ${cellPaddingH}px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  &:first-child {
    padding-left: ${cellPaddingHLarge}px;
  }
  &:last-child {
    padding-right: ${cellPaddingHLarge}px;
  }
`
export const HeaderCell = styled(Cell)`
  background-color: ${colors.tableHeaderCellBg};
  color: ${colors.tableHeaderCellText};
  font-weight: 600;
  text-transform: uppercase;
  font-size: .85em;
`

export const Row = styled.div`
  .td {
    background-color: ${props => props.isOdd ? colors.tableRowOdd : colors.tableRowEven};
  }
  &:last-child {
    .td {
      border-bottom: 0;
    }
  }
`
export const HeaderRow = styled(Row)`
  overflow-y: scroll;
`
