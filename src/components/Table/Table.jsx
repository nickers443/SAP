import React, { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import {
  useReactTable,
  flexRender,
  getCoreRowModel,
  createColumnHelper,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
} from '@tanstack/react-table'
import { useDispatch } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBackwardStep, faArrowRight } from '@fortawesome/free-solid-svg-icons'
import TableSelect from '../TableSelect/TableSelect'
import PriceProvider from '../PriceProvider/PriceProvider'
import { addPreOrderItem } from '../../app/dataSlice'
import Button from '../Button/Button'
import Filter from '../Filter/Filter'
import useDeveceType from '../../hooks/useDeviceType'
import TableDescriptionCell from './TableDescriptionCell/TableDescriptionCell'
import './Table.style.scss'

export default function Table() {
  const columnHelper = createColumnHelper()
  const { selectedData } = useSelector((state) => state.codeStore)
  const dispath = useDispatch()
  const [sorted, setSorted] = useState([
    {
      id: 'price',
      desc: false,
    },
  ])

  const [filtred, setFiltered] = useState([])

  const deviceType = useDeveceType()
  const [width, setWidth] = useState(400)
  useEffect(() => {
    if (deviceType) {
      if (deviceType === 'Mobile') {
        setWidth(150)
      } else if (deviceType === 'Tablet') {
        setWidth(250)
      } else {
        setWidth(400)
      }
    }
  }, [deviceType])

  const columns = [
    columnHelper.accessor('expand', {
      enableSorting: false,
      size: 30,
      header: '',
      enableColumnFilter: false,
      cell: ({ row }) => (
        <Button
          onClick={() => {
            dispath(addPreOrderItem(row.original))
          }}
          icon="circlePlus"
          iconSize="xl"
          iconStyle={{ color: '#39a20b' }}
          style={{ background: 'none', padding: 0 }}
        />
      ),
    }),
    columnHelper.accessor('code', {
      header: 'Артикул',
      enableSorting: false,
    }),
    columnHelper.accessor('brand', {
      header: 'Производитель',
      enableSorting: false,
    }),
    columnHelper.accessor('description', {
      header: 'Описание',
      enableSorting: false,
      enableColumnFilter: false,
      cell: (cell) => <TableDescriptionCell cell={cell} />,
    }),
    columnHelper.accessor('price', {
      header: 'Цена',
      enableMultiSort: true,
      enableColumnFilter: false,
      cell: ({ row }) => PriceProvider(row.original.price, row.original.retailPrice),
    }),
    columnHelper.accessor('availability', {
      header: 'Наличие',
      size: width,
      enableMultiSort: false,
      enableSorting: false,
      enableColumnFilter: false,
      cell: (cell) => (
        <TableSelect
          options={cell.getValue()}
          id={cell.row.original.id}
          provider={cell.row.original.providerEng}
        />
      ),
    }),
    columnHelper.accessor('provider', {
      header: 'Поставщик',
      enableSorting: false,
    }),
  ]

  const table = useReactTable({
    data: selectedData,
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    enableSorting: true,
    enableSortingRemoval: false,
    state: {
      columnFilters: filtred,
      sorting: sorted,
    },
    onSortingChange: setSorted,
    onColumnFiltersChange: setFiltered,
  })
  useMemo(() => [table.setPageSize(10)], [])

  return (
    <div className="main table">
      <table style={{ tableLayout: 'fixed', width: '100%' }}>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  onClick={header.column.getToggleSortingHandler()}
                  style={{
                    width: header.getSize() !== 150 ? header.getSize() : undefined,
                  }}>
                  {header.placeholderId ? null : (
                    <div>
                      {header.column.getCanFilter() ? (
                        <div>
                          <Filter column={header.column} table={table} />
                        </div>
                      ) : null}
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {{ asc: '▲', desc: '▼' }[header.column.getIsSorted() ?? null]}
                    </div>
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="paginationWrapper main">
        <button
          className="paginationButton"
          disabled={!table.getCanPreviousPage()}
          onClick={() => table.setPageIndex(0)}>
          <FontAwesomeIcon style={{ marginRight: '8px' }} icon={faBackwardStep} />
          Первая страница
        </button>
        <button
          className="paginationButton"
          disabled={!table.getCanPreviousPage()}
          onClick={() => table.previousPage()}>
          <FontAwesomeIcon style={{ marginRight: '8px' }} icon={faArrowRight} rotation={180} />
          Пред. страница
        </button>
        <button
          className="paginationButton"
          disabled={!table.getCanNextPage()}
          onClick={() => table.nextPage()}>
          След. страница
          <FontAwesomeIcon style={{ marginLeft: '8px' }} icon={faArrowRight} />
        </button>
        <button
          className="paginationButton"
          disabled={!table.getCanNextPage()}
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}>
          Последняя страница
          <FontAwesomeIcon style={{ marginLeft: '8px' }} icon={faBackwardStep} rotation={180} />
        </button>
        {/* {data?.length > 1 && (
          <p>{`Всего показано ${Number(table.getRowModel().rows[0]?.id) + 1} - ${
            Number(table.getRowModel().rows[table.getRowModel()?.rows?.length - 1]?.id) + 1
          } кросов из ${data?.length}`}</p>
        )} */}
      </div>
    </div>
  )
}
