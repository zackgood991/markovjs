const markov = require('./markov.js');

const table  =
    generate_markov_table(
        "juicy fruit - it keeps on going. the endless " +
        "flavour, it'll keep you going. that's juicy j" +
        "uicy juicy fruit! the flavour that judt keeps" +
        " on going! juicy juicy juicy juicy fruit!"
    );


generate_markov_text(Infinity, table, active_log=true);
