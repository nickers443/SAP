import { createClientAsync } from 'soap'
import ky from 'ky-universal'
import XMLParser from 'fast-xml-parser'
import { parseMikado, parseRossko } from './helpers.mjs'
import 'dotenv/config'

const parser = new XMLParser.XMLParser()

const nameToConfigMapping = {
  mikado: {
    url: process.env.MIKADO_URL,
    clientId: process.env.MIKADO_CLIENT_ID,
    password: process.env.MIKADO_CLIENT_PASSWORD,
    fromStockOnly: 'FromStockOnly',
    async getData(searchCode) {
      try {
        const body = new URLSearchParams()
        body.append('Search_Code', searchCode)
        body.append('Password', this.password)
        body.append('ClientID', this.clientId)
        body.append('FromStockOnly', this.fromStockOnly)
        const response = await ky
          .post(this.url, {
            body,
          })
          .text()

        const {
          Code_List: {
            List: { Code_List_Row },
          },
        } = parser.parse(response)

        if (typeof Code_List_Row === 'undefined') return 'Ничего не найдено'
        return parseMikado(Code_List_Row)
      } catch (error) {
        console.error(error)
      }
    },
  },
  rossko: {
    url: process.env.ROSSKO_URL,
    url_getAddres: process.env.ROSSKO_URL_GETADDRESS_ID,
    KEY1: process.env.ROSSKO_KEY1,
    KEY2: process.env.ROSSKO_KEY2,
    delivery_id: process.env.ROSSKO_DELIVERY_ID,
    address_id: process.env.ROSSKO_ADDRESS_ID_SHOP,
    async getData(searchCode) {
      const param = {
        KEY1: this.KEY1,
        KEY2: this.KEY2,
        text: searchCode,
        delivery_id: this.delivery_id,
        address_id: this.address_id,
      }
      const client = await createClientAsync(this.url)
      return new Promise((resolve, reject) => {
        client.GetSearch(param, (err, result) => {
          if (err) {
            console.error(err)
            return reject([])
          }

          if (!result.SearchResult.success) return resolve(result.SearchResult.message)

          const {
            SearchResult: {
              PartsList: { Part },
            },
          } = result

          return resolve(parseRossko(Part))
        })
      })
    },
    async getAdressId() {
      const param = {
        KEY1: this.KEY1,
        KEY2: this.KEY2,
      }
      const client = await createClientAsync(this.url_getAddres)
      return new Promise((resolve, reject) => {
        client.GetCheckoutDetails(param, (err, result) => {
          if (err) {
            console.error(err)
            return reject([])
          }
          return result
        })
      })
    },
  },
}

export default async function search(searchCode) {
  const data = []
  const sources = Object.keys(nameToConfigMapping)
  for (const source of sources) {
    const result = await nameToConfigMapping[source].getData(searchCode)
    data.push({ provider: source, result })
  }
  return data
}
