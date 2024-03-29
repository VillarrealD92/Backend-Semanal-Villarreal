import { expect } from "chai"
import { generateProduct } from "../utils.js"
import { faker } from "@faker-js/faker"
import supertest from "supertest"

const requester = supertest(`http://127.0.0.1:8080`)

describe("Testing api", () => {

  const userMock = {
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    email: faker.internet.email(),
    age: faker.number.int({min: 10, max: 100}),
    password: faker.internet.password(),
    role: "user"
  }

  describe("Carts", () => {
    it("POST /api/carts debe crear un carrito", async () => {
      const {_body} = await requester?.post(`/api/carts`)
      const cart = _body?.payload
      expect(typeof cart, "Objeto").to.be.deep.eq("object")
      expect(cart, "Carrito creado").to.have.property("_id")
    })
  })


  describe("Session", () => {
    it("POST /api/session/register", async () => {
      const { ok } = await requester.post(`/api/session/register`).send(userMock)
      expect(ok).to.be.ok
    })
  })

  describe("Products", () => {
    it("GET /api/products debe retornar un array de productos filtrados o no filtrados", async () => {
      const {status, ok, _body} = await requester.get(`/api/products?sort=asc`)
      const products = _body?.payload
      expect(ok).to.be.ok
      expect(Array.isArray(products), "Array").to.be.equal(true)
      products?.length > 1 && expect(products[0]?.price, "Filtracion por precio").to.be.lessThanOrEqual(products[1]?.price)
    })
    
    const productMock = generateProduct()
    
  })
})