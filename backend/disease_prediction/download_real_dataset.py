#!/usr/bin/env python3
"""
Download real Plant Disease dataset from reliable sources
"""

import os
import requests
import zipfile
import shutil
from pathlib import Path
from tqdm import tqdm

def download_file(url, filename):
    """Download file with progress bar"""
    print(f"Downloading {filename}...")
    response = requests.get(url, stream=True)
    response.raise_for_status()
    
    total_size = int(response.headers.get('content-length', 0))
    
    with open(filename, 'wb') as file, tqdm(
        desc=filename,
        total=total_size,
        unit='B',
        unit_scale=True,
        unit_divisor=1024,
    ) as progress_bar:
        for data in response.iter_content(chunk_size=1024):
            size = file.write(data)
            progress_bar.update(size)
    
    print(f"✅ Downloaded {filename}")

def extract_dataset(zip_path, extract_path):
    """Extract dataset with progress"""
    print(f"Extracting {zip_path}...")
    with zipfile.ZipFile(zip_path, 'r') as zip_ref:
        zip_ref.extractall(extract_path)
    print(f"✅ Extracted to {extract_path}")

def organize_dataset(source_dir, target_dir):
    """Organize dataset into train/val structure"""
    print("Organizing dataset structure...")
    
    # Create target directories
    train_dir = os.path.join(target_dir, "train")
    val_dir = os.path.join(target_dir, "val")
    os.makedirs(train_dir, exist_ok=True)
    os.makedirs(val_dir, exist_ok=True)
    
    # Find all class directories
    source_path = Path(source_dir)
    class_dirs = [d for d in source_path.iterdir() if d.is_dir()]
    
    total_images = 0
    total_classes = 0
    
    for class_dir in class_dirs:
        if class_dir.name.startswith('.'):  # Skip hidden folders
            continue
            
        class_name = class_dir.name
        images = list(class_dir.glob("*.jpg")) + list(class_dir.glob("*.jpeg")) + list(class_dir.glob("*.png"))
        
        if len(images) == 0:
            continue
            
        print(f"Processing class: {class_name} ({len(images)} images)")
        
        # Create class directories
        train_class_dir = os.path.join(train_dir, class_name)
        val_class_dir = os.path.join(val_dir, class_name)
        os.makedirs(train_class_dir, exist_ok=True)
        os.makedirs(val_class_dir, exist_ok=True)
        
        # Split images (80% train, 20% val)
        split_idx = int(0.8 * len(images))
        train_images = images[:split_idx]
        val_images = images[split_idx:]
        
        # Copy training images
        for img in train_images:
            shutil.copy2(img, train_class_dir)
        
        # Copy validation images
        for img in val_images:
            shutil.copy2(img, val_class_dir)
        
        total_images += len(images)
        total_classes += 1
        
        print(f"  Train: {len(train_images)}, Val: {len(val_images)}")
    
    print(f"✅ Dataset organized: {total_classes} classes, {total_images} total images")
    return total_classes, total_images

def main():
    """Main download and setup function"""
    print("🌱 Plant Disease Dataset Downloader")
    print("=" * 50)
    
    # Dataset URLs (multiple options)
    datasets = [
        {
            "name": "PlantVillage Dataset (Kaggle Mirror)",
            "url": "https://storage.googleapis.com/plant-disease-dataset/PlantVillage-Dataset.zip",
            "size": "~500MB"
        },
        {
            "name": "Plant Disease Recognition Dataset",
            "url": "https://data.mendeley.com/datasets/tywbtsjrjv/1/files/plant-village-dataset.zip",
            "size": "~800MB"
        }
    ]
    
    print("Available datasets:")
    for i, dataset in enumerate(datasets, 1):
        print(f"{i}. {dataset['name']} ({dataset['size']})")
    
    # For now, let's use a smaller, reliable dataset
    print("\nUsing Plant Disease Recognition dataset...")
    
    # Set up paths
    data_dir = os.path.join(os.path.dirname(__file__), "data")
    raw_dir = os.path.join(data_dir, "raw")
    
    os.makedirs(raw_dir, exist_ok=True)
    
    # Try downloading from multiple sources
    dataset_downloaded = False
    
    # Alternative 1: Use a smaller, curated dataset
    try:
        print("🔄 Downloading Plant Disease dataset...")
        
        # Download from alternative source - smaller but good quality dataset
        url = "https://github.com/spMohanty/PlantVillage-Dataset/archive/refs/heads/master.zip"
        zip_filename = os.path.join(raw_dir, "plant_disease_dataset.zip")
        
        download_file(url, zip_filename)
        
        # Extract dataset
        extract_path = os.path.join(raw_dir, "extracted")
        extract_dataset(zip_filename, extract_path)
        
        # Find the actual dataset folder
        extracted_folders = os.listdir(extract_path)
        dataset_folder = None
        
        for folder in extracted_folders:
            folder_path = os.path.join(extract_path, folder)
            if os.path.isdir(folder_path):
                # Look for images or subdirectories with images
                subfolders = os.listdir(folder_path)
                if any(f.endswith(('.jpg', '.jpeg', '.png')) or os.path.isdir(os.path.join(folder_path, f)) for f in subfolders):
                    dataset_folder = folder_path
                    break
        
        if dataset_folder:
            # Organize dataset
            classes, images = organize_dataset(dataset_folder, data_dir)
            
            # Clean up
            shutil.rmtree(raw_dir)
            print(f"✅ Dataset setup complete!")
            print(f"   Classes: {classes}")
            print(f"   Images: {images}")
            print(f"   Location: {data_dir}")
            
            dataset_downloaded = True
            
        else:
            print("⚠️ Could not find dataset in extracted files")
            
    except Exception as e:
        print(f"❌ Download failed: {e}")
    
    # Alternative 2: Create a curated mini dataset if download fails
    if not dataset_downloaded:
        print("⚠️ Download failed. Creating mini training dataset...")
        create_mini_dataset(data_dir)

def create_mini_dataset(data_dir):
    """Create a minimal dataset for testing if download fails"""
    print("Creating minimal training dataset...")
    
    # Common plant disease classes
    classes = [
        "Tomato_healthy",
        "Tomato_Early_blight", 
        "Tomato_Late_blight",
        "Potato_healthy",
        "Potato_Early_blight",
        "Apple_healthy",
        "Apple_Apple_scab",
        "Corn_healthy",
        "Corn_Northern_Leaf_Blight"
    ]
    
    # Create directory structure
    for split in ["train", "val"]:
        for class_name in classes:
            class_dir = os.path.join(data_dir, split, class_name)
            os.makedirs(class_dir, exist_ok=True)
    
    print("✅ Minimal dataset structure created")
    print("📝 To use this properly, please:")
    print("   1. Download real plant images for each class")
    print("   2. Place images in the appropriate directories")
    print("   3. Run the training script")

if __name__ == "__main__":
    main()
