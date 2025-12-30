import joblib
import pandas as pd

MODEL_PATH = "cardiac_rf_model.pkl"

# تحميل الموديل المتدرّب
model = joblib.load(MODEL_PATH)

# مثال لقراءة من مريض واحد
sample = {
    "blood_pressure_systolic": 130,
    "blood_pressure_diastolic": 80,
    "heart_rate": 75,
    "temperature": 37.2,
    "respiratory_rate": 16,
    "oxygen_saturation": 98.0,
    "bmi": 25.0,
}

X = pd.DataFrame([sample])

# تنبؤ الكلاس والـprobability
pred = int(model.predict(X)[0])
proba = float(model.predict_proba(X)[0, 1])

print("Predicted alert_flag:", pred)
print("Alert risk probability:", proba)
