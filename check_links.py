import re
from pathlib import Path
base = Path('.')
pattern = re.compile(r'(?<=\b(?:src|href)="|\baction=")([^"\?#]+)')
broken = False
for path in base.glob('*.html'):
    text = path.read_text(encoding='utf-8')
    for m in pattern.finditer(text):
        ref = m.group(1)
        if re.match(r'^(https?:|mailto:|#|javascript:|data:)', ref):
            continue
        target = (path.parent / ref)
        if not target.exists():
            broken = True
            print(f'{path.name}: {ref} -> NOT FOUND')
if not broken:
    print('All local HTML references exist.')
