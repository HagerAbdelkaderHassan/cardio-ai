import streamlit as st
import pandas as pd
import joblib
from datetime import datetime

MODEL_PATH = 'cardiac_rf_model.pkl'
RESULTS_CSV = 'predictions_log.csv'

# تحميل الموديل المتدرّب
model = joblib.load(MODEL_PATH)

FEATURES = [
    'blood_pressure_systolic',
    'blood_pressure_diastolic',
    'heart_rate',
    'temperature',
    'respiratory_rate',
    'oxygen_saturation',
    'bmi'
]

st.title("AI Cardiac Monitoring - Alert Prediction")

st.sidebar.header("Patient Vitals Input")

# إدخالات الواجهة
bp_sys = st.sidebar.number_input("Systolic BP", 60, 250, 120)
bp_dia = st.sidebar.number_input("Diastolic BP", 30, 150, 80)
hr     = st.sidebar.number_input("Heart Rate", 30, 220, 75)
temp   = st.sidebar.number_input("Temperature (°C)", 34.0, 42.0, 37.0, step=0.1)
rr     = st.sidebar.number_input("Respiratory Rate", 5, 60, 16)
spo2   = st.sidebar.number_input("Oxygen Saturation (%)", 60.0, 100.0, 98.0, step=0.1)
bmi    = st.sidebar.number_input("BMI", 10.0, 60.0, 25.0, step=0.1)

if st.sidebar.button("Predict Alert"):
    # تجهيز الداتا للـmodel
    data = pd.DataFrame([{
        'blood_pressure_systolic': bp_sys,
        'blood_pressure_diastolic': bp_dia,
        'heart_rate': hr,
        'temperature': temp,
        'respiratory_rate': rr,
        'oxygen_saturation': spo2,
        'bmi': bmi
    }])

    proba = model.predict_proba(data)[0, 1]
    pred  = int(model.predict(data)[0])

    st.subheader("Prediction Result")
    st.write(f"Predicted **alert_flag**: {pred}")
    st.write(f"Risk probability: {proba:.2f}")

    # لون بسيط حسب الخطر
    if proba >= 0.8:
        st.error("High Risk – Physician should be alerted.")
    elif proba >= 0.5:
        st.warning("Moderate Risk – Close monitoring recommended.")
    else:
        st.success("Low Risk – Vitals within acceptable range.")

    # حفظ النتيجة في CSV (logging)
    log_row = data.copy()
    log_row['alert_pred'] = pred
    log_row['alert_proba'] = proba
    log_row['timestamp'] = datetime.now().isoformat(timespec='seconds')

    try:
        # لو الملف موجود، نضيف عليه
        existing = pd.read_csv(RESULTS_CSV)
        updated = pd.concat([existing, log_row], ignore_index=True)
    except FileNotFoundError:
        # أول مرة: نكتب ملف جديد
        updated = log_row

    updated.to_csv(RESULTS_CSV, index=False)

    st.info(f"Prediction saved to {RESULTS_CSV}")

# ===== جدول آخر التنبؤات =====
st.subheader("Recent Predictions Log")

try:
    log_df = pd.read_csv(RESULTS_CSV)
    st.dataframe(log_df.tail(10))  # آخر 10 records
except FileNotFoundError:
    st.write("No predictions logged yet.")

# ===== جراف الاحتمالات مع الزمن =====
st.subheader("Alert Probability Over Time")

try:
    log_df = pd.read_csv(RESULTS_CSV)

    if 'alert_proba' in log_df.columns and not log_df.empty:
        log_df['timestamp'] = pd.to_datetime(log_df['timestamp'])
        log_df = log_df.sort_values('timestamp')

        chart_df = log_df[['timestamp', 'alert_proba']].set_index('timestamp')
        st.line_chart(chart_df)
    else:
        st.write("No probability data available yet.")
except FileNotFoundError:
    st.write("No predictions logged yet.")
