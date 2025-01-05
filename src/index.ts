const year = 2015
const day = 25

;(async () => {
  const solution = await import(`./${year}/day${day}`)
  solution.default()
})()
