import os
import json
from typing import Tuple

from PIL import Image
from torch.utils.data import DataLoader
import torch
import torch.nn as nn
import torch.optim as optim
import torchvision.models as models
import torchvision.transforms as T
import torchvision.datasets as datasets

DATA_DIR = os.path.join(os.path.dirname(__file__), "data")
OUT_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "models")
MODEL_PATH = os.path.join(OUT_DIR, "disease_model.pt")
CLASSES_PATH = os.path.join(OUT_DIR, "disease_classes.json")

# Transforms
train_tfms = T.Compose([
    T.Resize((224, 224)),
    T.RandomHorizontalFlip(),
    T.RandomRotation(10),
    T.ColorJitter(brightness=0.1, contrast=0.1, saturation=0.1),
    T.ToTensor(),
    T.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
])

val_tfms = T.Compose([
    T.Resize((224, 224)),
    T.ToTensor(),
    T.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
])

def get_dataloaders(batch_size: int = 8) -> Tuple[DataLoader, DataLoader, int, list]:  # Reduced batch size
    train_dir = os.path.join(DATA_DIR, "train")
    val_dir = os.path.join(DATA_DIR, "val")

    print(f"Looking for dataset in:")
    print(f"  Train: {train_dir}")
    print(f"  Val: {val_dir}")

    if not (os.path.isdir(train_dir) and os.path.isdir(val_dir)):
        raise SystemExit(
            f"Dataset not found. Please run setup_dataset.py first!\n"
            f"Expected structure:\n"
            f"data/\n  train/\n    Tomato_healthy/\n    Tomato_Early_blight/\n  val/\n    Tomato_healthy/\n    ..."
        )
    
    # Check if we have any images
    train_classes = [d for d in os.listdir(train_dir) if os.path.isdir(os.path.join(train_dir, d))]
    if not train_classes:
        raise SystemExit("No class directories found in train folder!")
    
    print(f"Found {len(train_classes)} classes: {train_classes[:5]}...")

    train_ds = datasets.ImageFolder(train_dir, transform=train_tfms)
    val_ds = datasets.ImageFolder(val_dir, transform=val_tfms)

    train_loader = DataLoader(train_ds, batch_size=batch_size, shuffle=True, num_workers=0)
    val_loader = DataLoader(val_ds, batch_size=batch_size, shuffle=False, num_workers=0)

    return train_loader, val_loader, len(train_ds.classes), train_ds.classes

def build_model(num_classes: int) -> nn.Module:
    model = models.mobilenet_v3_small(weights=models.MobileNet_V3_Small_Weights.DEFAULT)
    model.classifier[3] = nn.Linear(model.classifier[3].in_features, num_classes)
    return model

@torch.no_grad()
def evaluate(model: nn.Module, loader: DataLoader, device: torch.device) -> float:
    model.eval()
    correct, total = 0, 0
    for x, y in loader:
        x, y = x.to(device), y.to(device)
        logits = model(x)
        preds = logits.argmax(dim=1)
        correct += (preds == y).sum().item()
        total += y.size(0)
    return correct / max(total, 1)


def main():
    os.makedirs(OUT_DIR, exist_ok=True)

    train_loader, val_loader, num_classes, classes = get_dataloaders()
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

    model = build_model(num_classes).to(device)
    criterion = nn.CrossEntropyLoss()
    optimizer = optim.Adam(model.parameters(), lr=1e-3)

    best_acc = 0.0
    epochs = 10  # More epochs for better training
    print(f"Starting training for {epochs} epochs...")
    
    for epoch in range(1, epochs + 1):
        model.train()
        running = 0.0
        for i, (x, y) in enumerate(train_loader, 1):
            x, y = x.to(device), y.to(device)
            optimizer.zero_grad()
            logits = model(x)
            loss = criterion(logits, y)
            loss.backward()
            optimizer.step()
            running += loss.item()
            if i % 10 == 0:
                print(f"Epoch {epoch} Iter {i}: loss={running/10:.4f}")
                running = 0.0

        acc = evaluate(model, val_loader, device)
        print(f"Epoch {epoch}: val_acc={acc:.4f}")
        if acc > best_acc:
            best_acc = acc
            # Save TorchScript for easier inference
            model.eval()
            example = torch.randn(1, 3, 224, 224).to(device)
            traced = torch.jit.trace(model, example)
            traced.save(MODEL_PATH)
            with open(CLASSES_PATH, "w", encoding="utf-8") as f:
                json.dump(classes, f)
            print(f"Saved model to {MODEL_PATH} and classes to {CLASSES_PATH}")

    print("Training complete. Best val acc:", best_acc)

if __name__ == "__main__":
    main()

