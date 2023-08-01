export function retailMargin(num, margin) {
  let persent
  if (num <= 1000) persent = margin.oneLevel.margin
  if ((num > 1000) & (num <= 4000)) persent = margin.twoLevel.margin
  if ((num > 4000) & (num <= 10000)) persent = margin.treeLevel.margin
  if (num > 10000) persent = margin.fourLevel.margin

  return Math.ceil(Math.round(num + Number(num * persent) / 100) / 50) * 50
}
