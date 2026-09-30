import json
with open(r'C:\Users\dipak\.gemini\antigravity-ide\brain\e8d8b713-1184-4320-8f19-4843f561eec1\.system_generated\logs\transcript.jsonl', 'r') as f:
    for line in f:
        try:
            d = json.loads(line)
            if d.get('type') == 'TOOL_RESPONSE':
                output = d.get('content', '')
                if 'File Path: ile:///d:/MindAxiss_Dipak/ASK_Evevators/index.html' in output:
                    print(output[:1500])
                    print('\n---SNIP---\n')
                    print(output[-1500:])
                    break
        except:
            pass
