import firebase_admin
from firebase_admin import credentials
from firebase_admin import db

def store(img):
    cred = credentials.Certificate("firebase.json")
    firebase_admin.initialize_app(cred)
    ref = db.reference('images')
    ref.push(img)