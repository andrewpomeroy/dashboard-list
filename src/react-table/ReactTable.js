import React, { useState, useRef } from "react";
import styled from "@emotion/styled/macro";
import { useTable, useBlockLayout, useSortBy } from "react-table";
import { VariableSizeList as List } from "react-window";
import memoize from 'memoize-one';
import Measure from 'react-measure';
import dayjs from 'dayjs';
import getColumnWidth from './getColumnWidth';
import ColumnControls from './ColumnControls';
import { Table as TableComponent, Row, HeaderRow, Cell, HeaderCell } from './tableUI';
import { Username, UnassignedUser, PrimaryText } from './commonComponents';
// Fake, generated table data
import makeSubmissionData from "./makeSubmissionData";

const OuterWrapper = styled.div`
  flex: 1;
  width: 100%;
  overflow-x: auto;
  * {
    box-sizing: border-box;
  }
`;

const InnerWrapper = styled.div`
  width: 100%;
  height: 100%;
`

function Table({ columns, data, height }) {

  const defaultColumn = React.useMemo(
    () => ({
      width: 150
    }),
    []
  );

  const listRef = useRef({});

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
      
  // TODO: Implement row measurement to produce dynamic heights for table entries.
  // We'll be able to expand rows when they're clicked on, etc..
  const getItemSize = index => {
    return 46
    // return index === activeItem ? 100 : 46
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
          isOdd={index % 2}
        >
          {row.cells.map(cell => {
            return (
              <Cell {...cell.getCellProps()} className="td">
                {cell.render("Cell")}
              </Cell>
            );
          })}
        </Row>
      );
    },
    [prepareRow, rows]
  );

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
          width={totalColumnsWidth || 0}
        >
          {RenderRow}
        </List>
      </div>
    </TableComponent>
  );
}

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
    id: "formName",
    Header: "Form Name",
    accessor: "form.name",
    Cell: props => <PrimaryText>{props.row.values.formName}</PrimaryText>,
    shownByDefault: true,
    maxCharLength: 80,
  },
  {
    id: "submittedOn",
    Header: "Submitted On",
    accessor: "submittedOn",
    Cell: SubmittedDateCell,
    shownByDefault: true,
  },
  {
    id: "assignee",
    Header: "Assignee",
    accessor: "assignee.fullName",
    Cell: props => props.row.values.assignee ? <Username>{props.row.values.assignee}</Username> : <UnassignedUser>Unassigned</UnassignedUser>,
    sortType: assigneeSort,
    shownByDefault: true,
  },
];

function App() {
  const [tableContainerBounds, setTableContainerBounds] = useState({});
  const [activeColumns, setActiveColumns] = useState(columnDefs.reduce((obj, column) => {
    return {
      ...obj,
      [column.id]: column.shownByDefault
    }
  }, {}));

  const data = React.useMemo(() => makeSubmissionData({}), []);

  const columns = React.useMemo(
    () => {
      const _columns = columnDefs.filter(x => activeColumns[x.id]);

      const getCalculatedColumnWidth = column => getColumnWidth({
        data,
        column,
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
          width: columnWidths[column.id] * containerToColumnWidthRatio
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
          setTableContainerBounds({
            ...contentRect.bounds,
            width: contentRect.bounds.width
          });
        }}>
          {({ measureRef }) => (
            <OuterWrapper>
              <InnerWrapper ref={measureRef}>
                <Table columns={columns} data={data} height={tableContainerBounds.height || 400} />
              </InnerWrapper>
            </OuterWrapper>
          )}
      </Measure>
    </>
  );
}

export default App;
