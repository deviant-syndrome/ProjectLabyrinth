const mazeGeneration = require('maze-generation');
const maxAPI = require("max-api")
const solvers = require("./solvers")
const utils = require("./utils")

const generateMaze = () => {
  let w = 10
  let h = 10
  const options = {
    width: w,
    height: h,
    algorithm: 'HUNTANDKILL'
  }

  const generatedMaze = mazeGeneration(options);

  let lll = utils.toBach(generatedMaze).replaceAll('[', '(').replaceAll("]", ")")
  maxAPI.outlet(lll)
}

maxAPI.addHandler("solve", (alg, data) => {
  if (alg === "Shortest path") {
    let solver = new solvers.ShortestPathMazeSolver(utils.fromBach(data))
    solver.traverse("", -1, -1)

    maxAPI.outlet(solver.getShortestSolution())
  } else {
    if (alg === "Blind mouse") {
      let solver = new solvers.BlindMouseSolver(utils.fromBach(data))
      let res = solver.traverse("", -1, -1)

      maxAPI.outlet(res)
    } else {
      if (alg === "A-star") {
        let solver = new solvers.AStarSolver(utils.fromBach(data))
        let res = solver.traverse("", -1, -1)
        maxAPI.outlet(res)
      }
    }
  } 
})

maxAPI.addHandler("generate", (data) => {
  generateMaze()
})
