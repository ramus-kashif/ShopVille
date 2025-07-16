import json

# Load your current products.json
with open("products.json", "r") as f:
    raw_products = json.load(f)

# Convert to the required format
converted = []
for prod in raw_products:
    converted.append({
        "_id": prod["_id"]["$oid"],
        "image_url": prod["picture"]["secure_url"]
    })

# Save as products_converted.json (or overwrite products.json if you want)
with open("products_converted.json", "w") as f:
    json.dump(converted, f, indent=2)

print("Conversion complete! Saved as products_converted.json")