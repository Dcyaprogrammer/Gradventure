import os

files = [
    'src/client/App.tsx',
    'src/client/components/GameScreen.tsx',
    'src/client/components/StoreScreen.tsx',
    'src/client/components/KnowledgeBaseScreen.tsx',
    'src/client/components/AuthModal.tsx'
]

# Map muddy/grayish pastels to bright, clear macarons
replacements = {
    '#FAFAFA': '#FDF9F1', # Muddy white -> Bright Cream
    '#B5EAD7': '#86E3CE', # Muddy mint -> Bright Macaron Mint
    '#FFDAC1': '#FFA6A6', # Muddy peach -> Bright Macaron Coral/Red
    '#C7CEEA': '#D0BFFF', # Muddy purple -> Bright Macaron Purple
    '#FFD1DC': '#FFB3D9', # Muddy pink -> Bright Macaron Pink
    '#FFF5B2': '#FFE066'  # Muddy yellow -> Bright Macaron Lemon
}

for filepath in files:
    with open(filepath, 'r') as f:
        content = f.read()
    
    for old, new in replacements.items():
        content = content.replace(old, new)
        
    with open(filepath, 'w') as f:
        f.write(content)

print("Bright Macaron colors applied successfully.")
