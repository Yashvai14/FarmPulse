import os
import requests
import zipfile
import shutil
from pathlib import Path


def download_plant_village_dataset():
    """
    Download PlantVillage dataset from Kaggle using direct download link
    This assumes you have kaggle CLI configured or use a mirror
    """
    DATA_DIR = os.path.join(os.path.dirname(__file__), "data")
    os.makedirs(DATA_DIR, exist_ok=True)
    
    # For demonstration, we'll create a small synthetic dataset structure
    # In real usage, you would download from:
    # https://www.kaggle.com/datasets/vipoooool/new-plant-diseases-dataset
    
    print("Creating sample plant disease dataset structure...")
    
    # Create directory structure
    classes = [
        "Apple___Apple_scab",
        "Apple___Black_rot", 
        "Apple___Cedar_apple_rust",
        "Apple___healthy",
        "Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot",
        "Corn_(maize)___Common_rust_",
        "Corn_(maize)___Northern_Leaf_Blight",
        "Corn_(maize)___healthy",
        "Grape___Black_rot",
        "Grape___Esca_(Black_Measles)",
        "Grape___Leaf_blight_(Isariopsis_Leaf_Spot)",
        "Grape___healthy",
        "Potato___Early_blight",
        "Potato___Late_blight",
        "Potato___healthy",
        "Tomato___Bacterial_spot",
        "Tomato___Early_blight",
        "Tomato___Late_blight",
        "Tomato___Leaf_Mold",
        "Tomato___Septoria_leaf_spot",
        "Tomato___Spider_mites Two-spotted_spider_mite",
        "Tomato___Target_Spot",
        "Tomato___Tomato_Yellow_Leaf_Curl_Virus",
        "Tomato___Tomato_mosaic_virus",
        "Tomato___healthy"
    ]
    
    for split in ["train", "val"]:
        split_dir = os.path.join(DATA_DIR, split)
        os.makedirs(split_dir, exist_ok=True)
        
        for class_name in classes:
            class_dir = os.path.join(split_dir, class_name)
            os.makedirs(class_dir, exist_ok=True)
    
    # Create a sample image download function
    def create_placeholder_image(path):
        """Create a placeholder image for demonstration"""
        try:
            from PIL import Image, ImageDraw
            import random
            
            # Create a 224x224 RGB image with some random patterns
            img = Image.new('RGB', (224, 224), color=(random.randint(50, 200), random.randint(50, 200), random.randint(50, 200)))
            draw = ImageDraw.Draw(img)
            
            # Add some random shapes to simulate leaf patterns
            for _ in range(10):
                x1, y1 = random.randint(0, 200), random.randint(0, 200)
                x2, y2 = x1 + random.randint(10, 50), y1 + random.randint(10, 50)
                color = (random.randint(0, 255), random.randint(0, 255), random.randint(0, 255))
                draw.ellipse([x1, y1, x2, y2], fill=color)
            
            img.save(path)
        except ImportError:
            # If PIL is not available, create empty file
            with open(path, 'w') as f:
                f.write("placeholder")
    
    # Create sample images for each class
    print("Creating sample images...")
    for split in ["train", "val"]:
        num_images = 20 if split == "train" else 5  # More training images
        for class_name in classes:
            class_dir = os.path.join(DATA_DIR, split, class_name)
            for i in range(num_images):
                img_path = os.path.join(class_dir, f"sample_{i:03d}.jpg")
                create_placeholder_image(img_path)
    
    print(f"✅ Sample dataset created at: {DATA_DIR}")
    print("Dataset structure:")
    print(f"  - {len(classes)} classes")
    print(f"  - Training images: {len(classes) * 20}")
    print(f"  - Validation images: {len(classes) * 5}")
    
    return DATA_DIR


def download_real_dataset():
    """
    Instructions for downloading real PlantVillage dataset
    """
    print("""
    To use a real plant disease dataset:
    
    1. Install Kaggle CLI: pip install kaggle
    2. Set up Kaggle API credentials (kaggle.json)
    3. Download dataset:
       kaggle datasets download -d vipoooool/new-plant-diseases-dataset
    4. Extract to ./data/ directory
    5. Ensure the structure matches:
       data/
         train/
           Apple___Apple_scab/
             image1.jpg
             image2.jpg
           Apple___Black_rot/
           ...
         val/
           Apple___Apple_scab/
           Apple___Black_rot/
           ...
    
    Alternative datasets:
    - Plant Pathology 2020: kaggle competitions download -c plant-pathology-2020-fgvc7
    - PlantDoc: https://github.com/pratikkayal/PlantDoc-Dataset
    """)


if __name__ == "__main__":
    print("Setting up plant disease dataset...")
    print("Choose option:")
    print("1. Create sample dataset (for testing)")
    print("2. Show instructions for real dataset")
    
    choice = input("Enter choice (1 or 2): ").strip()
    
    if choice == "1":
        download_plant_village_dataset()
    else:
        download_real_dataset()
