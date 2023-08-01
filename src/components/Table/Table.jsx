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
import TruncateText from '../TruncateText/TruncateText'
import Button from '../Button/Button'
import './Table.style.scss'

export default function Table() {
  const columnHelper = createColumnHelper()

  const {
    data: { mikado },
    preOffer,
  } = useSelector((state) => state.codeStore)
  const dispath = useDispatch()

  const [sorted, setSorted] = useState([])

  const columns = useMemo(
    () => [
      columnHelper.accessor('expand', {
        enableSorting: false,
        size: 30,
        header: '',
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
        size: 80,
      }),
      columnHelper.accessor('brand', {
        header: 'Производитель',
        enableSorting: false,
      }),
      columnHelper.accessor('description', {
        header: 'Описание',
        enableSorting: false,
        cell: (cell) => <TruncateText text={cell.getValue()} maxWords={3} />,
      }),
      columnHelper.accessor('price', {
        header: 'Цена',
        cell: ({ row }) => PriceProvider(row.original.price, row.original.retailPrice),
      }),
      columnHelper.accessor('availability', {
        header: 'Наличие',
        enableSorting: false,
        minSize: 220,
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
    ],
    [],
  )

  const table = useReactTable({
    data: mikado,
    columns: columns,
    enableMultiRowSelection: true,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting: sorted,
    },
    onSortingChange: setSorted,
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
        <p>{`Всего показано ${Number(table.getRowModel().rows[0].id) + 1} - ${
          Number(table.getRowModel().rows[table.getRowModel()?.rows?.length - 1].id) + 1
        } кросов из ${mikado?.length}`}</p>
      </div>
    </div>
  )
}

// columnHelper.accessor('expand', {
//   enableSorting: false,
//   size: 30,
//   header: '',
//   cell: ({ row }) => (
//     <div
//       style={{
//         paddingLeft: `${row.depth * 2}rem`,
//       }}>
//       <IndeterminateCheckbox
//         {...{
//           checked: row.getIsSelected(),
//           indeterminate: row.getIsSomeSelected(),
//           onChange: row.getToggleSelectedHandler(),
//         }}
//       />
//     </div>
//   ),
// }),
