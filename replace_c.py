import os

files = [
    'src/client/App.tsx',
    'src/client/components/GameScreen.tsx',
    'src/client/components/StoreScreen.tsx',
    'src/client/components/KnowledgeBaseScreen.tsx',
    'src/client/components/AuthModal.tsx'
]

replacements = {
    '#FDF9F1': '#FDF6F5',
    '#89CFF0': '#A2E1DB',
    '#FFA6A6': '#FFB6B9',
    '#D0BFFF': '#E2D1F9',
    '#FFB3D9': '#F2D8D8',
    '#FFE066': '#F3E5AB'
}

for filepath in files:
    if os.path.exists(filepath):
        with open(filepath, 'r') as f:
            content = f.read()
        
        for old, new in replacements.items():
            content = content.replace(old, new)
            
        with open(filepath, 'w') as f:
            f.write(content)

print("Applied Retro Morandi Pastel successfully.")
