import json
import sys
from collections import Counter
import re

def load_json_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        print(f"Error loading {filepath}: {e}")
        return None

def extract_review_texts(data, file_type):
    texts = []
    if file_type == "german":
        for tour_key, reviews in data.get("german_guest_reviews", {}).items():
            for review in reviews:
                if "review_text" in review:
                    texts.append(review["review_text"])
    elif file_type == "structured":  # French, Arabic structured format
        for review in data:
            if "content" in review:
                texts.append(review["content"])
    elif file_type == "spanish":  # Spanish nested structure
        for tour_key, reviews in data.items():
            for review in reviews:
                if "review" in review:
                    texts.append(review["review"])
    return texts

def find_duplicates(texts):
    # Exact duplicates
    text_counts = Counter(texts)
    exact_duplicates = [text for text, count in text_counts.items() if count > 1]
    
    # Similar duplicates (same first 50 characters)
    first_50_chars = [text[:50] for text in texts]
    similar_duplicates = []
    char_counts = Counter(first_50_chars)
    for chars, count in char_counts.items():
        if count > 1:
            matching_texts = [text for text in texts if text[:50] == chars]
            similar_duplicates.extend(matching_texts)
    
    return exact_duplicates, similar_duplicates

def validate_file(filepath, file_type):
    print(f"\n=== VALIDATING {filepath} ===")
    data = load_json_file(filepath)
    if not data:
        return False, []
    
    texts = extract_review_texts(data, file_type)
    print(f"Total reviews found: {len(texts)}")
    
    exact_duplicates, similar_duplicates = find_duplicates(texts)
    
    print(f"Exact duplicates found: {len(exact_duplicates)}")
    print(f"Similar duplicates found: {len(set(similar_duplicates))}")
    
    if exact_duplicates:
        print("\nEXACT DUPLICATES:")
        for dup in exact_duplicates:
            print(f"- {dup[:100]}...")
    
    if similar_duplicates and len(set(similar_duplicates)) > len(exact_duplicates):
        print("\nSIMILAR DUPLICATES (first 50 chars):")
        for dup in set(similar_duplicates):
            if dup not in exact_duplicates:
                print(f"- {dup[:100]}...")
    
    return len(exact_duplicates) == 0 and len(set(similar_duplicates)) <= len(exact_duplicates), texts

# Validate each file
files_to_check = [
    ("authentic-german-guest-reviews-fixed.json", "german"),
    ("authentic-french-guest-reviews-complete.json", "structured"),
    ("authentic-arabic-guest-reviews-complete.json", "structured"),
    ("authentic-spanish-guest-reviews-complete.json", "spanish")
]

all_texts = []
results = {}

for filepath, file_type in files_to_check:
    is_unique, texts = validate_file(filepath, file_type)
    results[filepath] = {
        "unique": is_unique,
        "count": len(texts),
        "texts": texts
    }
    all_texts.extend(texts)

# Check cross-file duplicates
print(f"\n=== CROSS-FILE DUPLICATE CHECK ===")
print(f"Total texts across all files: {len(all_texts)}")
cross_duplicates, _ = find_duplicates(all_texts)
print(f"Cross-file duplicates found: {len(cross_duplicates)}")

if cross_duplicates:
    print("\nCROSS-FILE DUPLICATES:")
    for dup in cross_duplicates:
        print(f"- {dup[:100]}...")

# Final summary
print(f"\n=== FINAL VALIDATION SUMMARY ===")
all_unique = True
for filepath, result in results.items():
    status = "✅ PASS" if result["unique"] else "❌ FAIL"
    print(f"{filepath}: {status} ({result['count']} reviews)")
    if not result["unique"]:
        all_unique = False

cross_file_status = "✅ PASS" if len(cross_duplicates) == 0 else "❌ FAIL"
print(f"Cross-file uniqueness: {cross_file_status}")

overall_status = "✅ ALL FILES PASS" if all_unique and len(cross_duplicates) == 0 else "❌ DUPLICATES FOUND"
print(f"\nOVERALL RESULT: {overall_status}")
