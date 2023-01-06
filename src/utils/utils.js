const fs = require('fs')

function calculateMaxBlockLength (bitSequence) {
  let n, m, bitSequenceTrim
  bitSequenceTrim = bitSequence.replace(/\s/g, '')

  n = bitSequenceTrim.length
  m = 1

  // Calculate max block length value
  while (Math.floor(n/m) >= (5 * (2**m))) m++
  m--
  return m
}

// This function adds power of 2 for all unique sequence counts and sums them up
function calculateNiSquaredSum (arr) {
  const initValue = 0
  return arr.map(el => Math.pow(el,2)).reduce((acc, curr) => acc + curr, initValue)

}

function extractRegex (bitSequenceTrim, arr, x = undefined) {
  // Create regex, which adds parentheses to each element and separates them with pipes and wraps the entire string with parentheses
  let regexString = ''

  if (x != undefined) {
    bitSequenceTrim = bitSequenceTrim.replace(new RegExp(`1{${x+1},}|0{${x+1},}`, 'g'), ' ')
  }

  arr.forEach(el => regexString += '(' + el + ')' + '|')
  regexString = new RegExp('(' + regexString.slice(0,-1) + ')', 'g')
  let arrCount = new Array(arr.length).fill(0)

  // Use previously made regex pattern to extract and count number of occurrences for each unique block length m
  for (i = 0; i < arr.length; i++) {
    let regString = bitSequenceTrim.replace(regexString, `$${i+2} `)
    let count = (regString.match(new RegExp (arr[i], 'g')) || []).length
    arrCount[i] = count
  }

  return arrCount
}

function calculateK (arr) {
  const maxK = 5
  let k = 1
  for (i = 1; i <= arr.length; i++) if (arr[i] >= maxK) k++
  return k 
}

function calculateBlocksOrGapsSum (countArr, eiArr) {
  let arrSum = 0
  for (i = 0; i < eiArr.length; i++) arrSum += ((countArr[i] - eiArr[i])**2)/(eiArr[i])
  return arrSum
}

function XOR (a,b) {
  return  (a != b) ? 1 : 0
}

function isTestPassed (degreesOfFreedom , statisticResult, criticalValue, x) {
  /**
   * X1 approximately follows a χ2 distribution with 1 degree of freedom if n ≥ 10
   * X2 approximately follows a χ2 distribution with 2 degrees of freedom if n ≥ 21
   * X3 approximately follows a χ2 distribution with 2**m − 1 degrees of freedom
   * X4 approximately follows a χ2 distribution with 2k − 2 degrees of freedom
   * X5 approximately follows an N(0, 1) distribution if n − d ≥ 10
   */
  statisticResult = statisticResult.toFixed(4)
  statisticResult = parseFloat(statisticResult)
  switch (x) {
  case "x1":
    if (statisticResult < criticalValue) {
      console.log("Frequency test (mono-bit): \tPASSED X1 = " + statisticResult + " is below threshold " + criticalValue)
      return true
    } else {
      console.log("Frequency test (mono-bit): \tFAILED X1 = " + statisticResult + " is above threshold " + criticalValue)
      return false
    }

  case "x2":
    if (statisticResult < criticalValue) {
      console.log("Serial test (two-bit bit): \tPASSED X2 = " + statisticResult + " is below threshold " + criticalValue)
      return true

    } else {
      console.log("Serial test (two-bit bit): \tFAILED X2 = " + statisticResult + " is above threshold " + criticalValue)
      return false

    }

  case "x3":
    if (statisticResult < criticalValue) {
      console.log("Poker test: \t\t\tPASSED X3 = " + statisticResult + " is below threshold " + criticalValue)
      return true
    } else {
      console.log("Poker test: \t\t\tFAILED X3 = " + statisticResult + " is above threshold " + criticalValue)
      return false
    }

  case "x4":
    if (statisticResult < criticalValue) {
      console.log("Runs test: \t\t\tPASSED X4 = " + statisticResult + " is below threshold " + criticalValue)
      return true
    } else {
      console.log("Runs test: \t\t\tFAILED X4 = " + statisticResult + " is above threshold " + criticalValue)
      return false
    }

  case "x5":
  if (degreesOfFreedom && (statisticResult < criticalValue)) {
    console.log("Autocorrelation test: \t\tPASSED X5 = " + statisticResult + " is below threshold " + criticalValue)
    return true
  } else {
    console.log("Autocorrelation test: \t\tFAILED X5 = " + statisticResult + " is above threshold " + criticalValue)
    return false
  }

  default:
    console.log("Selected test: " + x + " doesn't exist!")
    console.log("Available tests: \"x1\", \"x2\", \"x3\", \"x4\", \"x5\"")
    break;
  }

}

function readDistributionValues (filePath) {
  const currPath = __dirname + '/'
  const text = fs.readFileSync(currPath + filePath).toString('utf-8').replace(/\n\r/g, "")
  let textArr = text.split('\n')
  let distributionsArr = []
  for (i = 0; i < textArr.length; i++) {
    distributionsArr.push(textArr[i].split(';'))
    distributionsArr[i].shift()
    
  }

  return distributionsArr
}

module.exports = {
  calculateMaxBlockLength,
  calculateNiSquaredSum,
  extractRegex,
  calculateK,
  calculateBlocksOrGapsSum,
  XOR,
  isTestPassed,
  readDistributionValues
}