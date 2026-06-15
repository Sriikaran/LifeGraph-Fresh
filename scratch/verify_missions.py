import re
import os

artifact_dir = r"C:\Users\srika\.gemini\antigravity-ide\brain\6122a41d-195e-48af-8c3c-d5f5a2eba867"

# 1. Load UNIQUE_IMAGE ids
unique_ids = set()
with open(os.path.join(artifact_dir, "hq_products_only.md"), "r", encoding='utf-8') as f:
    for line in f:
        # - **Product Name** (`product_id`)
        match = re.search(r'\(`([^`]+)`\)', line)
        if match:
            unique_ids.add(match.group(1))

print(f"Loaded {len(unique_ids)} UNIQUE_IMAGE IDs.")

# 2. Parse demo_product_expansion_report.md
with open(os.path.join(artifact_dir, "demo_product_expansion_report.md"), "r", encoding='utf-8') as f:
    lines = f.readlines()

output_md = "# Final Demo Products (Verified against UNIQUE_IMAGE pool)\n\n"

removed_count = 0
verified_count = 0

for line in lines:
    # Match product line: 1. Name (`id`) - *Cat*
    match = re.match(r'^(\d+)\.\s+(.+)\s*\(`([^`]+)`\)\s*-\s*\*(.+)\*', line.strip())
    if match:
        idx, name, pid, cat = match.groups()
        if pid in unique_ids:
            output_md += f"- [VERIFIED] {name.strip()} (`{pid}`) - *{cat}*\n"
            verified_count += 1
        else:
            print(f"Removed NOT VERIFIED: {name} ({pid})")
            removed_count += 1
    else:
        output_md += line

with open(os.path.join(artifact_dir, "final_demo_products_verified.md"), "w", encoding='utf-8') as f:
    f.write(output_md)

print(f"Verified and kept: {verified_count}")
print(f"Removed: {removed_count}")
