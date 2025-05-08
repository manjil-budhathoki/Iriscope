# iris_kmeans.py
import pandas as pd
from sklearn.datasets import load_iris
from sklearn.cluster import KMeans
from sklearn.decomposition import PCA
import json
import os

# Load iris dataset
iris = load_iris()
X = iris.data

# Reduce to 2D using PCA
pca = PCA(n_components=2)
X_pca = pca.fit_transform(X)

# Apply KMeans
kmeans = KMeans(n_clusters=3, random_state=42)
kmeans.fit(X)

# Prepare data for frontend
clustered_data = [
    {
        "x": float(x[0]),
        "y": float(x[1]),
        "cluster": int(kmeans.labels_[i])
    }
    for i, x in enumerate(X_pca)
]

# Create public folder if it doesn't exist
os.makedirs("public", exist_ok=True)

# Save data as JSON in public folder
with open("public/cluster_data.json", "w") as f:
    json.dump(clustered_data, f)

print("✅ cluster_data.json saved to /public")
