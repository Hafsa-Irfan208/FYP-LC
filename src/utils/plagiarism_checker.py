import json
import sys
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# Read input JSON from stdin
data = json.load(sys.stdin)
code_list = data.get("code_list", [])

# Check for at least two submissions
if len(code_list) < 2:
    print(json.dumps({"results": []}))
    sys.exit()

# Convert code list to TF-IDF vectors
vectorizer = TfidfVectorizer(token_pattern=r"(?u)\b\w+\b")
tfidf_matrix = vectorizer.fit_transform(code_list)

# Compute cosine similarity
similarity_matrix = cosine_similarity(tfidf_matrix)

# Build result pairs with scores
results = []
num_submissions = len(code_list)

for i in range(num_submissions):
    for j in range(i + 1, num_submissions):
        score = round(similarity_matrix[i][j] * 100, 2)
        results.append({
            "file1": f"Student_{i+1}",
            "file2": f"Student_{j+1}",
            "score": score
        })

# Return as JSON
print(json.dumps({"results": results}))
