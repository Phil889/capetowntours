import requests
import json

# Test API save
url = "http://localhost:3000/api/admin/tours/crud?id=d312ffbf-33b8-4576-9d83-d31ddec4dc26"
headers = {"Content-Type": "application/json"}
data = {
    "title": "Tokara Wine Estate",
    "category": "safari",
    "slug": "tokara-wine-estate",
    "description": "Elevate your palate with comparative tastings of cool-climate wines and premium extra-virgin olive oil amid architect-designed surrounds.",
}

print("Testing API save...")
print(f"URL: {url}")
print(f"Data: {json.dumps(data, indent=2)}")

try:
    response = requests.put(url, headers=headers, json=data)
    print(f"\nStatus Code: {response.status_code}")
    print(f"Response: {response.text}")
    
    if response.status_code == 200:
        print("\n✅ Save successful!")
    else:
        print(f"\n❌ Save failed with status {response.status_code}")
        print(f"Error: {response.text}")
except Exception as e:
    print(f"\n❌ Request failed: {str(e)}")
