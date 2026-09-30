const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
    input: fs.createReadStream('C:\\Users\\dipak\\.gemini\\antigravity-ide\\brain\\e8d8b713-1184-4320-8f19-4843f561eec1\\.system_generated\\logs\\transcript.jsonl'),
    crlfDelay: Infinity
});

let lastIndexHtml = '';

rl.on('line', (line) => {
    try {
        const d = JSON.parse(line);
        if (d.type === 'TOOL_RESPONSE' && d.content && d.content.includes('File Path: ile:///d:/MindAxiss_Dipak/ASK_Evevators/index.html')) {
            lastIndexHtml = d.content;
        }
    } catch (e) {}
});

rl.on('close', () => {
    fs.writeFileSync('extracted.txt', lastIndexHtml);
    console.log('Done extracting.');
});
