const list = [1,2,3,4,5,6,7]

const len = list.length
const mdList = []
let subList = []

for (let i = 0; i < len; i++) {
  if (i !== 0 && (i % 2) === 0) {
    mdList.push(subList)
    subList = []
    subList.push(list[i])
    if (i === len - 1) { mdList.push(subList) }
    continue
  }

  subList.push(list[i])
  if (i === len - 1) { mdList.push(subList) }
}

function single2MultidimensionalArray(singleDimensionalList, multiDimensionalLen) {
  const len = singleDimensionalList.length
  const multidimensionalList = []
  let subset = []

  const isTheStartOfNewArray = i => i !== 0 && (i % multiDimensionalLen) === 0
  const isLastElementInList = i => i === len - 1
  const storeAndClearSubset = (i, singleDimensionalList) => {
    multidimensionalList.push(subset)
    subset = []
    subset.push(singleDimensionalList[i])
  }

  for (let i = 0; i < len; i++) {

    if (isTheStartOfNewArray(i)) {
      storeAndClearSubset(i, singleDimensionalList)
      isLastElementInList(i) && multidimensionalList.push(subset)
      continue
    }

    subset.push(singleDimensionalList[i])
    isLastElementInList(i) && multidimensionalList.push(subset)
  }
  return multidimensionalList
}

console.log("mdList", single2MultidimensionalArray(list, 5))