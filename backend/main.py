from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import numpy as np
import io
import cv2
import tensorflow as tf

app = FastAPI(title="Handwritten Number Detection API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)
model = tf.keras.models.load_model("cnn_model.keras")

@app.get("/")
def home():
    return {"message": "API is running"}

@app.post("/upload")
async def upload_image(file: UploadFile = File(...)):
    image_bytes = await file.read()
    image = Image.open(io.BytesIO(image_bytes)).convert("L")
    image_np = np.array(image)

    # NOTE: No need to invert colors because the frontend sends white digits on a black background

    # Threshold to ensure pure black and white and remove anti-aliasing artifacts
    _, thresh = cv2.threshold(image_np, 50, 255, cv2.THRESH_BINARY)

    # Find contours
    contours, _ = cv2.findContours(
        thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE
    )

    # Filter out noise (very small contours)
    contours = [c for c in contours if cv2.contourArea(c) > 50]

    # Sort contours from left to right based on their x-coordinate
    contours = sorted(contours, key=lambda c: cv2.boundingRect(c)[0])

    predicted_digits = []

    for cnt in contours:
        x, y, w, h = cv2.boundingRect(cnt)
        digit = thresh[y:y+h, x:x+w]

        # Make the digit a square by padding the smaller dimension
        if w > h:
            diff = w - h
            top = diff // 2
            bottom = diff - top
            left = 0
            right = 0
        else:
            diff = h - w
            top = 0
            bottom = 0
            left = diff // 2
            right = diff - left
            
        digit = cv2.copyMakeBorder(
            digit, top, bottom, left, right, cv2.BORDER_CONSTANT, value=0
        )

        # Add proportional padding (MNIST digits are center-padded and about 20x20 in a 28x28 grid)
        # This translates to roughly ~20% padding around the bounding box
        padding = max(int(0.20 * digit.shape[0]), 4)
        digit = cv2.copyMakeBorder(
            digit, padding, padding, padding, padding, cv2.BORDER_CONSTANT, value=0
        )

        # Resize to exactly 28x28 smoothly
        resized = cv2.resize(digit, (28, 28), interpolation=cv2.INTER_AREA)

        # Normalize to 0-1 range
        resized = resized / 255.0
        resized = resized.reshape(1, 28, 28, 1)

        # Predict the digit using the loaded model
        prediction = model.predict(resized, verbose=0)
        predicted_digit = int(np.argmax(prediction))

        predicted_digits.append(str(predicted_digit))

    final_number = int("".join(predicted_digits)) if predicted_digits else None

    return {
        "detected_digits": predicted_digits,
        "final_number": final_number
    }