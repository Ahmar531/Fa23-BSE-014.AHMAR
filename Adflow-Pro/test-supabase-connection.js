// Test Supabase Connection
require('dotenv').config({ path: '.env.local' });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('🔍 Testing Supabase Configuration...\n');
console.log('URL:', url);
console.log('Key (first 20 chars):', key?.substring(0, 20) + '...');
console.log('\n📝 Key Format Check:');

if (!url || !key) {
  console.log('❌ Missing credentials!');
  process.exit(1);
}

if (key.startsWith('eyJ')) {
  console.log('✅ Key format looks correct (JWT token)');
} else if (key.startsWith('sb_publishable_')) {
  console.log('⚠️  Key format is sb_publishable_ - this might not be a valid Supabase key');
  console.log('   Real Supabase keys start with "eyJ" (JWT format)');
} else {
  console.log('❌ Key format is invalid');
}

console.log('\n🔑 To get your REAL Supabase keys:');
console.log('1. Go to: https://supabase.com/dashboard');
console.log('2. Select your project');
console.log('3. Go to Settings → API');
console.log('4. Copy:');
console.log('   - Project URL → NEXT_PUBLIC_SUPABASE_URL');
console.log('   - anon/public key (starts with eyJ) → NEXT_PUBLIC_SUPABASE_ANON_KEY');
console.log('   - service_role key (starts with eyJ) → SUPABASE_SERVICE_ROLE_KEY');
