# 11

For problems like this with non-changing input files and limited scope it never makes sense to test parsing using TDD since it will never change and we just need to get parsing to where it works once and never change it after (unless part 2 is drastically different and even then its just one more effort and is likely pretty ovb to fix, eliminating the need for TDD). The trick to this I think will be understanding when in the real world situations like this will exist. Input will be new every time in the real world so that will be better to test. But this should be evaluated on a case by case basis...

I also like the pattern I have been using for the oracle. A single object which contains separate object arrays for each test type. Although it does make it harder to run the individual test and then check the conditions since the test file can get long. Might be good to break up the test files soon if it ever gets to be too much.
