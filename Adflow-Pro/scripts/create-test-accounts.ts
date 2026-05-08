/**
 * Script to create test accounts for AdFlow Pro
 * 
 * Usage:
 *   npx tsx scripts/create-test-accounts.ts
 * 
 * Or add to package.json:
 *   "seed:accounts": "tsx scripts/create-test-accounts.ts"
 * 
 * Requires:
 *   - NEXT_PUBLIC_SUPABASE_URL in .env.local
 *   - SUPABASE_SERVICE_ROLE_KEY in .env.local
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ Missing required environment variables:');
  console.error('   - NEXT_PUBLIC_SUPABASE_URL');
  console.error('   - SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

const testAccounts = [
  {
    email: 'client@test.com',
    password: 'TestPass123!',
    role: 'client',
    name: 'Test Client',
    description: 'Regular client user for testing ad creation and management',
  },
  {
    email: 'moderator@test.com',
    password: 'TestPass123!',
    role: 'moderator',
    name: 'Test Moderator',
    description: 'Moderator user for testing ad review and approval workflow',
  },
  {
    email: 'admin@test.com',
    password: 'TestPass123!',
    role: 'admin',
    name: 'Test Admin',
    description: 'Admin user for testing user management and payment verification',
  },
  {
    email: 'superadmin@test.com',
    password: 'TestPass123!',
    role: 'super_admin',
    name: 'Test Super Admin',
    description: 'Super admin user with full system access',
  },
];

async function createTestAccounts() {
  console.log('🚀 Creating test accounts for AdFlow Pro...\n');

  for (const account of testAccounts) {
    try {
      console.log(`📧 Creating ${account.email}...`);

      // Check if user already exists
      const { data: existingUser } = await supabase
        .from('users')
        .select('id, email')
        .eq('email', account.email)
        .maybeSingle();

      if (existingUser) {
        console.log(`   ⚠️  User already exists with ID: ${existingUser.id}`);
        console.log(`   ℹ️  ${account.description}\n`);
        continue;
      }

      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: account.email,
        password: account.password,
        email_confirm: true,
        user_metadata: {
          full_name: account.name,
          role: account.role,
        },
      });

      if (authError) {
        console.error(`   ❌ Failed to create auth user: ${authError.message}\n`);
        continue;
      }

      if (!authData.user) {
        console.error(`   ❌ No user data returned\n`);
        continue;
      }

      console.log(`   ✅ Auth user created with ID: ${authData.user.id}`);

      // Create profile entry
      const { error: profileError } = await supabase.from('profiles').upsert({
        id: authData.user.id,
        email: account.email,
        full_name: account.name,
        role: account.role,
        disabled: false,
      });

      if (profileError) {
        console.error(`   ⚠️  Profile creation warning: ${profileError.message}`);
      } else {
        console.log(`   ✅ Profile created`);
      }

      // Update users table (should be auto-created by trigger, but ensure it's correct)
      const { error: userError } = await supabase.from('users').upsert({
        id: authData.user.id,
        email: account.email,
        full_name: account.name,
        role: account.role,
      });

      if (userError) {
        console.error(`   ⚠️  User table warning: ${userError.message}`);
      } else {
        console.log(`   ✅ User record updated`);
      }

      console.log(`   ℹ️  ${account.description}`);
      console.log(`   🔑 Password: ${account.password}\n`);
    } catch (error) {
      console.error(`   ❌ Unexpected error: ${error}\n`);
    }
  }

  // Create test ads for moderation
  console.log('📝 Creating test ads for moderation workflow...\n');

  try {
    // Get client user ID
    const { data: clientUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', 'client@test.com')
      .single();

    if (!clientUser) {
      console.log('   ⚠️  Client user not found, skipping test ads creation\n');
      return;
    }

    // Get first category, city, and package
    const [{ data: category }, { data: city }, { data: pkg }] = await Promise.all([
      supabase.from('categories').select('id').limit(1).single(),
      supabase.from('cities').select('id').limit(1).single(),
      supabase.from('packages').select('id').eq('tier', 'basic').limit(1).single(),
    ]);

    if (!category || !city || !pkg) {
      console.log('   ⚠️  Missing category, city, or package data\n');
      return;
    }

    const testAds = [
      {
        slug: 'test-pending-ad-1',
        title: 'Test Pending Ad - Needs Review',
        description: 'This is a test ad in submitted status waiting for moderator review.',
        status: 'submitted',
        price: 99.99,
      },
      {
        slug: 'test-pending-ad-2',
        title: 'Another Pending Ad for Testing',
        description: 'This is another test ad that needs moderation approval.',
        status: 'submitted',
        price: 149.99,
      },
      {
        slug: 'test-under-review-ad',
        title: 'Ad Currently Under Review',
        description: 'This ad is being reviewed by a moderator.',
        status: 'under_review',
        price: 199.99,
      },
    ];

    for (const ad of testAds) {
      const { error } = await supabase.from('ads').upsert({
        ...ad,
        user_id: clientUser.id,
        package_id: pkg.id,
        category_id: category.id,
        city_id: city.id,
        contact_email: 'client@test.com',
      });

      if (error && !error.message.includes('duplicate')) {
        console.log(`   ⚠️  Failed to create ad "${ad.title}": ${error.message}`);
      } else {
        console.log(`   ✅ Created test ad: ${ad.title}`);
      }
    }
  } catch (error) {
    console.error(`   ❌ Error creating test ads: ${error}\n`);
  }

  console.log('\n✨ Test account creation complete!\n');
  console.log('📋 Summary:');
  console.log('   • Client Portal: http://localhost:3001/auth/login');
  console.log('   • Moderator Desk: http://localhost:3001/moderator/login');
  console.log('   • Admin Console: http://localhost:3001/admin/login');
  console.log('\n🔐 All accounts use password: TestPass123!\n');
}

createTestAccounts()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
