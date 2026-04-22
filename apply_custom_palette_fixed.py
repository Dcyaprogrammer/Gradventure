import os
import re

files = [
    'src/client/App.tsx',
    'src/client/components/GameScreen.tsx',
    'src/client/components/StoreScreen.tsx',
    'src/client/components/KnowledgeBaseScreen.tsx',
    'src/client/components/AuthModal.tsx'
]

# User requested palette: FFDAB3, C8AAAA, 9F8383, 574964, 8174A0, A888B5, EFB6C8, FFD2A0
replacements = {
    # Backgrounds
    '#FDF9F1': '#FFDAB3', # Main Background -> Light Peach/Apricot
    '#FCF6F5': '#FFDAB3', # (If Option D was still around)
    
    # Core Stats
    '#D0BFFF': '#8174A0', # GPA -> Muted Purple
    '#A1C6EA': '#8174A0', # (Option D GPA)
    
    '#FFA6A6': '#EFB6C8', # Mentality/Warning -> Soft Dusty Pink
    '#FECEAB': '#EFB6C8', # (Option D MNT)
    
    '#FFE066': '#FFD2A0', # Energy/Highlight -> Warm Orange/Peach
    '#FFDE7D': '#FFD2A0', # (Option D ENG)
    
    '#89CFF0': '#A888B5', # Experience/Positive -> Mauve/Plum
    '#99B898': '#A888B5', # (Option D EXP)
    
    # Accents & Decor
    '#FFB3D9': '#C8AAAA', # Decor 1 -> Dusty Rose/Brown
    '#F8B195': '#C8AAAA', # (Option D Decor)
}

for filepath in files:
    if os.path.exists(filepath):
        with open(filepath, 'r') as f:
            content = f.read()
        
        for old, new in replacements.items():
            content = re.sub(old, new, content, flags=re.IGNORECASE)
            
        with open(filepath, 'w') as f:
            f.write(content)

print("Applied Custom Vintage Palette successfully.")