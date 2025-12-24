import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report
import joblib  # لو لسه مش متسطب: pip install joblib

CLEAN_FILE = 'cleaned_vitals.csv'

# ===== 1. قراءة الداتا المنظّفة =====
df = pd.read_csv(CLEAN_FILE)

# ===== 2. اختيار الـ features والـ target =====
FEATURES = [
    'blood_pressure_systolic',
    'blood_pressure_diastolic',
    'heart_rate',
    'temperature',
    'respiratory_rate',
    'oxygen_saturation',
    'bmi'
]

X = df[FEATURES]
y = df['alert_flag'].astype(int)

# ===== 3. Train / Test Split =====
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

# ===== 4. إنشاء وتدريب الموديل (هنا أهم حاجة علشان NotFittedError) =====
model = RandomForestClassifier(
    n_estimators=300,
    class_weight='balanced',
    random_state=42
)

model.fit(X_train, y_train)   # << لازم يحصل قبل أي predict أو predict_proba

# ===== 5. تقييم على test set =====
y_pred = model.predict(X_test)
y_proba = model.predict_proba(X_test)  # دلوقتي مش هيطلع NotFittedError

print('=== Classification Report ===')
print(classification_report(y_test, y_pred))
print('First 5 predicted probabilities (for class 1):')
print(y_proba[:5, 1])

# ===== 6. مثال: prediction لحالة جديدة (أول صف من الـtest) =====
sample = X_test.iloc[[0]]  # DataFrame فيه صف واحد
sample_proba = model.predict_proba(sample)[0, 1]
sample_pred = model.predict(sample)[0]

print('\nExample patient prediction:')
print('Features:', sample.to_dict(orient='records')[0])
print('Predicted class (alert_flag):', int(sample_pred))
print('Predicted risk probability of alert:', float(sample_proba))

# ===== 7. حفظ الموديل لاستخدامه في أي سكربت تاني أو Web App =====
joblib.dump(model, 'cardiac_rf_model.pkl')
print('\nModel saved to cardiac_rf_model.pkl')
