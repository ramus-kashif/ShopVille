import json
import requests
import torch
import open_clip
from PIL import Image
import io
import numpy as np
from tqdm import tqdm

# Load CLIP model
device = "cuda" if torch.cuda.is_available() else "cpu"
print(f"Using device: {device}")

model, _, preprocess = open_clip.create_model_and_transforms('ViT-L-14', pretrained='openai', device=device)
model.eval()

def get_embedding_from_url(image_url):
    try:
        response = requests.get(image_url, timeout=10)
        if response.status_code == 200:
            image = Image.open(io.BytesIO(response.content)).convert("RGB")
            image_input = preprocess(image).unsqueeze(0).to(device)
            with torch.no_grad():
                embedding = model.encode_image(image_input).cpu().numpy()
            return embedding.flatten().tolist()
    except Exception as e:
        print(f"Error processing {image_url}: {e}")
    return None

def get_text_embedding(text):
    with torch.no_grad():
        text_tokens = open_clip.tokenize([text]).to(device)
        embedding = model.encode_text(text_tokens).cpu().numpy()
    return embedding.flatten().tolist()

# Load products from JSON
with open("products.json", "r", encoding="utf-8") as f:
    products = json.load(f)

print(f"Found {len(products)} products")

# Generate embeddings
embeddings = {}
successful = 0
failed = 0

for product in tqdm(products, desc="Generating embeddings"):
    product_id = product.get("_id")
    image_url = product.get("image_url")
    title = product.get("title", "")
    description = product.get("description", "")
    text = f"{title}. {description}".strip()

    image_embedding = get_embedding_from_url(image_url) if image_url else None
    text_embedding = get_text_embedding(text) if text else None

    if image_embedding and text_embedding:
        embeddings[product_id] = {"image": image_embedding, "text": text_embedding}
        successful += 1
    else:
        failed += 1

print(f"Successfully generated embeddings for {successful} products")
print(f"Failed to generate embeddings for {failed} products")

# Save embeddings
with open("product_embeddings.json", "w") as f:
    json.dump(embeddings, f)

print("Embeddings saved to product_embeddings.json") 