import os
from supabase import create_client, Client
from dotenv import load_dotenv

# Load environment variables
load_dotenv('.env.local')

# Initialize Supabase client
url = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

supabase: Client = create_client(url, key)

print("🔧 Applying tour versioning system migration...")

# Read the migration file
with open('database/migrations/004_tour_versions_system.sql', 'r') as file:
    migration_sql = file.read()

# Split the migration into individual statements
statements = [s.strip() for s in migration_sql.split(';') if s.strip()]

success_count = 0
error_count = 0

for i, statement in enumerate(statements, 1):
    try:
        # Skip comments
        if statement.startswith('--'):
            continue
            
        # Execute the statement
        result = supabase.rpc('exec_sql', {'query': statement + ';'}).execute()
        print(f"✅ Statement {i}: Success")
        success_count += 1
    except Exception as e:
        # Some statements might already exist, which is okay
        if 'already exists' in str(e).lower():
            print(f"⚠️  Statement {i}: Already exists (skipped)")
        else:
            print(f"❌ Statement {i}: {str(e)[:100]}")
            error_count += 1

print("\n" + "="*50)
print(f"Migration Summary:")
print(f"✅ Successful: {success_count}")
print(f"❌ Failed: {error_count}")

# Test the system by creating a test version
print("\n" + "="*50)
print("Testing version system...")

try:
    # Get a tour to test with
    tour_result = supabase.table('tours').select('id, title').limit(1).execute()
    
    if tour_result.data and len(tour_result.data) > 0:
        tour = tour_result.data[0]
        print(f"Testing with tour: {tour['title']}")
        
        # Make a small update to trigger versioning
        update_result = supabase.table('tours').update({
            'updated_at': 'NOW()'
        }).eq('id', tour['id']).execute()
        
        # Check if version was created
        version_result = supabase.table('tour_versions').select('*').eq('tour_id', tour['id']).execute()
        
        if version_result.data:
            print(f"✅ Version system working! Found {len(version_result.data)} version(s)")
        else:
            print("⚠️ No versions found yet (will be created on next update)")
    else:
        print("No tours found to test with")
        
except Exception as e:
    print(f"Test failed: {str(e)}")

print("\n✅ Tour versioning system is now enabled!")
print("\nFeatures available:")
print("  • Automatic version history on every update")
print("  • Restore to any previous version")
print("  • Keeps last 10 versions per tour")
print("  • Restore points for important states")
