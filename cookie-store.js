// Product catalog: prices are for six-cookie boxes and stored as cents.
const PRODUCTS = [
  { id: 'chocolate-chip', name: 'Chocolate Chip', description: 'A classic cookie with crisp edges and plenty of chocolate.', price: 850 },
  { id: 'oatmeal-raisin', name: 'Oatmeal Raisin', description: 'Chewy oats, sweet raisins, and a hint of cinnamon.', price: 800 },
  { id: 'peanut-butter', name: 'Peanut Butter', description: 'Soft, nutty cookies with the familiar fork-pressed top.', price: 900 },
  { id: 'sugar', name: 'Sugar', description: 'Buttery, tender cookies with a delicate vanilla flavor.', price: 750 },
]

// Cache the product, cart, and checkout elements used by the store.
const productList = document.querySelector('#product-list')
const cartItems = document.querySelector('#cart-items')
const cartEmpty = document.querySelector('#cart-empty')
const cartTotal = document.querySelector('#cart-total')
const checkoutForm = document.querySelector('#checkout-form')
const checkoutButton = document.querySelector('#place-order')
const checkoutStatus = document.querySelector('#checkout-status')
const cart = new Map()

// Format a cent amount as a US dollar price for display.
function formatPrice(cents) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(cents / 100)
}

// Add or remove boxes, then refresh the order summary.
function changeQuantity(productId, amount) {
  const quantity = Math.max(0, (cart.get(productId) || 0) + amount)
  if (quantity === 0) {
    cart.delete(productId)
  } else {
    cart.set(productId, quantity)
  }
  renderCart()
}

// Build one product card and connect its button to the order cart.
function createProductCard(product) {
  const card = document.createElement('article')
  card.className = 'store-product'

  const name = document.createElement('h3')
  name.textContent = `${product.name} Cookies`

  const description = document.createElement('p')
  description.textContent = product.description

  const price = document.createElement('p')
  price.className = 'store-product-price'
  price.textContent = `6-cookie box - ${formatPrice(product.price)}`

  const addButton = document.createElement('button')
  addButton.type = 'button'
  addButton.textContent = 'Add a box'
  addButton.addEventListener('click', () => changeQuantity(product.id, 1))

  card.append(name, description, price, addButton)
  return card
}

// Rebuild the cart rows and recalculate the total after every change.
function renderCart() {
  cartItems.replaceChildren()
  let total = 0

  for (const product of PRODUCTS) {
    const quantity = cart.get(product.id) || 0
    if (quantity === 0) continue

    const lineTotal = product.price * quantity
    total += lineTotal

    const item = document.createElement('li')
    item.className = 'store-cart-item'

    const details = document.createElement('span')
    details.textContent = `${product.name} Cookies - ${quantity} box${quantity === 1 ? '' : 'es'} (${formatPrice(lineTotal)})`

    const controls = document.createElement('span')
    controls.className = 'store-quantity-controls'

    const removeButton = document.createElement('button')
    removeButton.type = 'button'
    removeButton.textContent = '-'
    removeButton.setAttribute('aria-label', `Remove one ${product.name} cookie box`)
    removeButton.addEventListener('click', () => changeQuantity(product.id, -1))

    const addButton = document.createElement('button')
    addButton.type = 'button'
    addButton.textContent = '+'
    addButton.setAttribute('aria-label', `Add one ${product.name} cookie box`)
    addButton.addEventListener('click', () => changeQuantity(product.id, 1))

    controls.append(removeButton, addButton)
    item.append(details, controls)
    cartItems.append(item)
  }

  const hasItems = cart.size > 0
  cartItems.hidden = !hasItems
  cartEmpty.hidden = hasItems
  cartTotal.textContent = `Order total: ${formatPrice(total)}`
  checkoutButton.disabled = !hasItems
  checkoutStatus.textContent = ''
}

// Add all catalog products to the store page.
for (const product of PRODUCTS) {
  productList.append(createProductCard(product))
}

// Confirm the demo order locally without sending or storing customer details.
checkoutForm.addEventListener('submit', (event) => {
  event.preventDefault()
  checkoutStatus.textContent = 'Demo order confirmed. No payment was taken and no personal details were sent or saved.'
  checkoutForm.reset()
})

renderCart()
