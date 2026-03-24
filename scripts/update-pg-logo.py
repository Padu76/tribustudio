# E:\tribustudio\scripts\update-pg-logo.py
# Rimuove sfondo nero dal logo allegato e lo salva come logo-tribu-white.png
# Eseguire: E:\miniconda\python.exe scripts\update-pg-logo.py

from PIL import Image
import numpy as np
import os
import shutil

script_dir = os.path.dirname(os.path.abspath(__file__))
project_dir = os.path.dirname(script_dir)
logo_dir = os.path.join(project_dir, "public", "images", "logo")

# Il logo sorgente è quello nel repo tribu-private-gym (backup con sfondo nero)
source_path = r"E:\tribu-private-gym\public\logo-tribu-backup.png"
output_path = os.path.join(logo_dir, "logo-tribu-white.png")
backup_path = os.path.join(logo_dir, "logo-tribu-white-backup.png")

print(f"Sorgente: {source_path}")
print(f"Output:   {output_path}")

# Backup
if os.path.exists(output_path):
    shutil.copy2(output_path, backup_path)
    print(f"Backup salvato: {backup_path}")

# Carica e processa
img = Image.open(source_path).convert("RGBA")
data = np.array(img)

r, g, b, a = data[:, :, 0], data[:, :, 1], data[:, :, 2], data[:, :, 3]

# Pixel neri/quasi neri -> trasparenti
black_mask = (r < 35) & (g < 35) & (b < 35)
data[black_mask, 3] = 0

# Anti-aliasing: pixel scuri vicini al bordo -> semi-trasparenti
dark_mask = (r < 70) & (g < 70) & (b < 70) & ~black_mask
brightness = (r[dark_mask].astype(float) + g[dark_mask].astype(float) + b[dark_mask].astype(float)) / 3.0
alpha_values = np.clip((brightness / 70.0) * 255, 0, 255).astype(np.uint8)
data[dark_mask, 3] = alpha_values

result = Image.fromarray(data)
result.save(output_path, "PNG")

print(f"Logo salvato con sfondo trasparente: {output_path}")
print(f"Dimensioni: {result.size[0]}x{result.size[1]}")
print("Fatto!")
