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
            console.log("Maze solved");
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
        const zeroArray = new Array(rows).fill(0).map(() => new Array(cols).fill(0));
        return zeroArray;
    }

    function

    getRandomInt(max) {
        return Math.floor(Math.random() * max);
    }

   // this.traverse = function(acc, startColumn, startRow) {
   //   let column = startColumn
   //   let row = startRow
   //   let x = 0
   //   let initialTempo = 160
   //   let tempo = initialTempo
   //   let tempoInc = 20
   //
   //   while (this.maze[column][row] !== 2 && x < 65) {
   //      x = x + 1;
   //
   //     acc = acc + "(" + column + " " + row + " " + this.distance(column, row) + " " + tempo + ") "
   //
   //     // Right
   //     // Up
   //     // Left
   //     // Down
   //
   //     let score = [0, 0, 0, 0]
   //
   //     // 10
   //     if (column < this.maze.length && maze[column + 1][row] >= 1) {
   //       score[0] = 100
   //       if (this.track[column + 1][row] === 0) {
   //         score[0] = 110
   //       }
   //     }
   //
   //     if ((row < this.maze[0].length) && maze[column][row + 1] >= 1) {
   //       score[1] = 100
   //        if (this.track[column][row + 1] === 0) {
   //         score[1] = 110
   //       }
   //     }
   //
   //     if (column > 0 && maze[column - 1][row] >= 1) {
   //       score[2] = 100
   //       if (this.track[column - 1][row] === 0) {
   //         score[2] = 110
   //       }
   //     }
   //
   //     if (row > 0 && maze[column][row - 1] >= 1) {
   //       score[3] = 100
   //       if (this.track[column][row - 1] === 0) {
   //         score[3] = 110
   //       }
   //     }
   //
   //     let optimum = -1
   //     let optimumIndex = -2
   //     for (let i = 0; i < score.length; i++) {
   //       if (score[i] > optimum) {
   //         optimumIndex = i
   //         optimum = score[i]
   //       }
   //       if (score[i] === optimum && getRandomInt(2) === 1) {
   //         optimumIndex = i
   //       }
   //     }
   //     optimum = optimumIndex
   //
   //     if (optimum === 0) {
   //       column = column + 1
   //       if (this.track[column][row] === 4) {
   //         tempo = tempo + tempoInc
   //       } else {
   //         this.track[column][row] = 4
   //         tempo = initialTempo
   //           if (tempo > 240) {
   //             tempo = 40
   //             initialTempo = 40
   //             tempoInc = 0
   //         }
   //       }
   //       continue
   //     }
   //     if (optimum === 1) {
   //       row = row + 1
   //        if (this.track[column][row] === 4) {
   //         tempo = tempo + tempoInc
   //                       if (tempo > 240) {
   //             tempo = 40
   //             initialTempo = 40
   //             tempoInc = 0
   //         }
   //       } else {
   //         this.track[column][row] = 4
   //         tempo = initialTempo
   //       }
   //       continue
   //     }
   //     if (optimum === 2) {
   //        column = column - 1
   //          if (this.track[column][row] === 4) {
   //         tempo = tempo + tempoInc
   //         if (tempo > 240) {
   //             tempo = 40
   //             initialTempo = 40
   //             tempoInc = 0
   //         }
   //       } else {
   //         this.track[column][row] = 4
   //         tempo = initialTempo
   //       }
   //       continue
   //     }
   //     if (optimum === 3) {
   //        row = row - 1
   //          if (this.track[column][row] === 4) {
   //         tempo = tempo + tempoInc
   //         if (tempo > 240) {
   //             tempo = 40
   //             initialTempo = 40
   //             tempoInc = 0
   //
   //         }
   //
   //       } else {
   //         this.track[column][row] = 4
   //         tempo = initialTempo
   //       }
   //       continue
   //     }
   //   }
   //   return acc
   // }
}

module.exports = {
    ShortestPathMazeSolver,
    BlindMouseSolver
}