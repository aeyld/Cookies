// Keep each cookie's instructions and ingredient amounts together.
const RECIPE_YIELD = 12

const COOKIE_TYPES = [
  {
    name: 'Chocolate Chip Cookies',
    steps: [
      'Heat the oven to 350°F (175°C) and line a baking sheet with parchment paper.',
      'Whisk the flour, baking soda, and salt together in a bowl.',
      'Beat the butter with both sugars until creamy, then mix in the egg and vanilla.',
      'Mix the dry ingredients into the butter mixture, then fold in the chocolate chips.',
      'Scoop dough onto the baking sheet, leaving space between cookies. Bake for 9–11 minutes, until the edges are golden.',
      'Cool the cookies on the baking sheet for 5 minutes, then move them to a rack.',
    ],
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
    steps: [
      'Heat the oven to 350°F (175°C) and line a baking sheet with parchment paper.',
      'Whisk the flour, cinnamon, baking soda, and salt together in a bowl.',
      'Beat the butter and brown sugar until creamy, then mix in the egg and vanilla.',
      'Stir in the flour mixture, then fold in the oats and raisins.',
      'Scoop dough onto the baking sheet, leaving space between cookies. Bake for 10–12 minutes, until the edges are set.',
      'Cool the cookies on the baking sheet for 5 minutes, then move them to a rack.',
    ],
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
    steps: [
      'Heat the oven to 350°F (175°C) and line a baking sheet with parchment paper.',
      'Whisk the flour, baking soda, and salt together in a bowl.',
      'Beat the peanut butter, butter, and sugars until creamy, then mix in the egg.',
      'Stir the flour mixture into the peanut butter mixture until just combined.',
      'Roll dough into balls, place them on the baking sheet, and flatten each with a fork. Bake for 9–11 minutes.',
      'Cool the cookies on the baking sheet for 5 minutes, then move them to a rack.',
    ],
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
    steps: [
      'Heat the oven to 350°F (175°C) and line a baking sheet with parchment paper.',
      'Whisk the flour, baking powder, and salt together in a bowl.',
      'Beat the butter and sugar until creamy, then mix in the egg and vanilla.',
      'Mix the dry ingredients into the butter mixture until a soft dough forms.',
      'Scoop dough onto the baking sheet, leaving space between cookies. Bake for 8–10 minutes, until the edges are just golden.',
      'Cool the cookies on the baking sheet for 5 minutes, then move them to a rack.',
    ],
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
// Keep references to the elements updated by the step-by-step guide.
const procedureCookieName = document.querySelector('#procedure-cookie-name')
const procedureProgress = document.querySelector('#procedure-progress')
const procedureStep = document.querySelector('#procedure-step')
const nextProcedureStep = document.querySelector('#next-procedure-step')
let activeSteps = []
let activeStepIndex = 0

// Create one dropdown option for each available cookie recipe.
for (const cookie of COOKIE_TYPES) {
  const option = document.createElement('option')
  option.value = cookie.name
  option.textContent = cookie.name
  cookieSelect.append(option)
}

// Return the selected recipe or report an invalid dropdown value.
function getSelectedCookie() {
  const cookie = COOKIE_TYPES.find((item) => item.name === cookieSelect.value)
  if (!cookie) {
    throw new Error(`Unknown cookie type: ${cookieSelect.value}`)
  }
  return cookie
}

// Show the current instruction and stop navigation at the final step.
function renderProcedure() {
  const isLastStep = activeStepIndex === activeSteps.length - 1
  procedureProgress.textContent = `Step ${activeStepIndex + 1} of ${activeSteps.length}${isLastStep ? ' — All steps complete.' : ''}`
  procedureStep.textContent = activeSteps[activeStepIndex]
  nextProcedureStep.disabled = isLastStep
  nextProcedureStep.textContent = isLastStep ? 'All steps complete' : 'Next step'
}

// Load the selected recipe's instructions and return the guide to step one.
function resetProcedure() {
  const cookie = getSelectedCookie()
  activeSteps = cookie.steps
  activeStepIndex = 0
  procedureCookieName.textContent = cookie.name
  renderProcedure()
}

// Start over when a different cookie is selected; advance one step per click.
cookieSelect.addEventListener('change', resetProcedure)
nextProcedureStep.addEventListener('click', () => {
  if (activeStepIndex < activeSteps.length - 1) {
    activeStepIndex += 1
    renderProcedure()
  }
})
resetProcedure()

// Scale and display ingredients when the visitor submits the batch size.
form.addEventListener('submit', (event) => {
  event.preventDefault()

  const cookie = getSelectedCookie()

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
