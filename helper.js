const helper = {};


helper.permutations = (length) => {
  const perms = [];
  for (let i = 0; i < length; i++) {
    for (let j = i + 1; j < length; j++) {
      perms.push([i, j]);
    }
  }
  return perms;
}

helper.transpose = (matrix) => {
  const numRows = matrix.length;
  const numCols = matrix[0].length;
  const transposedMatrix = Array.from({ length: numCols }, () => Array(numRows));
  for (let i = 0; i < numRows; i++) {
    for (let j = 0; j < numCols; j++) {
      transposedMatrix[j][i] = matrix[i][j];
    }
  }
  return transposedMatrix;
}


helper.extractNodes = (parent, elem) => {
  return Array.from(parent.querySelectorAll(elem));
} 