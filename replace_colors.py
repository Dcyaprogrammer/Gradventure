import os

files = [
    'src/client/App.tsx',
    'src/client/components/GameScreen.tsx',
    'src/client/components/StoreScreen.tsx',
    'src/client/components/KnowledgeBaseScreen.tsx',
    'src/client/components/AuthModal.tsx'
]

replacements = {
    '#FDFBF7': '#FAFAFA', # Cream -> Pastel White
    '#00E59B': '#B5EAD7', # Mint Green -> Pastel Mint
    '#FF6B6B': '#FFDAC1', # Coral Red -> Pastel Peach
    '#B983FF': '#C7CEEA', # Violet -> Pastel Purple
    '#FF90E8': '#FFD1DC', # Pink -> Pastel Pink
    '#FFC900': '#FFF5B2'  # Bright Yellow -> Pastel Yellow
}

for filepath in files:
    with open(filepath, 'r') as f:
        content = f.read()
    
    for old, new in replacements.items():
        content = content.replace(old, new)
        
    with open(filepath, 'w') as f:
        f.write(content)

print("Colors replaced successfully.")
