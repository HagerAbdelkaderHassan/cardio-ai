import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, accuracy_score
import joblib

# 1) قراءة الداتا المنظّفة
df = pd.read_csv("cleaned_vitals.csv")

features = [
    "blood_pressure_systolic",
    "blood_pressure_diastolic",
    "heart_rate",
    "temperature",
    "respiratory_rate",
    "oxygen_saturation",
    "bmi",
]
X = df[features]
y = df["alert_flag"].astype(int)

# 2) Train / test split
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

# 3) نموذج RandomForest
model = RandomForestClassifier(
    n_estimators=300,
    class_weight="balanced",
    random_state=42,
)

model.fit(X_train, y_train)

# 4) تقييم الأداء
y_pred = model.predict(X_test)
acc = accuracy_score(y_test, y_pred)
print("Accuracy:", acc)
print(classification_report(y_test, y_pred))

# 5) حفظ الموديل
joblib.dump(model, "cardiac_rf_model.pkl")
print("Model saved to cardiac_rf_model.pkl")
