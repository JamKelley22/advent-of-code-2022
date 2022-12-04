# 4

Very difficult one for me today. I made the calculation too difficult at first to determine if one assignment area was fully overlapping the other. I attempted to shift the numbers down by the lowest start point. Ex follows

Actual: 33-44,33-85 (does fully overlap)
Shifted: 1-11,1-52

However, this confused me as it was difficult to debug and find the cases where this broke down. Still not sure why it didn't work. I suppose I could compare the output of cases between old function and new but that seems like a lot to do atm. Anyway, my partner helped lead me to a more intuitive way to understand the problem while using her as a rubber duck. After creating a [diagram](<docs/advent-of-code(4).drawio(1).png>) depicting the 11 cases to address for the two assignments it was a breeze to finish up.

I am still not too sure about TDD. I followed it fully today by writing the tests first then fixing them but my tests seemed to suck since they all passed but I still got the wrong answer. I would've needed to brainstorm more test conditions (although that might have led me to understand the solution faster too). Not sure. I'll keep doing it for now.
