# five_basic_tests
Five basic tests (statistical) from "Handbook of Applied Cryptography"
https://cacr.uwaterloo.ca/hac/about/chap5.pdf

prerequisites:
* have node.js installed

To get started:
1) "git clone https://github.com/allarlauk/five_basic_tests.git"
2) go to five_basics_tests folder
3) "npm run test"
4) modify s variable in src/index.js to test other bitsequences


The goal of this project is to test any random given binary bitsequence with Five basic tests from "Handbook of Applied Cryptography". If all five tests pass, then bitsequence is considered "accepted" as being random, if it doesn't pass all tests, then it is considered to be "rejected" as being random.

There are five tests that are being run:
1) Frequency test (mono-bit test), which goal is to test if the number of 0's and 1's is approximately the same.
2) Serial test (two-bit test), which goal is to test number of unique 2-bit sequences to be approximately the same.
3) Poker test, which goal is to test, whether the number of unique bitsequences length m such that Math.floor(n/m) >= 5 * (2**m), where n is length of bitsequence s and m is the length of sequence m within s.
4) Runs test, which goal is to determine that number of runs of 0's and 1's of various lengths in sequence is as expected for random sequence.
5) Autocorrelation test, which goal is to check the differences between bit values and shifted versions of them.

