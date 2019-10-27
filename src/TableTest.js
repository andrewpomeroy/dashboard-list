import React from 'react';
import { Global, css } from '@emotion/core'
import styled from '@emotion/styled'

const globalStyles = css`
  * {
    box-sizing: border-box;
  }
  html {
    height: 100vh;
    width: 100vw;
  }
  body {
    font-family: "Inter UI", "Fakt Pro", "Roboto", "Helvetica", sans-serif;
  }
  .u-fullscreenStretch {
    width: 100%;
    height: 100%;
  }
`

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
  background: lightblue;
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

const tableRows = Array.from({length: 50}).map((val, i) => (i + 1));
const tableColumns = Array.from({length: 4}).map((val, i) => (i + 1));

const TableTest = (props) => {
  return (
    <>
      <Global styles={globalStyles}></Global>
      <Table>
        <THead>
          <Row>
            {tableColumns.map(c => (
              <HeaderCell as="th" key={c}>Fixed Column Header {c}</HeaderCell>
            ))}
          </Row>
        </THead>
        <TBody>
          {tableRows.map(x => (
            <Row key={x}>
              {tableColumns.map(c => (
                <BodyCell key={c}>Fixed Column {c}, Row {x}</BodyCell>
              ))}
            </Row>
          ))}
        </TBody>
      </Table>
    </>
  )
}

export default TableTest;