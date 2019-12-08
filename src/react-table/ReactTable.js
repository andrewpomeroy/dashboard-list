import React, { useState, useReducer, useEffect, useRef } from "react";
import styled from "@emotion/styled";
import { useTable, useBlockLayout, useSortBy } from "react-table";
import { VariableSizeList as List } from "react-window";
import memoize from 'memoize-one';
import Measure from 'react-measure'
import getColumnWidth from './getColumnWidth';

import makeData from "./makeData";

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

  const [activeItem, setActiveItem] = useState(0);
  const listRef = useRef({})
 
  // const getItemSize = memoize(
  //   index => index === activeItem ? 55 : 35
  // )
  // const getItemSize = React.useMemo(
    //   () => index => index === activeItem ? 55 : 35,
    //   [index, activeItem]
    // )
    // console.log(getItemSize);
    // const getItemSize = 

  useEffect(() => {
    const id = setTimeout(() => {
      console.log(activeItem);
      setActiveItem(activeItem + 1);
      if (listRef.current) {
        listRef.current.resetAfterIndex(activeItem + 1);
      }
    }, 500);
    return () => clearTimeout(id);
  }, [activeItem])

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

      
  // const getItemSize = React.useMemo(() => {
  //   console.log("memo", activeItem);
  //   return memoize(index => {
  //     console.log("inside", activeItem);
  //     return index === activeItem ? 55 : 35
  //   });
  // }, [activeItem])
      
  const getItemSize = index => {
      console.log("inside", activeItem);
      return index === activeItem ? 55 : 35
    };

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
    </div>
  );
}

const randoSort = memoize((a, b) => {
  const num = Math.random() - 0.5;
  return num;
})

function App() {
  const [tableContainerBounds, setTableContainerBounds] = useState({});

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
      const containerToColumnWidthRatio = tableContainerBounds.width / totalApportionedColumnWidth;

      return _columns.map(col => {
        return {
          ...col,
          width: getColumnWidth(data, col.accessor, col.Header) * ((containerToColumnWidthRatio > 1)
            ? containerToColumnWidthRatio
            : 1)
        }
      })

    },
    [tableContainerBounds.width]
  );

  return (
    <Measure
      bounds
      onResize={contentRect => {
        console.log("container width:", contentRect.bounds.width);
        console.log("container height:", contentRect.bounds.height);
        setTableContainerBounds(contentRect.bounds);
      }}>
        {({ measureRef }) => (
          <OuterWrapper ref={measureRef}>
            <Table columns={columns} data={data} height={tableContainerBounds.height || 400} />
          </OuterWrapper>
        )}
    </Measure>
  );
}

export default App;