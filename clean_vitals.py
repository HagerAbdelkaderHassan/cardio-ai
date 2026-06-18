 

df = pd.read_csv('vital-signs-and-flowsheet-data (1).csv')
print(df.head())
print(df.info())
import pandas as pd

df = pd.read_csv('vital-signs-and-flowsheet-data (1).csv')

# 1) تحويل وقت القياس لتاريخ
df['measurement_datetime'] = pd.to_datetime(df['measurement_datetime'])

# 2) إزالة صفوف ناقصة في الفيتال المهمة
df = df.dropna(subset=['blood_pressure_systolic',
                       'blood_pressure_diastolic',
                       'heart_rate',
                       'oxygen_saturation'])

# 3) فلترة الـ outliers (قيم غير منطقية)
df = df[df['blood_pressure_systolic'].between(60, 250)]
df = df[df['heart_rate'].between(30, 220)]
df = df[df['temperature'].between(34, 42)]

# 4) حذف صفوف الـ test/outlier من الـ notes
df = df[~df['notes'].str.contains('test row|outlier|bounding',
                                  case=False, na=False)]

# 5) حفظ نسخة نظيفة
df.to_csv('cleaned_vitals.csv', index=False)

print(df.head())
print(df.shape)
