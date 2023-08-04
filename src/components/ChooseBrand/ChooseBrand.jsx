import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Button from '../Button/Button'
import { selectBrand, selectData } from '../../app/dataSlice'
import './ChooseBrand.style.scss'

export default function ChooseBrand() {
  const { brands, data } = useSelector((state) => state.codeStore)
  const dispatch = useDispatch()

  const parsedDataForTable = (data, selectedBrand) => {
    const result = []

    data.forEach((provider) => {
      if (provider.provider === 'mikado') {
        provider.result.forEach((cross) => result.push(cross))
      } else {
        provider.result.forEach((brand) => {
          if (brand.brand.toLowerCase() === selectedBrand) {
            brand.crosses.forEach((cross) => {
              result.push(cross)
            })
          }
        })
      }
    })

    return result
  }

  const handleClick = (brand) => {
    dispatch(selectBrand(brand))
    dispatch(selectData(parsedDataForTable(data, brand)))
  }

  return (
    <div className="main chooseBrand">
      <h3>Выбери нужного производителя</h3>
      <div className="chooseBrand__button-section">
        {brands.length >= 1 &&
          brands.map((brand, index) => {
            return (
              <Button
                key={index}
                type="button"
                children={brand}
                onClick={() => handleClick(brand.toLowerCase())}
              />
            )
          })}
      </div>
    </div>
  )
}
