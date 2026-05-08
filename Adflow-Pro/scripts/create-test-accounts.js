/**
 * Script to create test accounts for AdFlow Pro
 * Run this with: node scripts/create-test-accounts.js
 * 
 * Make sure dev server is running on localhost:3001
 */

// For Node.js < 18, we need to use node-fetch or https
const https = require('https');
const http = require('http');

const testAccounts = [
  {
    full_name: 'Test Client',
    email: 'client@adflow.test',
    password: 'Client123!',
    role: 'client'
  },
  {
    full_name: 'Test Moderator',
    email: 'moderator@adflow.test',
    password: 'Moderator123!',
    role: 'moderator'
  },
  {
    full_name: 'Test Admin',
    email: 'admin@adflow.test',
    password: 'Admin123!',
    role: 'admin'
  },
  {
    full_name: 'Test Super Admin',
    email: 'superadmin@adflow.test',
    password: 'SuperAdmin123!',
    role: 'super_admin'
  }
];

async function createAccount(account) {
  return new Promise((resolve) => {
    const postData = JSON.stringify({
      full_name: account.full_name,
      email: account.email,
      password: account.password,
    });

    const options = {
      hostname: 'localhost',
      port: 3001,
      path: '/api/auth/register',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
      },
    };

    const req = http.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          if (res.statusCode === 201 || res.statusCode === 200) {
            console.log(`✓ Created: ${account.email} (${account.role})`);
            resolve({ success: true, email: account.email, role: account.role });
          } else {
            console.log(`✗ Failed: ${account.email} - ${response.error || 'Unknown error'}`);
            resolve({ success: false, email: account.email, error: response.error });
          }
        } catch (error) {
          console.log(`✗ Parse error: ${account.email} - ${error.message}`);
          resolve({ success: false, email: account.email, error: error.message });
        }
      });
    });

    req.on('error', (error) => {
      console.log(`✗ Request error: ${account.email} - ${error.message}`);
      resolve({ success: false, email: account.email, error: error.message });
    });

    req.write(postData);
    req.end();
  });
}

async function main() {
  console.log('🚀 Creating test accounts...\n');
  
  // Wait a bit between requests to avoid rate limiting
  const results = [];
  for (const account of testAccounts) {
    const result = await createAccount(account);
    results.push(result);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
  }

  console.log('\n📊 Summary:');
  console.log(`✓ Success: ${results.filter(r => r.success).length}`);
  console.log(`✗ Failed: ${results.filter(r => !r.success).length}`);

  const successful = results.filter(r => r.success);
  if (successful.length > 0) {
    console.log('\n📝 Next Steps:');
    console.log('Run this SQL in Supabase to update roles:\n');
    
    successful.forEach(account => {
      if (account.role !== 'client') {
        console.log(`UPDATE public.users SET role = '${account.role}' WHERE email = '${account.email}';`);
      }
    });
  }
}

main().catch(console.error);
