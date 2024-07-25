import PropTypes from 'prop-types';
import { useMemo, useRef, useState } from 'react';

// material-ui
import { Chip, Paper, Table, TableBody, TableContainer, TableCell, TableHead, TableRow, Stack, Box } from '@mui/material';

// third-party
import { flexRender, useReactTable, getGroupedRowModel, getExpandedRowModel, getCoreRowModel } from '@tanstack/react-table';
// import { useVirtual } from '@tanstack/react-virtual';

// project import
import ScrollX from 'components/ScrollX';
import MainCard from 'components/MainCard';
import IconButton from 'components/@extended/IconButton';
import { CSVExport } from 'components/third-party/react-table';
import LinearWithLabel from 'components/@extended/progress/LinearWithLabel';

import makeData from 'data/react-table';

// assets
import { DownOutlined, GroupOutlined, RightOutlined, UngroupOutlined } from '@ant-design/icons';

// ==============================|| REACT TABLE ||============================== //

function ReactTable({ columns, data }) {
  const [grouping, setGrouping] = useState(['age']);

  const table = useReactTable({
    data,
    columns,
    state: {
      grouping
    },
    onGroupingChange: setGrouping,
    getExpandedRowModel: getExpandedRowModel(),
    getGroupedRowModel: getGroupedRowModel(),
    getCoreRowModel: getCoreRowModel(),
    debugTable: true
  });

  const tableContainerRef = useRef(null);

  const { rows } = table.getRowModel();
  const rowVirtualizer = useVirtual({
    parentRef: tableContainerRef,
    size: rows.length,
    overscan: 10
  });
  const { virtualItems: virtualRows, totalSize } = rowVirtualizer;

  const paddingTop = virtualRows.length > 0 ? virtualRows?.[0]?.start || 0 : 0;
  const paddingBottom = virtualRows.length > 0 ? totalSize - (virtualRows?.[virtualRows.length - 1]?.end || 0) : 0;

  let headers = [];
  table.getAllColumns().map((columns) =>
    headers.push({
      label: typeof columns.columnDef.header === 'string' ? columns.columnDef.header : '#',
      // @ts-ignore
      key: columns.columnDef.accessorKey
    })
  );

  return (
    <MainCard
      content={false}
      title="Grouping"
      secondary={<CSVExport {...{ data: table.getGroupedRowModel().rows.map((row) => row.original), headers, filename: 'grouping.csv' }} />}
    >
      <ScrollX>
        <TableContainer component={Paper} ref={tableContainerRef} sx={{ maxHeight: 544 }}>
          <Table>
            <TableHead className="sticky-header">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableCell key={header.id} {...header.column.columnDef.meta}>
                      {header.isPlaceholder ? null : (
                        <Stack direction="row" alignItems="center">
                          {header.column.getCanGroup() && (
                            <IconButton
                              color={header.column.getIsGrouped() ? 'error' : 'primary'}
                              onClick={header.column.getToggleGroupingHandler()}
                              size="small"
                              sx={{ p: 0, width: 24, height: 24, fontSize: '1rem', mr: 0.75 }}
                            >
                              {header.column.getIsGrouped() ? <UngroupOutlined /> : <GroupOutlined />}
                            </IconButton>
                          )}
                          {flexRender(header.column.columnDef.header, header.getContext())}
                        </Stack>
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableHead>
            <TableBody>
              {paddingTop > 0 && (
                <TableRow>
                  <TableCell sx={{ height: `${paddingTop}px` }} />
                </TableRow>
              )}
              {virtualRows.map((virtualRow) => {
                const row = rows[virtualRow.index];
                return (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => {
                      let bgcolor = 'background.paper';
                      if (cell.getIsGrouped()) bgcolor = 'primary.lighter';
                      if (cell.getIsAggregated()) bgcolor = 'warning.lighter';
                      if (cell.getIsPlaceholder()) bgcolor = 'error.lighter';

                      if (cell.column.columnDef.meta !== undefined && cell.column.getCanSort()) {
                        Object.assign(cell.column.columnDef.meta, {
                          style: { backgroundColor: bgcolor }
                        });
                      }

                      return (
                        <TableCell
                          key={cell.id}
                          {...cell.column.columnDef.meta}
                          sx={{ bgcolor }}
                          {...(cell.getIsGrouped() &&
                            cell.column.columnDef.meta === undefined && {
                              style: { backgroundColor: bgcolor }
                            })}
                        >
                          {cell.getIsGrouped() ? (
                            <Stack direction="row" alignItems="center" spacing={0.5}>
                              <IconButton
                                color="secondary"
                                onClick={row.getToggleExpandedHandler()}
                                size="small"
                                sx={{ p: 0, width: 24, height: 24 }}
                              >
                                {row.getIsExpanded() ? <DownOutlined /> : <RightOutlined />}
                              </IconButton>
                              <Box>{flexRender(cell.column.columnDef.cell, cell.getContext())}</Box> <Box>({row.subRows.length})</Box>
                            </Stack>
                          ) : cell.getIsAggregated() ? (
                            flexRender(cell.column.columnDef.aggregatedCell ?? cell.column.columnDef.cell, cell.getContext())
                          ) : cell.getIsPlaceholder() ? null : (
                            flexRender(cell.column.columnDef.cell, cell.getContext())
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
              {paddingBottom > 0 && (
                <TableRow>
                  <TableCell sx={{ height: `${paddingBottom}px` }} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </ScrollX>
    </MainCard>
  );
}

ReactTable.propTypes = {
  columns: PropTypes.array,
  data: PropTypes.array
};

// ==============================|| REACT TABLE - GROUPING ||============================== //

const Grouping = () => {
  const data = makeData(100);

  const columns = useMemo(
    () => [
      {
        header: 'Name',
        accessorKey: 'fullName',
        enableGrouping: false
      },
      {
        header: 'Email',
        accessorKey: 'email',
        enableGrouping: false
      },
      {
        header: 'Age',
        accessorKey: 'age',
        meta: {
          className: 'cell-right'
        }
      },
      {
        header: 'Visits',
        accessorKey: 'visits',
        enableGrouping: false,
        meta: {
          className: 'cell-right'
        }
      },
      {
        header: 'Status',
        accessorKey: 'status',
        cell: (cell) => {
          switch (cell.getValue()) {
            case 'Complicated':
              return <Chip color="error" label="Complicated" size="small" variant="light" />;
            case 'Relationship':
              return <Chip color="success" label="Relationship" size="small" variant="light" />;
            case 'Single':
            default:
              return <Chip color="info" label="Single" size="small" variant="light" />;
          }
        }
      },
      {
        header: 'Profile Progress',
        accessorKey: 'progress',
        cell: (cell) => <LinearWithLabel value={cell.getValue()} sx={{ minWidth: 75 }} />,
        enableGrouping: false
      }
    ],
    []
  );

  return <ReactTable {...{ data, columns }} />;
};

export default Grouping;
