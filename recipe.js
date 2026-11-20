const RECIPE_YIELD = 12

const COOKIE_TYPES = [
  {
    name: 'Chocolate Chip Cookies',
    ingredients: [
      { amount: 1.5, unit: 'cup', name: 'All-purpose flour' },
      { amount: 0.5, unit: 'cup', name: 'Butter' },
      { amount: 0.5, unit: 'cup', name: 'Brown sugar' },
      { amount: 0.25, unit: 'cup', name: 'Granulated sugar' },
      { amount: 1, unit: 'large egg', name: '' },
      { amount: 1, unit: 'tsp', name: 'Vanilla extract' },
      { amount: 0.5, unit: 'tsp', name: 'Baking soda' },
      { amount: 0.25, unit: 'tsp', name: 'Salt' },
      { amount: 1, unit: 'cup', name: 'Chocolate chips' },
    ],
  },
  {
    name: 'Oatmeal Raisin Cookies',
    ingredients: [
      { amount: 1, unit: 'cup', name: 'All-purpose flour' },
      { amount: 0.5, unit: 'cup', name: 'Butter' },
      { amount: 0.5, unit: 'cup', name: 'Brown sugar' },
      { amount: 1, unit: 'large egg', name: '' },
      { amount: 0.5, unit: 'tsp', name: 'Vanilla extract' },
      { amount: 1.5, unit: 'cup', name: 'Rolled oats' },
      { amount: 0.5, unit: 'tsp', name: 'Cinnamon' },
      { amount: 0.5, unit: 'tsp', name: 'Baking soda' },
      { amount: 0.25, unit: 'tsp', name: 'Salt' },
      { amount: 0.75, unit: 'cup', name: 'Raisins' },
    ],
  },
  {
    name: 'Peanut Butter Cookies',
    ingredients: [
      { amount: 1, unit: 'cup', name: 'All-purpose flour' },
      { amount: 0.5, unit: 'cup', name: 'Peanut butter' },
      { amount: 0.25, unit: 'cup', name: 'Butter' },
      { amount: 0.5, unit: 'cup', name: 'Brown sugar' },
      { amount: 0.25, unit: 'cup', name: 'Granulated sugar' },
      { amount: 1, unit: 'large egg', name: '' },
      { amount: 0.5, unit: 'tsp', name: 'Baking soda' },
      { amount: 0.25, unit: 'tsp', name: 'Salt' },
    ],
  },
  {
    name: 'Sugar Cookies',
    ingredients: [
      { amount: 1.5, unit: 'cup', name: 'All-purpose flour' },
      { amount: 0.5, unit: 'cup', name: 'Butter' },
      { amount: 0.75, unit: 'cup', name: 'Granulated sugar' },
      { amount: 1, unit: 'large egg', name: '' },
      { amount: 1, unit: 'tsp', name: 'Vanilla extract' },
      { amount: 0.5, unit: 'tsp', name: 'Baking powder' },
      { amount: 0.25, unit: 'tsp', name: 'Salt' },
    ],
  },
]

const form = document.querySelector('#cookie-form')
const cookieSelect = document.querySelector('#cookie-type')
const quantityInput = document.querySelector('#quantity')
const statusLine = document.querySelector('#cookie-status')
const list = document.querySelector('#ingredients-list')

for (const cookie of COOKIE_TYPES) {
  const option = document.createElement('option')
  option.value = cookie.name
  option.textContent = cookie.name
  cookieSelect.append(option)
}

form.addEventListener('submit', (event) => {
  event.preventDefault()

  const cookie = COOKIE_TYPES.find((item) => item.name === cookieSelect.value)
  if (!cookie) {
    throw new Error(`Unknown cookie type: ${cookieSelect.value}`)
  }

  const quantity = Number(quantityInput.value)
  list.replaceChildren()
  for (const ingredient of cookie.ingredients) {
    const item = document.createElement('li')
    const amount = ingredient.amount * quantity / RECIPE_YIELD
    const roundedAmount = Number(amount.toFixed(2))
    const unit = ingredient.unit === 'tsp' || roundedAmount === 1
      ? ingredient.unit
      : `${ingredient.unit}s`
    item.textContent = `${roundedAmount} ${unit}${ingredient.name ? ` ${ingredient.name}` : ''}`
    list.append(item)
  }

  const cookieLabel = quantity === 1 ? 'cookie' : 'cookies'
  statusLine.dataset.kind = 'ok'
  statusLine.textContent = `Ingredients for ${quantity} ${cookie.name.toLowerCase()} ${cookieLabel} (scaled from a ${RECIPE_YIELD}-cookie recipe):`
})
