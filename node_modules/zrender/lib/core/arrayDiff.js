// Hirschberg's algorithm
// http://en.wikipedia.org/wiki/Hirschberg%27s_algorithm

/**
 * @module zrender/core/arrayDiff
 * @author Yi Shen
 */


    function defaultCompareFunc(a, b) {
        return a === b;
    }

    function createItem(cmd, idx, idx1) {
        var res = {
            // cmd explanation
            // '=': not change
            // '^': replace with a new item in second array. Unused temporary
            // '+': add a new item of second array
            // '-': del item in first array
            cmd: cmd,
            // Value index, use index in the first array
            // Except '+'. Adding a new item needs value in the second array
            idx: idx
        };
        // Replace need to know both two indices
        // if (cmd === '^') {
        //     res.idx1 = idx1;
        // }

        if (cmd === '=') {
            res.idx1 = idx1;
        }
        return res;
    }

    function append(out, cmd, idx, idx1) {
        out.push(createItem(cmd, idx, idx1));
    }

    var abs = Math.abs;
    // Needleman-Wunsch score
    function score(arr0, arr1, i0, i1, j0, j1, equal, memo) {
        var last;
        var invM = i0 > i1;
        var invN = j0 > j1;
        var m = abs(i1 - i0);
        var n = abs(j1 - j0);
        var i;
        var j;
        for (i = 0; i <= m; i++) {
            for (j = 0; j <= n; j++) {
                if (i === 0) {
                    memo[j] = j;
                }
                else if (j === 0) {
                    last = memo[j];
                    memo[j] = i;
                }
                else {
                    // memo[i-1][j-1] + same(arr0[i-1], arr1[j-1]) ? 0 : 1
                    // Retained or replace
                    var val0 = arr0[invM ? (i0 - i) : (i - 1 + i0)];
                    var val1 = arr1[invN ? (j0 - j) : (j - 1 + j0)];
                    // Because replace is add after remove actually
                    // It has a higher score than removing or adding
                    // TODO custom score function
                    var score0 = last + (equal(val0, val1) ? 0 : 2);
                    // memo[i-1][j] + 1
                    // Remove arr0[i-1]
                    var score1 = memo[j] + 1;
                    // memo[i][j-1] + 1
                    // Add arr1[j-1]
                    var score2 = memo[j - 1] + 1;

                    last = memo[j];
                    memo[j] = score0 < score1 ? score0 : score1;
                    score2 < memo[j] && (memo[j] = score2);
                    // Math min of three parameters seems slow
                    // memo[j] = Math.min(score0, score1, score2);
                }
            }
        }

        return memo;
    }

    function hirschberg(arr0, arr1, i0, i1, j0, j1, equal, score0, score1) {
        var out = [];
        var len0 = i1 - i0;
        var len1 = j1 - j0;
        var i;
        var j;
        if (! len0) {
            for (j = 0; j < len1; j++) {
                append(out, '+', j + j0);
            }
        }
        else if (! len1) {
            for (i = 0; i < len0; i++) {
                append(out, '-', i + i0);
            }
        }
        else if (len0 === 1) {
            var a = arr0[i0];
            var matched = false;
            for (j = 0; j < len1; j++) {
                if (equal(a, arr1[j + j0]) && ! matched) {
                    matched = true;
                    // Equal and update use the index in first array
                    append(out, '=', i0, j + j0);
                }
                else {
                    // if (j === len1 - 1 && ! matched) {
                    //     append(out, '^', i0, j + j0);
                    // }
                    // else {
                    append(out, '+', j + j0);
                    // }
                }
            }
            if (! matched) {
                append(out, '-', i0);
            }
        }
        else if (len1 === 1) {
            var b = arr1[j0];
            var matched = false;
            for (i = 0; i < len0; i++) {
                if (equal(b, arr0[i + i0]) && ! matched) {
                    matched = true;
                    append(out, '=', i + i0, j0);
                }
                else {
                    // if (i === len0 - 1 && ! matched) {
                    //     append(out, '^', i + i0, j0);
                    // }
                    // else {
                    append(out, '-', i + i0);
                    // }
                }
            }
            if (! matched) {
                append(out, '+', j0);
            }
        }
        else {
            var imid = ((len0 / 2) | 0) + i0;

            score(arr0, arr1, i0, imid, j0, j1, equal, score0);
            score(arr0, arr1, i1, imid + 1, j1, j0, equal, score1);

            var min = Infinity;
            var jmid = 0;
            var sum;
            for (j = 0; j <= len1; j++) {
                sum = score0[j] + score1[len1 - j];
                if (sum < min) {
                    min = sum;
                    jmid = j;
                }
            }
            jmid += j0;

            out = hirschberg(arr0, arr1, i0, imid, j0, jmid, equal, score0, score1);
            var out1 = hirschberg(arr0, arr1, imid, i1, jmid, j1, equal, score0, score1);
            // Concat
            for (i = 0; i < out1.length; i++) {
                out.push(out1[i]);
            }
        }
        return out;
    }

    function arrayDiff(arr0, arr1, equal) {
        equal = equal || defaultCompareFunc;
        // Remove the common head and tail
        var i;
        var j;
        var len0 = arr0.length;
        var len1 = arr1.length;
        var lenMin = Math.min(len0, len1);
        var head = [];
        for (i = 0; i < lenMin; i++) {
            if (! equal(arr0[i], arr1[i])) {
                break;
            }
            append(head, '=', i, i);
        }

        for (j = 0; j < lenMin; j++) {
            if (! equal(arr0[len0 - j - 1], arr1[len1 - j - 1])) {
                break;
            }
        }

        if (len0 - j >= i || len1 - j >= i) {
            var middle = hirschberg(arr0, arr1, i, len0 - j, i, len1 - j, equal, [], []);
            for (i = 0; i < middle.length; i++) {
                head.push(middle[i]);
            }
            for (i = 0; i < j; i++) {
                append(head, '=', len0 - j + i, len1 - j + i);
            }
        }
        return head;
    }

    module.exports = arrayDiff;
