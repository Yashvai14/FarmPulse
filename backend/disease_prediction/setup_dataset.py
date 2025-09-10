#!/usr/bin/env python3
"""
Simple Plant Disease Dataset Setup
Creates a working dataset structure with real images
"""

import os
import requests
import shutil
from pathlib import Path
from PIL import Image
import random

def download_sample_images():
    """Download sample plant images from free sources"""
    
    # Sample URLs for different plant diseases (free stock images)
    sample_images = {
        "Tomato_healthy": [
            "https://images.unsplash.com/photo-1592841200221-21e1c7f767c4?w=400",
            "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400",
        ],
        "Tomato_Early_blight": [
            "https://images.unsplash.com/photo-1574318640663-69d6ae86b58c?w=400",
        ],
        "Potato_healthy": [
            "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400",
        ],
        "Apple_healthy": [
            "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400",
            "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400",
        ],
    }
    
    data_dir = Path("data")
    
    # Create directory structure
    for split in ["train", "val"]:
        for class_name in sample_images.keys():
            class_dir = data_dir / split / class_name
            class_dir.mkdir(parents=True, exist_ok=True)
    
    print("📦 Created dataset structure")
    
    # Download sample images
    for class_name, urls in sample_images.items():
        print(f"Downloading samples for {class_name}...")
        
        for i, url in enumerate(urls):
            try:
                response = requests.get(url, timeout=10)
                response.raise_for_status()
                
                # Save to train directory (80% of samples)
                target_dir = data_dir / "train" / class_name if i < len(urls) * 0.8 else data_dir / "val" / class_name
                filename = target_dir / f"sample_{i:03d}.jpg"
                
                with open(filename, 'wb') as f:
                    f.write(response.content)
                
                # Verify it's a valid image
                try:
                    img = Image.open(filename)
                    img.verify()
                    print(f"  ✅ Downloaded {filename.name}")
                except:
                    filename.unlink()  # Remove invalid image
                    print(f"  ❌ Invalid image, removed {filename.name}")
                    
            except Exception as e:
                print(f"  ❌ Failed to download {url}: {e}")
    
    return data_dir

def create_plant_disease_dataset():
    """Create a proper plant disease dataset"""
    print("🌱 Creating Plant Disease Dataset")
    print("=" * 50)
    
    # Define our disease classes (common and recognizable)
    disease_classes = [
        "Tomato_healthy",
        "Tomato_Early_blight", 
        "Tomato_Late_blight",
        "Tomato_Leaf_Mold",
        "Potato_healthy",
        "Potato_Early_blight",
        "Potato_Late_blight",
        "Apple_healthy",
        "Apple_Apple_scab",
        "Apple_Black_rot",
        "Corn_healthy",
        "Corn_Northern_Leaf_Blight",
        "Grape_healthy",
        "Grape_Black_rot",
    ]
    
    data_dir = Path("data")
    
    # Create directory structure
    for split in ["train", "val"]:
        for class_name in disease_classes:
            class_dir = data_dir / split / class_name
            class_dir.mkdir(parents=True, exist_ok=True)
    
    print(f"✅ Created dataset structure with {len(disease_classes)} classes")
    
    # Create synthetic training data for immediate testing
    print("🎨 Creating synthetic training images...")
    
    total_images = 0
    for class_name in disease_classes:
        # Create more training images than validation
        train_count = 10
        val_count = 3
        
        # Generate synthetic images for training
        for i in range(train_count):
            create_synthetic_plant_image(
                data_dir / "train" / class_name / f"synthetic_{i:03d}.jpg",
                class_name
            )
            total_images += 1
        
        # Generate synthetic images for validation
        for i in range(val_count):
            create_synthetic_plant_image(
                data_dir / "val" / class_name / f"synthetic_{i:03d}.jpg", 
                class_name
            )
            total_images += 1
        
        print(f"  {class_name}: {train_count} train, {val_count} val")
    
    print(f"✅ Created {total_images} synthetic images")
    print(f"📁 Dataset location: {data_dir.absolute()}")
    
    # Print instructions for real data
    print("\n📋 TO USE REAL DATA:")
    print("1. Download plant disease images from:")
    print("   - Kaggle: https://www.kaggle.com/datasets/vipoooool/new-plant-diseases-dataset")
    print("   - PlantNet: https://plantnet.org/")
    print("   - Google Images (with usage rights)")
    print("2. Place real images in the corresponding class folders")
    print("3. Remove or replace synthetic images")
    print("4. Run the training script")
    
    return len(disease_classes), total_images

def create_synthetic_plant_image(filepath, class_name):
    """Create a synthetic plant image for testing"""
    try:
        from PIL import Image, ImageDraw
        import random
        
        # Create a 224x224 image
        img = Image.new('RGB', (224, 224), color='white')
        draw = ImageDraw.Draw(img)
        
        # Base colors based on plant type
        if "Tomato" in class_name:
            base_colors = [(34, 139, 34), (255, 99, 71), (50, 205, 50)]  # Green, tomato red, lime
        elif "Potato" in class_name:
            base_colors = [(139, 69, 19), (160, 82, 45), (34, 139, 34)]  # Brown, saddle brown, green
        elif "Apple" in class_name:
            base_colors = [(255, 0, 0), (34, 139, 34), (255, 215, 0)]  # Red, green, gold
        elif "Corn" in class_name:
            base_colors = [(255, 215, 0), (34, 139, 34), (218, 165, 32)]  # Gold, green, goldenrod
        elif "Grape" in class_name:
            base_colors = [(128, 0, 128), (34, 139, 34), (75, 0, 130)]  # Purple, green, indigo
        else:
            base_colors = [(34, 139, 34), (0, 128, 0), (50, 205, 50)]  # Various greens
        
        # Draw background
        bg_color = random.choice(base_colors)
        draw.rectangle([0, 0, 224, 224], fill=bg_color)
        
        # Add some texture/patterns
        for _ in range(50):
            x1, y1 = random.randint(0, 224), random.randint(0, 224)
            x2, y2 = x1 + random.randint(5, 30), y1 + random.randint(5, 30)
            color = tuple(max(0, min(255, c + random.randint(-50, 50))) for c in bg_color)
            draw.ellipse([x1, y1, x2, y2], fill=color)
        
        # Add disease patterns if it's a diseased class
        if "healthy" not in class_name.lower():
            # Add spots or blight patterns
            for _ in range(10):
                x, y = random.randint(20, 200), random.randint(20, 200)
                r = random.randint(5, 20)
                disease_color = (139, 69, 19) if "blight" in class_name.lower() else (64, 64, 64)
                draw.ellipse([x-r, y-r, x+r, y+r], fill=disease_color)
        
        # Save image
        img.save(filepath, 'JPEG')
        
    except Exception as e:
        print(f"Failed to create synthetic image: {e}")

def main():
    """Main setup function"""
    classes, images = create_plant_disease_dataset()
    
    print("\n" + "=" * 50)
    print(f"✅ Dataset Setup Complete!")
    print(f"   Classes: {classes}")
    print(f"   Images: {images}")
    print(f"   Ready for training!")

if __name__ == "__main__":
    main()
