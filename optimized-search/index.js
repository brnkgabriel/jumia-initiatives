
function searchInIndexed(indexedObj, strToFind) {
  let firstChar = stringToFind[0]
  let n = indexedObj[firstChar].length
  for (let i = 0; i < n; i++) {
    if (indexedObj[firstChar][i] === strToFind) {
      return true
    }
  }
}

function createIndexArr(array) {
  // our indexed object
  let newObj = {}

  for (let i = 0; i < maxArraySize; i++) {
    // we'll use the first character of the string to base our index. could be in the range of [a-z, 1-9]
    let firstChar = array[i][0]
    if (newObj[firstChar]) {
      newObj[firstChar].push(array[i])
    } else {
      newObj[firstChar] = [array[i]]
    }
  }

  return newObj
}