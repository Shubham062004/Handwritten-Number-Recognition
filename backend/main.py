from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import numpy as np
import io

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "FastAPI is working"}

@app.post("/upload")
async def upload_image(file: UploadFile = File(...)):
    # Read image bytes
    image_bytes = await file.read()

    # Convert bytes to PIL Image
    image = Image.open(io.BytesIO(image_bytes)).convert("L")

    # Convert image to numpy array
    image_array = np.array(image)

    return {
        "filename": file.filename,
        "image_shape": image_array.shape,
        "message": "Image processed successfully"
    }
