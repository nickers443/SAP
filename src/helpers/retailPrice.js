export function retailMargin(num, margin) {
  let persent
  const price = Number(num)
  if (price <= 1000) persent = margin.oneLevel.margin
  if ((price > 1000) & (price <= 4000)) persent = margin.twoLevel.margin
  if ((price > 4000) & (price <= 10000)) persent = margin.treeLevel.margin
  if (price > 10000) persent = margin.fourLevel.margin

  return Math.ceil(Math.round(price + Number(price * persent) / 100) / 50) * 50
}

export function addRetailPrice(obj, margin) {
  return {
    ...obj,
    selectDelivery: obj.availability[0],
    retailPrice: retailMargin(obj.price, margin),
  }
}
