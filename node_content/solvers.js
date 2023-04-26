class ShortestPathMazeSolver {
    constructor(maze) {
        this.maze = maze;
        this.exitRow = -1;
        this.exitCol = -1;
        this.startRow = -1;
        this.startCol = -1;
        this.solution = '';

        for (let i = 0; i < maze.length; i++) {
            let breakOuter = false;
            for (let j = 0; j < maze[0].length; j++) {
                if (maze[i][j] == 2) {
                    this.exitRow = i;
                    this.exitCol = j;
                    breakOuter = true;
                    break;
                }
            }
            if (breakOuter) {
                break;
            }
        }
        for (let i = 0; i < maze.length; i++) {
            let breakOuter = false;
            for (let j = 0; j < maze[0].length; j++) {
                if (maze[i][j] == 1) {
                    this.startRow = i;
                    this.startCol = j;
                    breakOuter = true;
                    break;
                }
            }
            if (breakOuter) {
                break;
            }
        }
        if (this.exitRow == -1 || this.exitCol == -1) {
            throw new Error('No exit coordinates specified!');
        }
        // console.log(startRow, startCol, exitRow, exitCol);
    }

    getInitPosition(currentColumn, currentRow) {
        let row = -1;
        let column = -1;

        if (currentRow === -1 && currentColumn === -1) {
            row = this.startRow;
            column = this.startCol;
        } else {
            row = currentRow;
            column = currentColumn;
        }
        return {
            row: row,
            column: column
        }
    }

    distance(columnm, row) {
        return Math.round(Math.sqrt(Math.pow(columnm - this.exitCol, 2) + Math.pow(row - this.exitRow, 2))
            / Math.sqrt(this.maze.length * this.maze.length * 2) * 100);
    }

    traverse(acc, currentColumn, currentRow) {
        let row = -1;
        let column = -1;
        if (currentRow === -1 && currentColumn === -1) {
            row = this.startRow;
            column = this.startCol;
        } else {
            row = currentRow;
            column = currentColumn;
        }
        let tempo = 160;
        acc = acc + "(" + column + " " + row + " " + this.distance(column, row) + " " + tempo + ") ";
        if (this.maze[column][row] == 2) {
            if (this.solution === '') {
                this.solution = acc;
                return;
            }
            if (this.solution.length > acc) {
                this.solution = acc;  
            }
        } else if (this.maze[column][row] == 1) {
            this.maze[column][row] = 9;
            if (column < this.maze.length - 1) {
                this.traverse(acc, column + 1, row);
            }
            if (row < this.maze[column].length - 1) {
                this.traverse(acc, column, row + 1);
            }
            if (column > 0) {
                this.traverse(acc, column - 1, row);
            }
            if (row > 0) {
                this.traverse(acc, column, row - 1);
            }
        }
    }

    getShortestSolution() {
        return this.solution;
    }
}

class BlindMouseSolver extends ShortestPathMazeSolver {
    constructor(maze) {
        super(maze);
        this.track = this.createZeroFilledArray(maze);
    }

    createZeroFilledArray(arr) {
        const rows = arr.length;
        const cols = arr[0].length;
        return Array(rows).fill(0).map(() => new Array(cols).fill(0));
    }

    getRandomInt(max) {
        return Math.floor(Math.random() * max);
    }

    getNextMove(column, row) {
        let moveScores = [0, 0, 0, 0];
        let maxScore = 0;

        // Right
        if (column < this.maze.length && this.maze[column + 1][row] >= 1) {
            moveScores[0] = this.getMoveScore(column + 1, row);
            maxScore = Math.max(maxScore, moveScores[0]);
        }

        // Down
        if (row < this.maze[0].length && this.maze[column][row + 1] >= 1) {
            moveScores[1] = this.getMoveScore(column, row + 1);
            maxScore = Math.max(maxScore, moveScores[1]);
        }

        // Left
        if (column > 0 && this.maze[column - 1][row] >= 1) {
            moveScores[2] = this.getMoveScore(column - 1, row);
            maxScore = Math.max(maxScore, moveScores[2]);
        }

        // Up
        if (row > 0 && this.maze[column][row - 1] >= 1) {
            moveScores[3] = this.getMoveScore(column, row - 1);
            maxScore = Math.max(maxScore, moveScores[3]);
        }

        let maxIndices = [];
        for (let i = 0; i < moveScores.length; i++) {
            if (moveScores[i] === maxScore) {
                maxIndices.push(i);
            }
        }

        let nextMoveIndex = maxIndices[this.getRandomInt(maxIndices.length)];
        let nextColumn = column, nextRow = row;
        switch (nextMoveIndex) {
            case 0:
                nextColumn++;
                break;
            case 1:
                nextRow++;
                break;
            case 2:
                nextColumn--;
                break;
            case 3:
                nextRow--;
                break;
        }

        return {nextColumn, nextRow};
    }

