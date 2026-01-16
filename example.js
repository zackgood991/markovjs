const markov = require("./markov.js");

console.log(process.argv);
let table  =
    markov.generate_markov_table(
        "juicy fruit - it keeps on going. the endless " +
        "flavour, it'll keep you going. that's juicy j" +
        "uicy juicy fruit! the flavour that judt keeps" +
        " on going! juicy juicy juicy juicy fruit!"
    );

if(process.argv.length > 4) {
    const fs = require("fs");

    fs.readFile(process.argv[2], "utf8", function(err, data) {
        if(err) throw err;
        table = markov.generate_markov_table(data, parseInt(process.argv[4]), true);
        console.log(table);

        console.log(markov.generate_markov_text(parseInt(process.argv[3]), table, parseInt(process.argv[4])));
    });
} else
    console.log(markov.generate_markov_text(200, table));
