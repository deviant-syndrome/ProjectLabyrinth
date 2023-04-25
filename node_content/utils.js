function horizCell(cell) {
    let representation = '1 ';

    representation += cell.right ? '0 ' : '1 ';
    return representation;
}

function vertCell(cell, value) {
    let representation = '';

    representation += cell.down ? '0 ' : '1 ';
    representation += cell.right ? '0 ' : '1 ';
    return representation;
}

function stringTo2dArray(string, d1, d2) {
	return string.split(d1).map(function(x){return x.split(d2)});
}

function swapRowsAndColumns(array) {
  const rows = array.length;
  const cols = array[0].length;

  // Initialize a new array with the correct dimensions
  const swapped = new Array(cols).fill(null).map(() => new Array(rows).fill(null));

  // Iterate over the original array and swap the rows and columns
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      swapped[j][i] = array[i][j];
    }
  }

  return swapped;
}

function fromBach(lllString) {
  let preparedString = lllString
      .replaceAll('[ ', '')
      .replaceAll("] ", "]")
      .replaceAll(" ]", "]")
      .slice(0, -1)
      .trim()

  let result = stringTo2dArray(preparedString, "]", " ")
  return result
}

function toBach(maze) {
    // todo: properly strip space at the begining of the row
    let rows = maze.toJSON().rows
    let stringRepresentation = ''

    // todo: unhardcode row length here
    for (let row = 0; row < 9; row++) {
        let rowString = '( '
        for (let column = 0; column < rows[row].length - 1; column++) {
            rowString += horizCell(rows[row][column])
        }
        rowString += ') \n( '

        for (let column = 0; column < rows[row].length - 1; column++) {
            rowString += vertCell(rows[row][column]);
        }
        rowString += ' )'
        stringRepresentation += row + 1 < rows[row].length ? rowString + '\n' : rowString
    }
    return stringRepresentation
}

module.exports = {
    horizCell,
    vertCell,
    toBach,
    fromBach
}
