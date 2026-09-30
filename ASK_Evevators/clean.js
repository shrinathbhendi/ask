const fs = require('fs');
let txt = fs.readFileSync('extracted.txt', 'utf8');

// The output format has:
// File Path: ile:///d:/MindAxiss_Dipak/ASK_Evevators/index.html
// Total Lines: 123
// Total Bytes: 123
// Showing lines 1 to 200
// The following code has been modified...
// 1: <!DOCTYPE html>

const lines = txt.split('\n');
let cleanHtml = [];
let started = false;

for (const line of lines) {
    if (line.match(/^\d+:/)) {
        started = true;
        cleanHtml.push(line.replace(/^\d+:\s?/, ''));
    } else if (started) {
        if (line.includes('The above content does NOT show the entire file contents.')) {
            break;
        }
    }
}

fs.writeFileSync('clean_index.html', cleanHtml.join('\n'));
console.log('Cleaned ' + cleanHtml.length + ' lines.');
