import pickle
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score

# Load data
with open('./data.pickle', 'rb') as f:
    data_dict = pickle.load(f)

data = data_dict['data']
labels = data_dict['labels']

# Standardize feature lengths to 42
standard_length = 42
data = [item[:standard_length] + [0] * (standard_length - len(item)) if len(item) < standard_length else item[:standard_length] for item in data]

# Convert lists to NumPy array
data = np.array(data, dtype=np.float32)
labels = np.array(labels, dtype=str)

# Split data into training and testing sets
x_train, x_test, y_train, y_test = train_test_split(data, labels, test_size=0.2, shuffle=True, stratify=labels)

# Initialize and train the RandomForestClassifier
model = RandomForestClassifier()
model.fit(x_train, y_train)

# Predict and evaluate the model
y_predict = model.predict(x_test)
score = accuracy_score(y_predict, y_test)

print(f'{score * 100:.2f}% of samples were classified correctly!')

# Save the trained model
with open('model.p', 'wb') as f:
    pickle.dump({'model': model}, f)
