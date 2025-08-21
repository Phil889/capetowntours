#!/usr/bin/env python3
"""
Create an admin user in Supabase for accessing the admin panel.
"""

import os
from supabase import create_client, Client
from dotenv import load_dotenv
import sys

# Load environment variables
load_dotenv('.env.local')

# Get Supabase credentials
SUPABASE_URL = os.getenv('NEXT_PUBLIC_SUPABASE_URL')
SUPABASE_SERVICE_KEY = os.getenv('SUPABASE_SERVICE_ROLE_KEY')

if not SUPABASE_URL or not SUPABASE_SERVICE_KEY:
    print("❌ Error: Missing Supabase credentials in .env.local")
    print("Please ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set")
    exit(1)

# Initialize Supabase client with service role key
supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)

def create_admin_user(email: str, password: str):
    """Create an admin user with the specified email and password."""
    try:
        # Create user using Supabase Auth Admin API
        response = supabase.auth.admin.create_user({
            "email": email,
            "password": password,
            "email_confirm": True,  # Auto-confirm the email
            "user_metadata": {
                "role": "admin",
                "full_name": "Admin User"
            }
        })
        
        if response.user:
            print(f"✅ Admin user created successfully!")
            print(f"   Email: {email}")
            print(f"   User ID: {response.user.id}")
            print(f"   Role: admin")
            return True
        else:
            print(f"❌ Failed to create user")
            return False
            
    except Exception as e:
        # Check if user already exists
        if "already registered" in str(e).lower() or "duplicate" in str(e).lower():
            print(f"⚠️  User with email {email} already exists")
            print("   Attempting to update user role to admin...")
            
            # Try to get the existing user and update their role
            try:
                # List users to find the existing user
                users = supabase.auth.admin.list_users()
                for user in users:
                    if user.email == email:
                        # Update user metadata to include admin role
                        update_response = supabase.auth.admin.update_user_by_id(
                            user.id,
                            {"user_metadata": {"role": "admin", "full_name": "Admin User"}}
                        )
                        print(f"✅ User role updated to admin successfully!")
                        return True
                        
                print(f"❌ Could not find user with email {email}")
                return False
                
            except Exception as update_error:
                print(f"❌ Error updating user: {str(update_error)}")
                return False
        else:
            print(f"❌ Error creating user: {str(e)}")
            return False

def main():
    print("=" * 60)
    print("Create Admin User for Cape Town Safari Tours")
    print("=" * 60)
    print()
    
    # Default admin credentials
    default_email = "philiphansenonline@gmail.com"
    default_password = "admin123456"  # You should change this!
    
    print(f"Creating admin user with:")
    print(f"Email: {default_email}")
    print(f"Password: {default_password}")
    print()
    
    # Ask for confirmation
    confirm = input("Do you want to create this admin user? (y/n): ").lower()
    
    if confirm == 'y':
        success = create_admin_user(default_email, default_password)
        
        if success:
            print()
            print("=" * 60)
            print("🎉 Admin user created successfully!")
            print("=" * 60)
            print()
            print("You can now log in to the admin panel with:")
            print(f"📧 Email: {default_email}")
            print(f"🔐 Password: {default_password}")
            print()
            print("⚠️  IMPORTANT: Please change your password after first login!")
        else:
            print()
            print("Failed to create admin user. Please check the error messages above.")
    else:
        print("Admin user creation cancelled.")

if __name__ == "__main__":
    main()
