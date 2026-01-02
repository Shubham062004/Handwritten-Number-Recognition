from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import numpy as np
import io
import tensorflow as tf

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load CNN model once (VERY IMPORTANT)
model = tf.keras.models.load_model("cnn_model.h5")

@app.get("/")
def home():
    return {"message": "FastAPI is working"}

@app.post("/upload")
async def upload_image(file: UploadFile = File(...)):
    # Read image
    image_bytes = await file.read()
    image = Image.open(io.BytesIO(image_bytes)).convert("L")

    # Resize to 28x28
    image = image.resize((28, 28))

    # Convert to numpy
    image_array = np.array(image)

    # Normalize
    image_array = image_array / 255.0

    # Reshape for CNN
    image_array = image_array.reshape(1, 28, 28, 1)

    # Predict digit
    prediction = model.predict(image_array)
    predicted_digit = int(np.argmax(prediction))

    return {
        "predicted_digit": predicted_digit,
        "message": "Prediction successful"
    }
