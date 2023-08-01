export function parseMikado(array) {
  function parse(object, index) {
    return {
      id: index + 'mikado',
      code: object.ProducerCode,
      brand: object.ProducerBrand,
      description: object.Name,
      price: object.PriceRUR,
      provider: 'Микадо',
      providerEng: 'mikado',
      availability: getAvailability(object.OnStocks.StockLine),
    }
  }

  function getAvailability(stockLine) {
    if (typeof stockLine === 'object' && !Array.isArray(stockLine) && stockLine !== null) {
      return [
        {
          location: stockLine.StokName,
          quantity: stockLine.StockQTY,
          deliveryDelay: stockLine.DeliveryDelay,
        },
      ]
    }
    if (stockLine.length >= 1) {
      return stockLine.map((stock) => {
        return {
          location: stock.StokName,
          quantity: stock.StockQTY,
          deliveryDelay: stock.DeliveryDelay,
        }
      })
    }
  }

  return array.map((part, index) => {
    const result = parse(part, index)
    return result
  })
}

export function parseRossko(array) {
  return array.map((element) => {
    return {
      brand: element.brand,
      crosses: element?.crosses.Part.map((part) => {
        return {
          code: part.partnumber,
          brand: part.brand,
          description: part.name,
          price: part?.stocks.stock[0].price,
          provider: 'Росско',
          availability: part?.stocks.stock.map((magazine) => {
            return {
              location: magazine.description,
              quantity: magazine.count,
              deliveryDelay: magazine.delivery,
            }
          }),
        }
      }),
    }
  })
}
