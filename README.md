JS Markov chain text generator
===============================
This is a very simple Markov chain text generator, ported from
Hay Kranen's PHP Markov chain text implementation.

Running
---------
Using Node:
```
node example.js [filename] [word count] [how many letters per state, 0 for per word]
```

i.e. `node example.js text/kant.txt 10000 0` For a ~10000 word string derived off the file at `text/kant.txt`, tokenising per word.

More info
---------
* The PHP original by Hay Kranen: http://www.haykranen.nl/projects/markov
* Fork the original on Github: http://github.com/hay/markov
