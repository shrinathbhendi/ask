import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the inner contents of .top-bar-container
pattern = r'(<div class="top-bar-left">.*?</div>\s*<div class="top-bar-right"[^>]*>.*?</div>)'

replacement = r'''<div class="tb-marquee-track">
                <div class="tb-marquee-content">
                    \1
                </div>
                <div class="tb-marquee-content" aria-hidden="true">
                    \1
                </div>
            </div>'''

new_content = re.sub(pattern, replacement, content, flags=re.DOTALL)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Done")
