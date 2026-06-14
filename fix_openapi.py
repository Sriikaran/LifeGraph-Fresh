import re

def fix_openapi_yaml():
    with open('docs/openapi.yaml', 'r', encoding='utf-8') as f:
        lines = f.readlines()

    out_lines = []
    i = 0
    while i < len(lines):
        if lines[i].startswith('<<<<<<< HEAD'):
            # parse block A
            i += 1
            block_a = []
            while not lines[i].startswith('======='):
                block_a.append(lines[i])
                i += 1
            # skip =======
            i += 1
            # parse block B
            block_b = []
            while not lines[i].startswith('>>>>>>>'):
                block_b.append(lines[i])
                i += 1
            # skip >>>>>>>
            i += 1
            
            # Now we find the shared block. It's everything up to the next line that has the same or less indentation as the first line of block A or B that defines a key.
            # Usually, these keys are indented by 4 spaces (schemas) or 2 spaces (paths).
            # Let's find the indentation of the last key in block A.
            
            # Actually, to make it robust, we collect lines until we see a line that starts with exactly 4 spaces (for schemas) or 2 spaces (for paths) followed by a word character.
            # Because schemas are at indent 4, paths are at indent 2.
            # But wait, shared block might not exist! If the conflict was just a simple replacement, there is no shared block.
            # Let's check if there's a shared block. If the next line is indented MORE than 4 spaces (e.g. 6 spaces), it's part of the shared block for a schema.
            
            shared_block = []
            while i < len(lines):
                line = lines[i]
                if not line.strip(): # empty line
                    shared_block.append(line)
                    i += 1
                    continue
                indent = len(line) - len(line.lstrip())
                # If it's a schema (indent 4) or path (indent 2) new key, it breaks.
                if indent <= 4 and re.match(r'^[ ]{0,4}[A-Za-z0-9_/-]+:', line):
                    break
                shared_block.append(line)
                i += 1
            
            # Now output A + shared + B + shared
            out_lines.extend(block_a)
            out_lines.extend(shared_block)
            out_lines.extend(block_b)
            out_lines.extend(shared_block)
            continue
            
        out_lines.append(lines[i])
        i += 1

    with open('docs/openapi.yaml', 'w', encoding='utf-8') as f:
        f.writelines(out_lines)

if __name__ == "__main__":
    fix_openapi_yaml()
