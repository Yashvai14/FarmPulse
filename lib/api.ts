// lib/api.ts
export async function getCropSuggestion(data: any) {
  const res = await fetch("http://localhost:8000/predict-crop", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function detectDisease(files: File[]) {
  const formData = new FormData();
  files.forEach(file => formData.append("files", file));

  const res = await fetch("http://localhost:8000/predict-disease", {
    method: "POST",
    body: formData,
  });
  return res.json();
}
