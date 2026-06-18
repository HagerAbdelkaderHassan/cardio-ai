import pandas as pd
from sklearn.model_selection import StratifiedKFold, cross_val_score
from sklearn.linear_model import LogisticRegression

# قراءة الداتا المنظّفة
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

# نموذج لوجستيك ريجريشن
log_reg = LogisticRegression(
    max_iter=1000,
    class_weight="balanced",
    solver="liblinear",
)

# Stratified K-Fold Cross Validation (مثلاً 5-fold)
cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)

# نحسب الـaccuracy في كل fold
scores = cross_val_score(log_reg, X, y, cv=cv, scoring="accuracy")

print("CV accuracies:", scores)
print("Mean accuracy:", scores.mean())
print("Std accuracy:", scores.std())
