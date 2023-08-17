import _ from 'lodash'

function availabilityType(obj) {
  return {
    location: obj.StokName,
    quantity: obj.StockQTY,
    multiplicity: obj.MinZakazQTY || 1,
    deliveryDelay: Number(obj.DeliveryDelay),
  }
}

export function formatCode(s) {
  return String(s).replace(/[^\w\s]/gi, '')
}

export function parseMikado(array) {
  function parse(object, index) {
    const availabilityData = getAvailability(object.OnStocks.StockLine)
    availabilityData.pop()
    return {
      id: index + 'mik',
      code: formatCode(object.ProducerCode),
      brand: object.ProducerBrand,
      description: object.Name,
      price: object.PriceRUR,
      provider: 'Микадо',
      providerEng: 'mikado',
      availability: availabilityData,
    }
  }

  function getAvailability(stockLine) {
    if (typeof stockLine === 'object' && !Array.isArray(stockLine) && stockLine !== null) {
      return [availabilityType(stockLine)]
    }
    if (stockLine.length >= 1) {
      return stockLine.map((stock) => {
        return availabilityType(stock)
      })
    }
  }

  return array.map((part, index) => {
    const result = parse(part, index)
    return result
  })
}

export function parseRossko(array) {
  function getDelivery(data) {
    return data.map((item) => {
      return {
        location: item.description,
        quantity: item.count,
        multiplicity: item.multiplicity,
        deliveryDelay: Number(item.delivery),
      }
    })
  }

  function setTemplate(part, delivery, index) {
    return {
      id: index + 'rosk',
      code: formatCode(part.partnumber),
      brand: part.brand,
      description: part.name,
      price: part?.stocks.stock[0].price,
      provider: 'Росско',
      availability: getDelivery(delivery),
    }
  }

  return array.map((element, index) => {
    const mathed = _.has(element, 'stocks.stock')
      ? setTemplate(element, element.stocks.stock, 'math')
      : []

    return {
      brand: element.brand,
      math: mathed,
      crosses: element?.crosses.Part.map((part, index) => {
        return setTemplate(part, part.stocks.stock, index)
      }),
    }
  })
}
