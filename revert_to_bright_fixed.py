import os

files = [
    'src/client/App.tsx',
    'src/client/components/GameScreen.tsx',
    'src/client/components/StoreScreen.tsx',
    'src/client/components/KnowledgeBaseScreen.tsx',
    'src/client/components/AuthModal.tsx'
]

# Map Option D (Sunset Cotton Candy) BACK TO Bright Macaron (Option 1 Backup)
replacements = {
    '#FCF6F5': '#FDF9F1', # Background Cloud -> Bright Cream
    '#99B898': '#89CFF0', # EXP: Sage Green -> Bright Baby Blue
    '#FECEAB': '#FFA6A6', # MNT: Apricot Pink -> Bright Coral Pink
    '#A1C6EA': '#D0BFFF', # GPA: Baby Blue -> Bright Purple
    '#FFDE7D': '#FFE066', # ENG: Lemon Yellow -> Bright Lemon
    '#F8B195': '#FFB3D9'  # Decor: Sunset Pink -> Bright Pink
}

for filepath in files:
    if os.path.exists(filepath):
        with open(filepath, 'r') as f:
            content = f.read()
        
        for old, new in replacements.items():
            content = content.replace(old, new)
            
        with open(filepath, 'w') as f:
            f.write(content)

print("Reverted to Bright Macaron successfully.")