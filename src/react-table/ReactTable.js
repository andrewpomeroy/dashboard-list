import React, { useState } from "react";
import styled from "@emotion/styled";
import { useTable, useBlockLayout, useSortBy } from "react-table";
import { FixedSizeList } from "react-window";
import memoize from 'memoize-one';
import Measure from 'react-measure'
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
  const [tableContainerWidth, setTableContainerWidth] = useState();

  const data = React.useMemo(() => makeData(2000), []);

  const columns = React.useMemo(
    () => {
      const _columns = [
        {
          Header: "Row Index",
          accessor: (row, i) => i,
        },
        {
          Header: "First Name",
          accessor: "firstName",
        },
        {
          Header: "Last Name",
          accessor: "lastName",
          // sortType: randoSort,
        },
        {
          Header: "Row",
          accessor: "age",
          minWidth: 50
        },
        {
          Header: "Visits",
          accessor: "visits",
          minWidth: 60
        },
        {
          Header: "Status",
          accessor: "status",
        },
        {
          Header: "Profile Progress",
          accessor: "progress",
        }
      ];

      const getCalculatedColumnWidth = column => getColumnWidth(data, column.accessor, column.Header);
      const totalApportionedColumnWidth = _columns.reduce((total, x) => (total + getCalculatedColumnWidth(x)), 0);
      const containerToColumnWidthRatio = tableContainerWidth / totalApportionedColumnWidth;

      return _columns.map(col => {
        return {
          ...col,
          width: getColumnWidth(data, col.accessor, col.Header) * ((containerToColumnWidthRatio > 1)
            ? containerToColumnWidthRatio
            : 1)
        }
      })

    },
    [tableContainerWidth]
  );
  

  return (
    <Styles>
      <Measure
      bounds
      onResize={contentRect => {
        console.log("container width:", contentRect.bounds.width);
        setTableContainerWidth(contentRect.bounds.width);
      }}>
        {({ measureRef }) => (
          <div ref={measureRef}> 
            <Table columns={columns} data={data} />
          </div>
        )}
      </Measure>
    </Styles>
  );
}

export default App;
