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

function generate_markov_table(text, look_forward = 4) {
    let table = {};

    // now walk through the text and make the index table
    for (let i = 0; i < text.length; i++) {
        const char = text.substring(i, i + look_forward);
        if (!Object.keys(table).includes(char)) table[char] = {};
    }

    // walk the array again and count the numbers
    for (let i = 0; i < (text.length - look_forward); i++) {
        const char_index = text.substring(i, i + look_forward);
        const char_count = text.substring(i + look_forward, i + look_forward*2);

        if (Object.keys(table[char_index]).includes(char_count)) {
            table[char_index][char_count]++;
        } else {
            table[char_index][char_count] = 1;
        }
    }

    return table;
}

function generate_markov_text(length, table, look_forward = 4, active_log = false) {
    // get first character
    const tabKeys = Object.keys(table);
    let char = tabKeys[Math.floor(Math.random()*tabKeys.length)];
    let o = char;

    for (let i = 0; i < (length / look_forward); i++) {
        const newchar = return_weighted_char(table[char]);

        if (newchar != null) {
            if (active_log && typeof process !== "undefined") process.stdout.write(newchar);
            char = newchar;
            o += newchar;
        } else {
            char = tabKeys[Math.floor(Math.random()*tabKeys.length)];
        }
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
