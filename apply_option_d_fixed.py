import os

files = [
    'src/client/App.tsx',
    'src/client/components/GameScreen.tsx',
    'src/client/components/StoreScreen.tsx',
    'src/client/components/KnowledgeBaseScreen.tsx',
    'src/client/components/AuthModal.tsx'
]

# Map Option C (Morandi) -> Option D (Sunset Cotton Candy)
replacements = {
    '#FDF6F5': '#FCF6F5', # Background Seashell -> Cloud White
    '#A2E1DB': '#99B898', # EXP: Blue-Green -> Sage Green
    '#FFB6B9': '#FECEAB', # MNT: Salmon Pink -> Apricot Pink
    '#E2D1F9': '#A1C6EA', # GPA: Lilac -> Baby Blue
    '#F3E5AB': '#FFDE7D', # ENG: Vanilla -> Lemon Yellow
    '#F2D8D8': '#F8B195'  # Decor: Dusty Rose -> Sunset Pink
}

for filepath in files:
    if os.path.exists(filepath):
        with open(filepath, 'r') as f:
            content = f.read()
        
        for old, new in replacements.items():
            content = content.replace(old, new)
            
        with open(filepath, 'w') as f:
            f.write(content)

print("Applied Sunset Cotton Candy (Option D) successfully.")
