const fs = require('fs');
const txt = fs.readFileSync('C:\\Users\\dipak\\.gemini\\antigravity-ide\\brain\\e8d8b713-1184-4320-8f19-4843f561eec1\\.system_generated\\logs\\transcript.jsonl', 'utf8');

const match = txt.match(/(<section class=\\"testimonials\\".*?<\/section>)/s);
if (match) {
    fs.writeFileSync('testi.html', match[1].replace(/\\n/g, '\n').replace(/\\"/g, '"'));
}
