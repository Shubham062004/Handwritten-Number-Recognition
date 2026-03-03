# Handwritten Number Recognition ✍️🔢

A full-stack machine learning web application that allows users to draw numbers on a canvas and instantly get predictions using a custom-trained Convolutional Neural Network (CNN).

## ✨ Features
- **Interactive Canvas**: Draw digits smoothly using mouse or touch gestures.
- **Responsive Design**: fully functional on both desktop and mobile devices.
- **Modern UI**: Dark-themed glassmorphic interface.
- **Real-time Prediction**: Deep learning model instantly recognizes the drawn number.
- **Custom Image Processing Pipeline**: The backend dynamically resizes, pads, and normalizes user drawings to accurately match the original MNIST training data format.

## 🛠️ Tech Stack
- **Frontend**: React, Vite, Canvas API, CSS (Glassmorphism design)
- **Backend**: FastAPI, OpenCV, Pillow, Uvicorn 
- **Machine Learning**: TensorFlow / Keras (CNN model trained on the MNIST dataset with data augmentation)

## 🚀 Installation & Setup

### 1. Clone the repository
```bash
git clone https://github.com/Shubham062004/Handwritten-Number-Recognition.git
cd Handwritten-Number-Recognition
```

### 2. Backend Setup
Make sure you have Python installed.

```bash
cd backend
# Create a virtual environment (optional but recommended)
python -m venv venv
venv\Scripts\activate   # On Windows
# source venv/bin/activate  # On Mac/Linux

# Install dependencies
pip install -r ../requirements.txt

# Run the FastAPI server
python -m uvicorn main:app --reload
```
*The backend will be running at `http://localhost:8000`*

### 3. Frontend Setup
Open a new terminal window.

```bash
cd frontend

# Install Node modules
npm install

# Start the development server
npm run dev
```
*The frontend will be running at `http://localhost:5173`*

## 🧠 How the Model Works
1. **Frontend**: The user draws a digit on a 400x200px black canvas using a white stroke.
2. **Transfer**: The canvas is converted to a base64 PNG and sent to the FastAPI backend.
3. **Computer Vision (OpenCV)**:
   - The image is thresholded to remove anti-aliasing artifacts.
   - Contours are generated to find the exact bounding box of the drawn digit.
   - The bounding box is padded into a perfect square.
   - Additional proportional padding (~20%) is added to match the MNIST dataset's formatting.
   - The image is smoothly resized to 28x28 pixels and normalized.
4. **Prediction**: The TensorFlow CNN (`cnn_model.keras`) predicts the digit (0-9).

## 📝 Training the Model
If you want to re-train the model yourself, you can run the Jupyter Notebook provided in the root directory:
```bash
jupyter notebook train_cnn_handwritten_digits.ipynb
```
The notebook uses the MNIST dataset with `ImageDataGenerator` for data augmentation (rotation, shift, zoom, shear) to ensure robust predictions against imperfect user drawings.