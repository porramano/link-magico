import requests
from PIL import Image
import pytesseract
import re

# pytesseract.pytesseract.tesseract_cmd = r"C:\\Program Files\\Tesseract-OCR\\tesseract.exe"

CHATBOT_URL = "http://localhost:3000/api/chat"
PRODUTO_URL = "https://www.arsenalsecretodosceos.com.br/promocao"
USUARIO_MENSAGEM = "Fale mais sobre esse produto, por favor."

imagem = 'screenshot.png'
texto = pytesseract.image_to_string(Image.open(imagem), lang='por')

linhas = [linha.strip() for linha in texto.split("\n") if len(linha.strip()) > 0]

titulo = ""
preco = ""
cta = ""

for linha in linhas:
    if any(p in linha.lower() for p in ["ceo", "afiliado", "produto", "segredo", "estratégia", "curso"]) and len(linha) > len(titulo):
        titulo = linha

for linha in linhas:
    if "r$" in linha.lower():
        match = re.search(r"R\$\s?\d+(?:[\.,]\d{2})?", linha)
        if match:
            preco = match.group(0)

for linha in linhas:
    if any(termo in linha.lower() for termo in ["compre", "garanta", "desconto", "oferta", "acesse", "não perca"]):
        cta = linha
        break

# ENVIA PARA O CHATBOT
resposta = requests.post(CHATBOT_URL, json={
    "message": USUARIO_MENSAGEM,
    "productUrl": PRODUTO_URL
})

print("📡 Enviado para o chatbot.")
print("🤖 Resposta da IA:")
print(resposta.json().get("response", "Erro ou resposta não retornada."))