    getMoveScore(column, row) {
        if (this.track[column][row] === 0) {
            return 110;
        } else if (this.track[column][row] === 4) {
            return 100;
        } else {
            return 0;
        }
    }

    traverse(acc, currentColumn, currentRow) {

        let initPosition = super.getInitPosition(currentColumn, currentRow)
        let column =  initPosition.column;
        let row =  initPosition.row;
        let x = 0;
        let initialTempo = 160;
        let tempo = initialTempo;
        let tempoInc = 20;

        while (this.maze[column][row] !== 2 && x < 65) {
            x++;

            acc += `(${column} ${row} ${super.distance(column, row)} ${tempo}) `;

            let nextMove = this.getNextMove(column, row);
            column = nextMove.nextColumn;
            row = nextMove.nextRow;

            if (this.track[column][row] === 4) {
                tempo += tempoInc;
                if (tempo > 240) {
                    tempo = 40
                }
            }
        }
        return acc
    }
}

class Node {
  constructor(row, col, parent, g, h) {
    this.row = row;
    this.col = col;
    this.parent = parent;
    this.g = g;
    this.h = h;
  }

  get f() {
    return this.g + this.h;
  }

  isEqual(other) {
    return this.row === other.row && this.col === other.col;
  }

  toString(){
    return `(${this.row}; ${this.col})`;
  }
}

function lowestF(list) {
  let min = list[0];
  for (const item of list) {
    if (item.f < min.f) {
      min = item;
    }
  }
  return min;
}

function aStar(maze) {
  const ROWS = maze.length;
  const COLS = maze[0].length;
  // constructor parametres are not correct. We need to fix them
  const start = new Node(findStart(maze), null, null, 0, 0);
  const end = new Node(findEnd(maze), null, null, 0, 0);
  const openList = [start];
  const closedList = [];

  console.log("was here " + openList)
  while (openList.length) {
    const current = lowestF(openList);
    openList.splice(openList.indexOf(current), 1);
    closedList.push(current);

    console.log("loop cycle " + current)
    if (current.isEqual(end)) {
        console.log("REALLY?")
      return getPath(current);
    }

    const neighbors = getNeighbors(current, maze);
    for (const neighbor of neighbors) {
      if (closedList.some(node => node.isEqual(neighbor))) {
        continue;
      }
      const g = current.g + 1;
      const h = manhattanDistance(neighbor, end);
      const indexInOpenList = openList.findIndex(node => node.isEqual(neighbor));
      if (indexInOpenList === -1) {
        openList.push(new Node(neighbor.row, neighbor.col, current, g, h));
      } else if (g + h < openList[indexInOpenList].f) {
        openList[indexInOpenList].g = g;
        openList[indexInOpenList].h = h;
        openList[indexInOpenList].parent = current;
      }
    }
  }

  return null;
}

function findStart(maze) {
  return find(maze, 1);
}

function findEnd(maze) {
  return find(maze, 2);
}

function find(maze, value) {
  for (let row = 0; row < maze.length; row++) {
    for (let col = 0; col < maze[0].length; col++) {
      if (maze[row][col] === value) {
        return { row, col };
      }
    }
  }
  return null;
}

function getNeighbors(node, maze) {
  const { row, col } = node;
  const neighbors = [];
  if (isValidNeighbor(row - 1, col, maze)) {
    neighbors.push({ row: row - 1, col });
  }
  if (isValidNeighbor(row, col + 1, maze)) {
    neighbors.push({ row, col: col + 1 });
  }
  if (isValidNeighbor(row + 1, col, maze)) {
    neighbors.push({ row: row + 1, col });
  }
  if (isValidNeighbor(row, col - 1, maze)) {
    neighbors.push({ row, col: col - 1 });
  }
  return neighbors;
}

function isValidNeighbor(row, col, maze) {
  return row >= 0 && row < maze.length && col >= 0 && col < maze[0].length && maze[row][col] !== 0;
}

function manhattanDistance(node1, node2) {
  return Math.abs(node1.row - node2.row) + Math.abs(node1.col - node2.col);
}

function getPath(node) {
  const path = [];
  let current = node;
  while (current) {
    path.unshift([current.row, current.col]);
    current = current.parent;
  }
  console.log(path)
  return path;
}

class AStarSolver {
    constructor(maze) {
        this.maze = maze
    }

    traverse(acc, currentColumn, currentRow) {
        return aStar(this.maze)
    }
}

module.exports = {
    ShortestPathMazeSolver,
    BlindMouseSolver,
    AStarSolver
}