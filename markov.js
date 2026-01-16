/*
    PHP Markov Chain text generator 1.0
    Copyright (c) 2008-2010, Hay Kranen <http://www.haykranen.nl/projects/markov/>
    Fork on Github: < http://github.com/hay/markov >

    License (MIT / X11 license)

    Permission is hereby granted, free of charge, to any person
    obtaining a copy of this software and associated documentation
    files (the "Software"), to deal in the Software without
    restriction, including without limitation the rights to use,
    copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the
    Software is furnished to do so, subject to the following
    conditions:

    The above copyright notice and this permission notice shall be
    included in all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
    EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
    OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
    NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
    HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
    WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
    FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
    OTHER DEALINGS IN THE SOFTWARE.
*/

const markov_delim = " "; // word delimiter

function generate_markov_table(text, look_forward = 4, active_log = false) {
    let table = {};
    let oldPer = 0;
    let curMax; // current max of for loop

    // if look forward is 0, tokenize by word
    let textSplit = [];
    if (look_forward == 0)
        textSplit = text.split(markov_delim);

    // now walk through the text and make the index table
    curMax = look_forward == 0 ? textSplit.length : text.length;
    for (let i = 0; i < curMax; i++) {
        const char = look_forward == 0 ? textSplit[i] : text.substring(i, i + look_forward);
        table[char] = {}; // if it overwrites anything, it doesn't matter

        if(!active_log) continue;
        const curPer = Math.floor(50 * i / (curMax == 0 ? 1 : curMax));
        if(oldPer != curPer) console.log(`Table: ${curPer}%`);
        oldPer = curPer;
    }

    // walk the array again and count the numbers
    curMax = look_forward == 0 ? (textSplit.length - 1) : (text.length - look_forward);
    for (let i = 0; i < curMax; i++) {
        const char_index = look_forward == 0 ? textSplit[i    ] : text.substring(i, i + look_forward);
        const char_count = look_forward == 0 ? textSplit[i + 1] :text.substring(i + look_forward, i + look_forward*2);

        if (Object.keys(table[char_index]).includes(char_count)) {
            table[char_index][char_count]++;
        } else {
            table[char_index][char_count] = 1;
        }

        if (!active_log) continue;
        const curPer = 50 + Math.floor(50 * (i / (curMax == 0 ? 1 : curMax)));
        if (oldPer != curPer) console.log(`Table: ${curPer}%`);
        oldPer = curPer;
    }

    return table;
}

function generate_markov_text(length, table, look_forward = 4, active_log = false) {
    // get first character
    const tabKeys = Object.keys(table);
    let char = tabKeys[Math.floor(Math.random() * tabKeys.length)];
    let o = char;

    let i = 0;
    while (look_forward == 0 ? o.length < length : i < (length / look_forward)) {
        const newchar = return_weighted_char(table[char]);

        if (newchar != null) {
            if (active_log && typeof process !== "undefined") process.stdout.write(newchar);
            o   += newchar;

            if (look_forward == 0)
            if (!char.endsWith("\n")) // avoid unneeded extra condition check
                o += markov_delim;

            char = newchar;
        } else {
            char = tabKeys[Math.floor(Math.random() * tabKeys.length)];
        }

        if (look_forward != 0) i++;
    }

    return o;
}


function return_weighted_char(array) {
    if (!array) return null;

    const arrVals = Object.values(array);
    const arrKeys = Object.keys  (array);

    const total = arrVals.reduce((a,b) => a+b, 0);
    let rand = 1 + Math.round(Math.random()*(total-1));
    for (let i = 0; i < arrKeys.length; i++) {  // (array as item => weight) {
        if (rand <= arrVals[i]) return arrKeys[i];
        rand -= arrVals[i];
    }

    return null; // safety
}

if(typeof module !== "undefined") module.exports = {
    return_weighted_char: return_weighted_char,
    generate_markov_text: generate_markov_text,
    generate_markov_table: generate_markov_table
};
