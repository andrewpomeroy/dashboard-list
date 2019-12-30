import React from "react";
import styled from "@emotion/styled";

const Row = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
`
const RowItem = styled.div`
  padding: 12px 0;
  &:not(:first-of-type) {
    margin-left: 24px;
  }
`

const ColumnControls = ({ options, activeColumns, setActiveColumns }) => {
  const toggleOption = option => {
    setActiveColumns({
      ...activeColumns,
      [option.id]: !activeColumns[option.id]
    })
  }
  return (
    <Row>
      {options.map(option => {
        const isChecked = activeColumns[option.id];
        return (
          <RowItem key={option.id}>
          <label>
            <input type="checkbox" checked={isChecked} onChange={() => toggleOption(option)} /> {option.Header}
          </label>
        </RowItem>
      )})}
    </Row>
  )
}

export default ColumnControls;