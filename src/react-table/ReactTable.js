import React, { useCallback } from "react";
import styled from "@emotion/styled";
import { useTable, useBlockLayout, useSortBy } from "react-table";
import { FixedSizeList } from "react-window";
import memoize from 'memoize-one';
import getColumnWidth from './getColumnWidth';

import makeData from "./makeData";

const borderWidth = 1;

const Styles = styled.div`
  padding: 1rem;

  * {
    box-sizing: border-box;
  }

  .table {
    display: inline-block;
    border-spacing: 0;
    border: ${borderWidth}px solid black;

    .headerRow {
      overflow-y: scroll;
    }

    .tr {
      :last-child {
        .td {
          border-bottom: 0;
        }
      }
    }

    .th,
    .td {
      margin: 0;
      padding: 0.5rem;
      border-bottom: ${borderWidth}px solid black;
      border-right: ${borderWidth}px solid black;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;

      :last-child {
        border-right: 0;
      }
    }
  }
`;

function Table({ columns, data }) {
  // Use the state and functions returned from useTable to build your UI

  const defaultColumn = React.useMemo(
    () => ({
      width: 150
    }),
    []
  );

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

  const RenderRow = React.useCallback(
    ({ index, style }) => {
      const row = rows[index];
      prepareRow(row);
      return (
        <div
          {...row.getRowProps({
            style
          })}
          className="tr"
        >
          {row.cells.map(cell => {
            return (
              <div {...cell.getCellProps()} className="td">
                {cell.render("Cell")}
              </div>
            );
          })}
        </div>
      );
    },
    [prepareRow, rows]
  );

  // Render the UI for your table
  return (
    <div {...getTableProps()} className="table">
      <div>
        {headerGroups.map(headerGroup => (
          <div {...headerGroup.getHeaderGroupProps()} className="tr headerRow">
            {headerGroup.headers.map(column => (
              <div {...column.getHeaderProps(column.getSortByToggleProps())} className="th">
                {column.render("Header")}
                <span style={{fontSize: '.666em'}}>
                  {column.isSorted
                    ? column.isSortedDesc
                      ? ' 🔽'
                      : ' 🔼'
                    : ''}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>

      <div {...getTableBodyProps()}>
        <FixedSizeList
          height={400}
          itemCount={rows.length}
          itemSize={35}
          width={totalColumnsWidth}
        >
          {RenderRow}
        </FixedSizeList>
      </div>
    </div>
  );
}

const randoSort = memoize((a, b) => {
  const num = Math.random() - 0.5;
  return num;
})

function App() {

  const data = React.useMemo(() => makeData(2000), []);

  const columns = React.useMemo(
    () => [
      {
        Header: "Row Index",
        accessor: (row, i) => i
      },
      {
        Header: "First Name",
        accessor: "firstName",
        width: getColumnWidth(data, 'firstName', "First Name"),
      },
      {
        Header: "Last Name",
        accessor: "lastName",
        width: getColumnWidth(data, 'lastName', "Last Name"),
        // sortType: randoSort,
      },
      {
        Header: "Row",
        accessor: "age",
        width: getColumnWidth(data, 'age', "Row"),
        // width: 50
        minWidth: 50
      },
      {
        Header: "Visits",
        accessor: "visits",
        width: getColumnWidth(data, 'visits', "Visits"),
        minWidth: 60
        // width: 60
      },
      {
        Header: "Status",
        accessor: "status",
        width: getColumnWidth(data, 'status', "Status"),
      },
      {
        Header: "Profile Progress",
        accessor: "progress",
        width: getColumnWidth(data, 'progress', "Profile Progress"),
      }
    ],
    []
  );


  return (
    <Styles>
      <Table columns={columns} data={data} />
    </Styles>
  );
}

export default App;
