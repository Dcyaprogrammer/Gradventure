import os

files = [
    'src/client/App.tsx',
    'src/client/components/GameScreen.tsx',
    'src/client/components/StoreScreen.tsx',
    'src/client/components/KnowledgeBaseScreen.tsx',
    'src/client/components/AuthModal.tsx'
]

# Map Bright Macaron -> Morandi Pastel
replacements = {
    '#FDF9F1': '#FDF6F5', # Background
    '#89CFF0': '#A2E1DB', # Blue -> Lake Blue-Green
    '#FFA6A6': '#FFB6B9', # Bright Peach -> Salmon Pink
    '#D0BFFF': '#E2D1F9', # Bright Purple -> Lilac
    '#FFB3D9': '#F2D8D8', # Bright Pink -> Dusty Rose
    '#FFE066': '#F3E5AB'  # Lemon Yellow -> Vanilla
}

for filepath in files:
    if os.path.exists(filepath):
        with open(filepath, 'r') as f:
            content = f.read()
        
        for old, new in replacements.items():
            content = content.replace(old, new)
            
        with open(filepath, 'w') as f:
            f.write(content)

print("Applied Retro Morandi Pastel (Option C) successfully.")
