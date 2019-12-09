import React, { useState, useReducer, useEffect, useRef } from "react";
import styled from "@emotion/styled";
import { useTable, useBlockLayout, useSortBy } from "react-table";
import { VariableSizeList as List } from "react-window";
import memoize from 'memoize-one';
import Measure from 'react-measure';
import dayjs from 'dayjs';
import getColumnWidth from './getColumnWidth';
import ColumnControls from './ColumnControls';
import { Table as TableComponent, Row, HeaderRow, Cell, HeaderCell } from './tableComponents';
import { Username, UnassignedUser } from './commonComponents';

import makeData from "./makeData";
import makeFormData from "./makeFormData";

const borderWidth = 1;

const OuterWrapper = styled.div`
  flex: 1;
  width: 100%;
  padding: 0 1rem;
  margin: 1rem 0;
  overflow-x: auto;

  * {
    box-sizing: border-box;
  }
`;

function Table({ columns, data, height }) {
  // Use the state and functions returned from useTable to build your UI

  const defaultColumn = React.useMemo(
    () => ({
      width: 150
    }),
    []
  );

  const rowHeights = new Array(1000)
  .fill(true)
  .map(() => 25 + Math.round(Math.random() * 50));

  const activeItem = useRef(0);
  const listRef = useRef({});
 
  const toggleItem = (index) => {
    console.log("toggling", index, activeItem);
    activeItem.current = (index === activeItem.current ? null : index);
    if (listRef.current) {
      listRef.current.resetAfterIndex(0);
    }
  }

  const {
    getTableProps,
    getTableBodyProps,
    rows,
    headerGroups,
    totalColumnsWidth,
    prepareRow
  } = useTable(
    {
      columns,
      data,
      defaultColumn
    },
    useSortBy,
    useBlockLayout
  );
      
  const getItemSize = index => {
    return index === activeItem.current ? 60 : 35
  };

  const RenderRow = React.useCallback(
    ({ index, style }) => {
      const row = rows[index];
      prepareRow(row);
      return (
        <Row
          {...row.getRowProps({
            style
          })}
        >
          {row.cells.map(cell => {
            return (
              <Cell {...cell.getCellProps()} onClick={() => toggleItem(index)} className="td">
                {cell.render("Cell")}
              </Cell>
            );
          })}
        </Row>
      );
    },
    [prepareRow, rows]
  );

  // Render the UI for your table
  return (
    <TableComponent {...getTableProps()}>
      <div>
        {headerGroups.map(headerGroup => (
          <HeaderRow {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              <HeaderCell {...column.getHeaderProps(column.getSortByToggleProps())}>
                {column.render("Header")}
                <span style={{fontSize: '.666em'}}>
                  {column.isSorted
                    ? column.isSortedDesc
                      ? ' 🔽'
                      : ' 🔼'
                    : ''}
                </span>
              </HeaderCell>
            ))}
          </HeaderRow>
        ))}
      </div>

      <div {...getTableBodyProps()}>
        <List
          ref={listRef}
          height={height - 40} // Rough estimate of header height. We can calculate this eventually
          itemCount={rows.length}
          itemSize={getItemSize}
          width={totalColumnsWidth}
        >
          {RenderRow}
        </List>
      </div>
    </TableComponent>
  );
}

const randoSort = memoize((a, b) => {
  const num = Math.random() - 0.5;
  return num;
})

const assigneeSort = memoize(({values: {assignee: a}}, {values: {assignee: b}}) => {
  return sortNullToEnd(a, b);
});

const sortNullToEnd = (a, b) => {
  if (a == null && b == null) return 0;
  if (a == null) return 1;
  if (b == null) return -1;
  return (a.toLowerCase() > b.toLowerCase() ? 1 : -1);
}

const SubmittedDateCell = props => {
  return React.useMemo(() => {
    const obj = dayjs(props.row.values.submittedOn);
    const daysAgo = dayjs().diff(obj, 'day');
    return (
      <>
        <span>{props.row.values.submittedOn ? obj.format('MM/DD/YYYY') : null}</span>
        <>{daysAgo ? <span> ({daysAgo} days ago)</span> : <span> (today)</span>}</>
      </>
    )
  }, [props.row.values.submittedOn])
}

const columnOptions = {
  maxWidth: 600
}

const columnDefs = [
  {
    id: "rowIndex",
    Header: "Row Index",
    accessor: (row, i) => i,
    shownByDefault: false,
  },
  {
    id: "assignee",
    Header: "Assignee",
    accessor: "assignee.fullName",
    Cell: props => props.row.values.assignee ? <Username>{props.row.values.assignee}</Username> : <UnassignedUser>Unassigned</UnassignedUser>,
    sortType: assigneeSort,
    shownByDefault: true,
  },
  {
    id: "formName",
    Header: "Form Name",
    accessor: "form.name",
    shownByDefault: true,
  },
  {
    id: "submittedOn",
    Header: "Submitted On",
    accessor: "submittedOn",
    Cell: SubmittedDateCell,
    shownByDefault: true,
  }
];

function App() {
  const [tableContainerBounds, setTableContainerBounds] = useState({});
  const [activeColumns, setActiveColumns] = useState(columnDefs.reduce((obj, column) => {
    return {
      ...obj,
      [column.id]: column.shownByDefault
    }
  }, {}));

  const data = React.useMemo(() => makeFormData({}), []);

  const columns = React.useMemo(
    () => {
      const _columns = columnDefs.filter(x => activeColumns[x.id]);
      console.log(_columns);

      const getCalculatedColumnWidth = column => getColumnWidth({
        data,
        accessor: column.accessor,
        headerText: column.Header,
        columnId: column.id,
        options: columnOptions,
      });
      const columnWidths = _columns.reduce((obj, col) => ({
        ...obj,
        [col.id]: getCalculatedColumnWidth(col)
      }), {});
      const totalApportionedColumnWidth = _columns.reduce((total, col) => (total + columnWidths[col.id]), 0);
      const containerToColumnWidthRatio = tableContainerBounds.width / totalApportionedColumnWidth;

      return _columns.map(column => {
        console.log(column);
        return {
          ...column,
          width: columnWidths[column.id] * ((containerToColumnWidthRatio > 1)
            ? containerToColumnWidthRatio
            : 1)
        }
      })

    },
    [tableContainerBounds.width, activeColumns]
  );

  return (
    <>
      <ColumnControls options={columnDefs} activeColumns={activeColumns} setActiveColumns={setActiveColumns} />
      <Measure
        bounds
        onResize={contentRect => {
          setTableContainerBounds(contentRect.bounds);
        }}>
          {({ measureRef }) => (
            <OuterWrapper ref={measureRef}>
              <Table columns={columns} data={data} height={tableContainerBounds.height || 400} />
            </OuterWrapper>
          )}
      </Measure>
    </>
  );
}

export default App;
