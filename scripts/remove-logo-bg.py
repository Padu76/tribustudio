# scripts/remove-logo-bg.py
# Rimuove lo sfondo bianco dai loghi PNG
# Esegui con: E:\miniconda\python.exe scripts\remove-logo-bg.py

from PIL import Image
import os

LOGO_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'public', 'images', 'logo')

for fname in ['logo-tribu.png', 'logo-tribu-white.png']:
    path = os.path.join(LOGO_DIR, fname)
    if not os.path.exists(path):
        print(f'File non trovato: {path}')
        continue

    img = Image.open(path).convert('RGBA')
    data = img.getdata()
    new_data = []
    for item in data:
        # Rimuovi pixel bianchi o quasi bianchi (threshold 240)
        if item[0] > 240 and item[1] > 240 and item[2] > 240:
            new_data.append((item[0], item[1], item[2], 0))
        else:
            new_data.append(item)
    img.putdata(new_data)

    # Salva backup
    backup = path.replace('.png', '-backup.png')
    if not os.path.exists(backup):
        import shutil
        shutil.copy2(path, backup)
        print(f'Backup creato: {os.path.basename(backup)}')

    img.save(path, 'PNG')
    print(f'Sfondo rimosso: {fname}')

print('Fatto! I loghi ora hanno sfondo trasparente.')
