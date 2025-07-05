from PIL import Image
import pytesseract
import re

# Se necessário, defina o caminho do executável do Tesseract no Windows:
# pytesseract.pytesseract.tesseract_cmd = r'C:\\Program Files\\Tesseract-OCR\\tesseract.exe'

imagem = 'screenshot.png'
texto = pytesseract.image_to_string(Image.open(imagem), lang='por')

linhas = [linha.strip() for linha in texto.split("\n") if len(linha.strip()) > 0]

titulo = ""
preco = ""
cta = ""

# Detectar título: maior linha com palavras-chave
for linha in linhas:
    if any(palavra in linha.lower() for palavra in ["ceo", "afiliado", "produto", "segredo", "estratégia"]) and len(linha) > len(titulo):
        titulo = linha

# Detectar preço
for linha in linhas:
    if "r$" in linha.lower():
        match = re.search(r"R\$\s?\d+(?:[\.,]\d{2})?", linha)
        if match:
            preco = match.group(0)

# Detectar CTA
for linha in linhas:
    if any(termo in linha.lower() for termo in ["compre", "garanta", "desconto", "oferta", "acesse", "não perca"]):
        cta = linha
        break

print("🧠 RESULTADOS EXTRAÍDOS COM OCR + IA SIMPLES:")
print(f"📌 TÍTULO: {titulo or 'Não encontrado'}")
print(f"💰 PREÇO: {preco or 'Não identificado'}")
print(f"👉 CHAMADA PARA AÇÃO: {cta or 'Não encontrada'}")
