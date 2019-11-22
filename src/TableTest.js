import React, { useState } from 'react';
import styled from '@emotion/styled'

const Table = styled.table`
  border-collapse: collapse;
  width: 100%;
  table-layout: auto;
`

const Cell = styled.td` 
  padding: .5em 1em;
  text-align: left;
  border-left: 1px solid white;
  border-bottom: 1px solid white;
  /* width: 100%; */
`

const HeaderCell = styled(Cell)`
  position: sticky;
  top: 0;
  color: white;
  background: grey; 
  white-space: nowrap;
`

const BodyCell = styled(Cell)`
  background: ${props => props.isHighlighted ? 'blue' : 'lightblue'};
  cursor: pointer;
`

const Row = styled.tr`
  width: 100%;
`

const TBody = styled.tbody`
  /* display: block; */
  /* width: 100%; */
  min-width: 200px;
  height: 200px;
`
const THead = styled.thead`
  /* display: block; */
  /* width: 100%; */
`

const tableRows = Array.from({length: 3000}).map((val, i) => (i + 1));
const tableColumns = Array.from({length: 4}).map((val, i) => (i + 1));

const RowItem = props => (
  <Row onClick={() => props.selectRow(props.row)}>
    {tableColumns.map(c => (
      <BodyCell key={c} isHighlighted={props.isHighlighted}>Fixed Column {c}, Row {props.row}</BodyCell>
    ))}
  </Row>
)

const MemoizedRow = React.memo(RowItem, (prevProps, nextProps) => {
  if (prevProps.isHighlighted === nextProps.isHighlighted) {
    return true;
  }
  return false;
});

const TableTest = props => {
  const [activeRowIndex, selectRow] = useState(null);
  return (
    <>
      <Table>
        <THead>
          <Row>
            {tableColumns.map(c => (
              <HeaderCell as="th" key={c}>Fixed Column Header {c}</HeaderCell>
            ))}
          </Row>
        </THead>
        <TBody>
          <>
            {tableRows.map(x => (
              <MemoizedRow key={x} row={x} isHighlighted={activeRowIndex === x} selectRow={selectRow} />
            ))}
          </>
        </TBody>
      </Table>
    </>
  )
}

export default TableTest;