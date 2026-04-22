import os

files = [
    'src/client/App.tsx',
    'src/client/components/GameScreen.tsx',
    'src/client/components/StoreScreen.tsx',
    'src/client/components/KnowledgeBaseScreen.tsx',
    'src/client/components/AuthModal.tsx'
]

for filepath in files:
    if os.path.exists(filepath):
        with open(filepath, 'r') as f:
            content = f.read()
        
        # Replace the hex color
        content = content.replace('#86E3CE', '#89CFF0')
        # Also update comments just in case
        content = content.replace('Pastel Mint', 'Pastel Blue')
        
        with open(filepath, 'w') as f:
            f.write(content)

print("Mint Green replaced with Pastel Baby Blue.")
