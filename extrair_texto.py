from PIL import Image
import pytesseract

# Altere se necessário para apontar para o executável do Tesseract no Windows:
# pytesseract.pytesseract.tesseract_cmd = r'C:\\Program Files\\Tesseract-OCR\\tesseract.exe'

imagem = 'screenshot.png'
texto = pytesseract.image_to_string(Image.open(imagem), lang='por')

linhas = texto.split("\n")
linhas_filtradas = [l for l in linhas if len(l.strip()) > 30]

print("\n".join(linhas_filtradas if linhas_filtradas else linhas))
