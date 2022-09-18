# Hack-The-North-2022
Project for Hack the North 2022; taking photos with lenses and extracting text with them using OCR. Includes a gallery UI component.

# Backend Setup
NOTE: this project only runs on **Windows** or **Linux**.

1. Download the **Adhawk Backend software** and get a set of the **Adhawk MindLink lenses**, if you haven't already.
2. In this directory, navigate to `backend` to setup a virtual environment and run it:

```
cd backend
python -m venv venv
.\venv\Scripts\activate
```

3. Download all the necessary packages required to start running the backend:

```
pip install -r camera_gaze/requirements.txt
```

4. Set an environment variable with the Google Cloud OCR:

```
$env:GOOGLE_APPLICATION_CREDENTIALS={path-to-OCR-JSON-file}
```

Note: replace "path-to-OCR-JSON-file" with the **global** path (e.g. `C:\Users\...`).

5. Run **Adhawk Backend** and make sure to plug-in the **MindLink lenses** into your computer.

5. Navigate into `camera_gaze` and run `camera_gaze_example.py`:

```
cd camera_gaze
python camera_gaze_example.py
```

# Frontend Setup
1. In the main directory, navigate to `frontend` and download all necessary packages:

```
cd frontend
npm i
```

2. Run the app by typing:

```
npm start
```

You can find the app at [http://localhost:3000](http://localhost:3000).