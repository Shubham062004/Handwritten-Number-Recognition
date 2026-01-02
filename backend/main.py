from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import numpy as np
import io
import cv2
import tensorflow as tf

# FastAPI App Initialization
app = FastAPI(title="Handwritten Number Detection API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load CNN Model (once at startup)
model = tf.keras.models.load_model("cnn_model.h5")

# Health Check Endpoint
@app.get("/")
def home():
    return {"message": "Handwritten Number Detection API is running"}

# Upload & Predict Endpoint
@app.post("/upload")
async def upload_image(file: UploadFile = File(...)):
    # Read image bytes
    image_bytes = await file.read()

    # Open image and convert to grayscale
    image = Image.open(io.BytesIO(image_bytes)).convert("L")

    # Convert to NumPy array
    image_np = np.array(image)

    # Invert image (white digits on black background)
    image_np = 255 - image_np

    # Apply binary threshold
    _, thresh = cv2.threshold(
        image_np, 128, 255, cv2.THRESH_BINARY
    )

    # Find contours (each contour = one digit)
    contours, _ = cv2.findContours(
        thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE
    )

    # Sort contours from left to right
    contours = sorted(contours, key=lambda c: cv2.boundingRect(c)[0])

    predicted_digits = []

    # Process up to 3 digits only
    for cnt in contours[:3]:
        x, y, w, h = cv2.boundingRect(cnt)

        digit_img = thresh[y:y+h, x:x+w]

        # Resize to 28x28 (CNN input size)
        digit_img = cv2.resize(digit_img, (28, 28))

        # Normalize
        digit_img = digit_img / 255.0

        # Reshape for CNN
        digit_img = digit_img.reshape(1, 28, 28, 1)

        # Predict digit
        prediction = model.predict(digit_img)
        predicted_digit = int(np.argmax(prediction))

        predicted_digits.append(str(predicted_digit))

    final_number = int("".join(predicted_digits)) if predicted_digits else None

    return {
        "detected_digits": predicted_digits,
        "final_number": final_number,
        "message": "Multi-digit prediction successful"
    }
