var utils = require('../utils/utils')

function runFiveBasicTests(bitSequence) {
    let normalDistArr, chiSquareDistArr
  
    let alpha = 0.05
    alphaString = alpha.toString
  
    normalDistArr = utils.readDistributionValues("normal_dist")
    chiSquareDistArr = utils.readDistributionValues("chisquare_dist")
  
    bitSequence = bitSequence.replace(/\s/g, '')
  
    /**
     * min n length requirement in practice is n >> 100000
     * but for easier test purposes min length 100 is chosen
     *  */ 
    const n = bitSequence.length
    const minSeqLength = 100
    const d = 8
    
  
    if (bitSequence.length < minSeqLength) {
      console.log("Selected sequence is too short!")
      console.log("Bitstream length = " + bitSequence.length +", min length = " + minLength)
      return
    }
  
    if (!(d >= 1 && d <= (n/2))) {
      console.log("d = " + d + ", is out of range!")
      console.log("d range: 1 <= d <= " + n/2)
      return
    }
    console.log("Bitsequence: " + bitSequence + "\n")

    console.log("Bitsequence length = " + bitSequence.length)
    const X1 = frequencyTest(bitSequence, alpha, chiSquareDistArr)
    const X2 = serialTest(bitSequence, alpha, chiSquareDistArr)
    const X3 = pokerTest(bitSequence, alpha, chiSquareDistArr)
    const X4 = runsTest(bitSequence, alpha, chiSquareDistArr)
    const X5 = autoCorrelationTest(bitSequence, d, alpha, normalDistArr)
  
    console.log()
    if (X1 && X2 && X3 && X4 && X5) {
      console.log("Bitsequence has passed all tests, therefore it is considered \"ACCEPTED\" as being random")
    } else {
      console.log("Bitsequence has not passed one or more tests, therefore it is considered \"REJECTED\" as being random")
    }
  }

function frequencyTest (bitSequence, alpha, arr) {
    let n, n0, n1, X1, alphaIndex, degreesOfFreedom
    alpha = alpha.toString()
    alphaIndex = arr[0].indexOf(alpha)

    bitSequence = bitSequence.replace(/\s/g, '')
    degreesOfFreedom = 1
     // Extract length "n" of bitSequence and occurrences of "0", "1"
    n = bitSequence.length
    n0 = bitSequence.match(/0/g).length
    n1 = bitSequence.match(/1/g).length

    
    criticalValue = arr[degreesOfFreedom][alphaIndex]
    X1 = (n0 - n1) ** 2 / n
    return utils.isTestPassed(degreesOfFreedom, X1, criticalValue, "x1")
    
}

function serialTest (bitSequence, alpha, arr) {
    let n, n0, n1, n00, n01, n10, n11, X2, alphaIndex, degreesOfFreedom
    alpha = alpha.toString()
    alphaIndex = arr[0].indexOf(alpha)

    bitSequence = bitSequence.replace(/\s/g, '')
    degreesOfFreedom = 2

    // Extract length "n" of bitSequence and  occurrences of "0", "1", "00", "01", "10", "11"
    n = bitSequence.length
    n0 = bitSequence.match(/0/g).length
    n1 = bitSequence.match(/1/g).length
    n00 = bitSequence.match(/(?<=00)/g).length
    n01 = bitSequence.match(/(?<=01)/g).length
    n10 = bitSequence.match(/(?<=10)/g).length
    n11 = bitSequence.match(/(?<=11)/g).length


    criticalValue = arr[degreesOfFreedom][alphaIndex]
    X2 = (4 * (n00**2 + n01**2 + n10**2 + n11**2) / (n-1)) - (2 *  (n0**2 + n1**2) / n) + 1
    return utils.isTestPassed(degreesOfFreedom, X2, criticalValue, "x2")
    
}

function pokerTest (bitSequence, alpha, arr) {
    let n, m, k, blocks, blocksCount, regexString, X3, bitSequenceTrim, degreesOfFreedom
    alpha = alpha.toString()
    alphaIndex = arr[0].indexOf(alpha)

    bitSequenceTrim = bitSequence.replace(/\s/g, '')

    blocks = []
    regexString = ''

    n = bitSequenceTrim.length
    m = 1

    m = utils.calculateMaxBlockLength(bitSequence)
    
    // Calculate k value
    k = Math.floor(n/m)

    // Extract all unique sequences with length m and add padding to them
    for (i = 0; i < (2**m); i++) {
      blocks.push(i)
      blocks[i] = blocks[i].toString(2).padStart(m, '0')
    }

    blocksCount = utils.extractRegex(bitSequenceTrim, blocks)

    const niSquaredSum = utils.calculateNiSquaredSum(blocksCount)
    degreesOfFreedom = (2**m) - 1
    criticalValue = arr[degreesOfFreedom][alphaIndex]
    X3 = ((2**m)*(niSquaredSum)/k) - k
    return utils.isTestPassed(degreesOfFreedom, X3, criticalValue, "x3")

}
  
function runsTest(bitSequence, alpha, arr) {
    
    let bitSequenceTrim = bitSequence.replace(/\s/g, '')
    let n, i, k, ei, blocks, gaps, blocksCount, gapsCount, X4, criticalValue
    alpha = alpha.toString()
    alphaIndex = arr[0].indexOf(alpha)
    
    n = bitSequenceTrim.length
    maxBlockLength = utils.calculateMaxBlockLength(bitSequence)
    blocks = []
    gaps = []
    ei = []

    for (i = 1; i <= maxBlockLength; i++) {
        blocks.push("1".repeat((maxBlockLength +1) - i))
        gaps.push("0".repeat((maxBlockLength +1) - i))
        ei.push((n-i+3)/(2**(i+2)))
    }

    k = utils.calculateK(ei)
    degreesOfFreedom = (2 * k) - 2

    criticalValue = arr[degreesOfFreedom][alphaIndex]

    blocksCount = utils.extractRegex(bitSequenceTrim, blocks, maxBlockLength).reverse()
    gapsCount = utils.extractRegex(bitSequenceTrim, gaps, maxBlockLength).reverse()

    const blocksSum = utils.calculateBlocksOrGapsSum(blocksCount, ei)
    const gapsSum = utils.calculateBlocksOrGapsSum(gapsCount, ei)

    X4 = blocksSum + gapsSum
    return utils.isTestPassed(degreesOfFreedom, X4, criticalValue, "x4")
}

function autoCorrelationTest (bitSequence, d, alpha, arr) {
    let n, bitsNotEqualToDshift, X5 
    alpha = alpha.toString()
    alphaIndex = arr[0].indexOf(alpha)

    bitSequence = bitSequence.replace(/\s/g, '')
    n = bitSequence.length
    bitsNotEqualToDshift = 0
    const shift = (n-d-1)

    
    for (i = 0; i <= shift; i++) 
        bitsNotEqualToDshift += utils.XOR(bitSequence[i], bitSequence[i+d])
    
    degreesOfFreedom = (n - d)

    if (degreesOfFreedom >= 10 )  {
        criticalValue = arr[1][alphaIndex]
    } else {
        criticalValue = arr[degreesOfFreedom][alphaIndex]
    }

    X5 = 2 * (bitsNotEqualToDshift - ((n-d)/2)) / Math.sqrt(n-d)
    return utils.isTestPassed(degreesOfFreedom, X5, criticalValue, "x5")
}

module.exports = {
    frequencyTest,
    serialTest, 
    pokerTest,
    runsTest,
    autoCorrelationTest,
    runFiveBasicTests
}