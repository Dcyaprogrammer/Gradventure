import os
import re

files = [
    'src/client/App.tsx',
    'src/client/components/GameScreen.tsx',
    'src/client/components/StoreScreen.tsx',
    'src/client/components/KnowledgeBaseScreen.tsx',
    'src/client/components/AuthModal.tsx'
]

# Map Custom Vintage Palette BACK TO Bright Macaron (Option A / Option 1)
replacements = {
    '#FFDAB3': '#FDF9F1', # Background Light Peach -> Bright Cream
    '#8174A0': '#D0BFFF', # GPA: Muted Purple -> Bright Purple
    '#EFB6C8': '#FFA6A6', # MNT: Dusty Pink -> Bright Coral Pink
    '#FFD2A0': '#FFE066', # ENG: Warm Orange -> Bright Lemon Yellow
    '#A888B5': '#89CFF0', # EXP: Mauve/Plum -> Bright Baby Blue
    '#C8AAAA': '#FFB3D9'  # Decor: Dusty Rose -> Bright Pink
}

for filepath in files:
    if os.path.exists(filepath):
        with open(filepath, 'r') as f:
            content = f.read()
        
        for old, new in replacements.items():
            content = re.sub(old, new, content, flags=re.IGNORECASE)
            
        with open(filepath, 'w') as f:
            f.write(content)

print("Reverted to Bright Macaron (Option A) successfully.")