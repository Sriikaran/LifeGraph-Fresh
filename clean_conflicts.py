import os

def clean_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    out = []
    for line in lines:
        if line.startswith('<<<<<<<') or line.startswith('=======') or line.startswith('>>>>>>>'):
            continue
        out.append(line)
        
    with open(filepath, 'w', encoding='utf-8') as f:
        f.writelines(out)
    print(f"Cleaned {filepath}")

clean_file('docs/openapi.yaml')
clean_file('src/app.py')
