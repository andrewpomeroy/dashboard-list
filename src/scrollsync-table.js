import React from 'react';
import styled from '@emotion/styled'

const Cell = styled.td` 
  padding: .5em 1em;
  text-align: left;
  border-left: 1px solid white;
  border-bottom: 1px solid white;
  width: 100%;
`

const Row = styled.tr`
  width: 100%;
`

const TBody = styled.tbody`
  /* display: block; */
  /* width: 100%; */
  min-width: 200px;
  height: 200px;
  overflow-y: auto;
  background: lightblue;
`
const THead = styled.thead`
  /* display: block; */
  /* width: 100%; */
  min-width: 200px;
  overflow: auto;
  color: white;
  background: grey;
`
``
const ScrollSyncTable = (props) => {
  return (
    <table style={{ width: 400, borderCollapse: 'collapse' }}>
      <ScrollSyncPane group="horizontal">
        <thead style={{ display: 'block', width: 400, overflow: 'auto', color: 'white', background: 'black' }}>
          <tr>
          <th style={cellStyle}>Table 2 - Header 1</th>
          <th style={cellStyle}>Table 2 - Header 2</th>
          <th style={cellStyle}>Table 2 - Header 3</th>
          </tr>
        </thead>
      </ScrollSyncPane>
      <ScrollSyncPane group={["horizontal", "vertical"]}>
        <tbody style={{ display: 'block', width: 400, height: 200, overflow: 'auto', background: 'pink' }}>
        <tr>
          <td style={cellStyle}>Cell 1, Row 1</td>
          <td style={cellStyle}>Cell 2, Row 1</td>
          <td style={cellStyle}>Cell 3, Row 1</td>
        </tr>
        <tr>
          <td style={cellStyle}>Cell 1, Row 2</td>
          <td style={cellStyle}>Cell 2, Row 2</td>
          <td style={cellStyle}>Cell 3, Row 2</td>
        </tr>
        <tr>
          <td style={cellStyle}>Cell 1, Row 3</td>
          <td style={cellStyle}>Cell 2, Row 3</td>
          <td style={cellStyle}>Cell 3, Row 3</td>
        </tr>
        <tr>
          <td style={cellStyle}>Cell 1, Row 4</td>
          <td style={cellStyle}>Cell 2, Row 4</td>
          <td style={cellStyle}>Cell 3, Row 4</td>
        </tr>
        <tr>
          <td style={cellStyle}>Cell 1, Row 5</td>
          <td style={cellStyle}>Cell 2, Row 5</td>
          <td style={cellStyle}>Cell 3, Row 5</td>
        </tr>
        <tr>
          <td style={cellStyle}>Cell 1, Row 6</td>
          <td style={cellStyle}>Cell 2, Row 6</td>
          <td style={cellStyle}>Cell 3, Row 6</td>
        </tr>
        <tr>
          <td style={cellStyle}>Cell 1, Row 7</td>
          <td style={cellStyle}>Cell 2, Row 7</td>
          <td style={cellStyle}>Cell 3, Row 7</td>
        </tr>
        <tr>
          <td style={cellStyle}>Cell 1, Row 8</td>
          <td style={cellStyle}>Cell 2, Row 8</td>
          <td style={cellStyle}>Cell 3, Row 8</td>
        </tr>
        <tr>
          <td style={cellStyle}>Cell 1, Row 9</td>
          <td style={cellStyle}>Cell 2, Row 9</td>
          <td style={cellStyle}>Cell 3, Row 9</td>
        </tr>
        <tr>
          <td style={cellStyle}>Cell 1, Row 10</td>
          <td style={cellStyle}>Cell 2, Row 10</td>
          <td style={cellStyle}>Cell 3, Row 10</td>
        </tr>
        <tr>
          <td style={cellStyle}>Cell 1, Row 11</td>
          <td style={cellStyle}>Cell 2, Row 11</td>
          <td style={cellStyle}>Cell 3, Row 11</td>
        </tr>
        <tr>
          <td style={cellStyle}>Cell 1, Row 12</td>
          <td style={cellStyle}>Cell 2, Row 12</td>
          <td style={cellStyle}>Cell 3, Row 12</td>
        </tr>
        </tbody>
      </ScrollSyncPane>
    </table>
  )
}

    

export default ScrollSyncTable;