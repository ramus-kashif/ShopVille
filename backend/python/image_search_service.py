from fastapi import FastAPI, File, Response
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import io
import torch
import torchvision.transforms as T
import numpy as np
import json
from sklearn.metrics.pairwise import cosine_similarity
import open_clip

# Load your product embeddings (precomputed)
with open("product_embeddings.json", "r") as f:
    product_data = json.load(f)  # { "product_id": {"image": [...], "text": [...]} }

product_ids = list(product_data.keys())
product_embeddings = np.array([product_data[pid]["image"] for pid in product_ids])

# Use CLIP model for better similarity search
device = "cuda" if torch.cuda.is_available() else "cpu"
model, _, preprocess = open_clip.create_model_and_transforms('ViT-L-14', pretrained='openai', device=device)

def get_embedding(image_bytes):
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    image_input = preprocess(image).unsqueeze(0).to(device)
    with torch.no_grad():
        embedding = model.encode_image(image_input).cpu().numpy()
    return embedding.flatten()

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/search")
async def search_image(file: bytes = File(...)):
    try:
        query_emb = get_embedding(file)
        sims = cosine_similarity([query_emb], product_embeddings)[0]
        
        # Use a higher similarity threshold for better accuracy (0.8 = 80% similar)
        similarity_threshold = 0.8
        high_sim_indices = np.where(sims >= similarity_threshold)[0]
        
        if len(high_sim_indices) > 0:
            # Sort by similarity and take top results
            sorted_indices = high_sim_indices[np.argsort(sims[high_sim_indices])[::-1]]
            top_indices = sorted_indices[:3]  # Max 3 results for better accuracy
            top_ids = [product_ids[i] for i in top_indices]
            similarities = [float(sims[i]) for i in top_indices]
            
            return {
                "productIds": top_ids,
                "similarities": similarities,
                "totalFound": len(top_ids),
                "threshold": similarity_threshold
            }
        else:
            # If no high-similarity matches, try with a medium threshold
            medium_threshold = 0.6
            medium_sim_indices = np.where(sims >= medium_threshold)[0]
            
            if len(medium_sim_indices) > 0:
                sorted_indices = medium_sim_indices[np.argsort(sims[medium_sim_indices])[::-1]]
                top_indices = sorted_indices[:2]  # Max 2 results
                top_ids = [product_ids[i] for i in top_indices]
                similarities = [float(sims[i]) for i in top_indices]
                
                return {
                    "productIds": top_ids,
                    "similarities": similarities,
                    "totalFound": len(top_ids),
                    "threshold": medium_threshold,
                    "note": "Medium similarity threshold used"
                }
            else:
                # If still no matches, return top 1 with lower threshold
                top_indices = np.argsort(sims)[::-1][:1]
                top_ids = [product_ids[i] for i in top_indices]
                similarities = [float(sims[i]) for i in top_indices]
                
                return {
                    "productIds": top_ids,
                    "similarities": similarities,
                    "totalFound": len(top_ids),
                    "threshold": 0.4,
                    "note": "Low similarity threshold used - results may not be very accurate"
                }
            
    except Exception as e:
        return Response(content=str(e), status_code=500)