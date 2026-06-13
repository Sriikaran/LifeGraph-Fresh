import re

def fix_app_py():
    with open('src/app.py', 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Just remove the markers in app.py
    content = re.sub(r'<<<<<<< HEAD\n', '', content)
    content = re.sub(r'=======\n', '', content)
    content = re.sub(r'>>>>>>> [^\n]+\n', '', content)
    
    with open('src/app.py', 'w', encoding='utf-8') as f:
        f.write(content)

def fix_openapi_yaml():
    with open('docs/openapi.yaml', 'r', encoding='utf-8') as f:
        content = f.read()

    # We need to manually fix the openapi.yaml blocks.
    # Because of how Git merged them, the ======= separates two endpoint blocks that share the body AFTER the >>>>>>> marker.
    # The structure looks like:
    # <<<<<<< HEAD
    #   Schema1:
    #     ...
    # =======
    #   Schema2:
    #     ...
    # >>>>>>> hash
    #   shared_body
    
    # Actually, we can just replace the markers and duplicate the shared body.
    # Let's inspect the markers manually.
    
fix_app_py()
print("app.py fixed")
