import requests
from PIL import Image
import io
import torch
import torchvision.transforms as T
import json

# Load product list
with open("products.json", "r") as f:
    products = json.load(f)

model = torch.hub.load('pytorch/vision:v0.10.0', 'resnet18', pretrained=True)
model.eval()
transform = T.Compose([
    T.Resize((224, 224)),
    T.ToTensor(),
    T.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
])

def get_embedding_from_url(url):
    response = requests.get(url)
    image = Image.open(io.BytesIO(response.content)).convert("RGB")
    tensor = transform(image).unsqueeze(0)
    with torch.no_grad():
        embedding = model(tensor).squeeze().numpy()
    return embedding.tolist()

embeddings = {}
for prod in products:
    try:
        emb = get_embedding_from_url(prod["image_url"])
        embeddings[prod["_id"]] = emb
        print(f"Processed {prod['_id']}")
    except Exception as e:
        print(f"Failed for {prod['_id']}: {e}")

with open("product_embeddings.json", "w") as f:
    json.dump(embeddings, f)