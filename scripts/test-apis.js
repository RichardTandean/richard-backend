#!/usr/bin/env node

const axios = require('axios');

const BASE_URL = 'http://localhost:3000';
let accessToken = '';
let refreshToken = '';
let userId = '';

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function makeRequest(method, endpoint, data = null, headers = {}) {
  try {
    const config = {
      method,
      url: `${BASE_URL}${endpoint}`,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    };
    
    if (data) {
      config.data = data;
    }
    
    const response = await axios(config);
    return { success: true, data: response.data, status: response.status };
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data || error.message,
      status: error.response?.status || 500
    };
  }
}

async function testHealthCheck() {
  log('\n🏥 Testing Health Check...', 'blue');
  const result = await makeRequest('GET', '/health');
  
  if (result.success) {
    log('✅ Health check passed', 'green');
    return true;
  } else {
    log('❌ Health check failed', 'red');
    return false;
  }
}

async function testUserRegistration() {
  log('\n👤 Testing User Registration...', 'blue');
  
  const userData = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123',
    role: 'user'
  };
  
  const result = await makeRequest('POST', '/api/auth/register', userData);
  
  if (result.success) {
    log('✅ User registration successful', 'green');
    accessToken = result.data.data.accessToken;
    refreshToken = result.data.data.refreshToken;
    userId = result.data.data.user.id;
    log(`   User ID: ${userId}`, 'yellow');
    return true;
  } else {
    log('❌ User registration failed', 'red');
    log(`   Error: ${JSON.stringify(result.error)}`, 'red');
    return false;
  }
}

async function testAdminRegistration() {
  log('\n👑 Testing Admin Registration...', 'blue');
  
  const adminData = {
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'password123',
    role: 'admin'
  };
  
  const result = await makeRequest('POST', '/api/auth/register', adminData);
  
  if (result.success) {
    log('✅ Admin registration successful', 'green');
    return true;
  } else {
    log('❌ Admin registration failed', 'red');
    log(`   Error: ${JSON.stringify(result.error)}`, 'red');
    return false;
  }
}

async function testLogin() {
  log('\n🔐 Testing Login...', 'blue');
  
  const loginData = {
    email: 'test@example.com',
    password: 'password123'
  };
  
  const result = await makeRequest('POST', '/api/auth/login', loginData);
  
  if (result.success) {
    log('✅ Login successful', 'green');
    accessToken = result.data.data.accessToken;
    refreshToken = result.data.data.refreshToken;
    return true;
  } else {
    log('❌ Login failed', 'red');
    log(`   Error: ${JSON.stringify(result.error)}`, 'red');
    return false;
  }
}

async function testGetCurrentUser() {
  log('\n👤 Testing Get Current User...', 'blue');
  
  const result = await makeRequest('GET', '/api/users/me', null, {
    'Authorization': `Bearer ${accessToken}`
  });
  
  if (result.success) {
    log('✅ Get current user successful', 'green');
    log(`   User: ${result.data.data.name} (${result.data.data.email})`, 'yellow');
    return true;
  } else {
    log('❌ Get current user failed', 'red');
    log(`   Error: ${JSON.stringify(result.error)}`, 'red');
    return false;
  }
}

async function testUpdateProfile() {
  log('\n✏️ Testing Update Profile...', 'blue');
  
  const updateData = {
    name: 'Updated Test User'
  };
  
  const result = await makeRequest('PUT', '/api/users/me', updateData, {
    'Authorization': `Bearer ${accessToken}`
  });
  
  if (result.success) {
    log('✅ Update profile successful', 'green');
    log(`   Updated name: ${result.data.data.name}`, 'yellow');
    return true;
  } else {
    log('❌ Update profile failed', 'red');
    log(`   Error: ${JSON.stringify(result.error)}`, 'red');
    return false;
  }
}

async function testGetUsersAsUser() {
  log('\n👥 Testing Get Users (as regular user - should fail)...', 'blue');
  
  const result = await makeRequest('GET', '/api/users', null, {
    'Authorization': `Bearer ${accessToken}`
  });
  
  if (!result.success && result.status === 403) {
    log('✅ Access denied correctly (user cannot access user list)', 'green');
    return true;
  } else {
    log('❌ Access control failed - user should not access user list', 'red');
    return false;
  }
}

async function testGetUsersAsAdmin() {
  log('\n👑 Testing Get Users (as admin)...', 'blue');
  
  // First login as admin
  const loginData = {
    email: 'admin@example.com',
    password: 'password123'
  };
  
  const loginResult = await makeRequest('POST', '/api/auth/login', loginData);
  
  if (!loginResult.success) {
    log('❌ Admin login failed', 'red');
    return false;
  }
  
  const adminToken = loginResult.data.data.accessToken;
  
  const result = await makeRequest('GET', '/api/users', null, {
    'Authorization': `Bearer ${adminToken}`
  });
  
  if (result.success) {
    log('✅ Get users successful (admin)', 'green');
    log(`   Found ${result.data.data.length} users`, 'yellow');
    return true;
  } else {
    log('❌ Get users failed (admin)', 'red');
    log(`   Error: ${JSON.stringify(result.error)}`, 'red');
    return false;
  }
}

async function testGetUserById() {
  log('\n🔍 Testing Get User by ID...', 'blue');
  
  // Login as admin first
  const loginData = {
    email: 'admin@example.com',
    password: 'password123'
  };
  
  const loginResult = await makeRequest('POST', '/api/auth/login', loginData);
  
  if (!loginResult.success) {
    log('❌ Admin login failed', 'red');
    return false;
  }
  
  const adminToken = loginResult.data.data.accessToken;
  
  const result = await makeRequest('GET', `/api/users/${userId}`, null, {
    'Authorization': `Bearer ${adminToken}`
  });
  
  if (result.success) {
    log('✅ Get user by ID successful', 'green');
    log(`   User: ${result.data.data.name} (${result.data.data.email})`, 'yellow');
    return true;
  } else {
    log('❌ Get user by ID failed', 'red');
    log(`   Error: ${JSON.stringify(result.error)}`, 'red');
    return false;
  }
}

async function testRefreshToken() {
  log('\n🔄 Testing Refresh Token...', 'blue');
  
  const result = await makeRequest('POST', '/api/auth/refresh', {
    refreshToken: refreshToken
  });
  
  if (result.success) {
    log('✅ Refresh token successful', 'green');
    accessToken = result.data.data.accessToken;
    return true;
  } else {
    log('❌ Refresh token failed', 'red');
    log(`   Error: ${JSON.stringify(result.error)}`, 'red');
    return false;
  }
}

async function testLogout() {
  log('\n🚪 Testing Logout...', 'blue');
  
  const result = await makeRequest('POST', '/api/auth/logout', null, {
    'Authorization': `Bearer ${accessToken}`
  });
  
  if (result.success) {
    log('✅ Logout successful', 'green');
    return true;
  } else {
    log('❌ Logout failed', 'red');
    log(`   Error: ${JSON.stringify(result.error)}`, 'red');
    return false;
  }
}

async function runAllTests() {
  log('🚀 Starting API Tests for Richard Backend', 'bold');
  log('==========================================', 'bold');
  
  const tests = [
    { name: 'Health Check', fn: testHealthCheck },
    { name: 'User Registration', fn: testUserRegistration },
    { name: 'Admin Registration', fn: testAdminRegistration },
    { name: 'Login', fn: testLogin },
    { name: 'Get Current User', fn: testGetCurrentUser },
    { name: 'Update Profile', fn: testUpdateProfile },
    { name: 'Get Users (as User)', fn: testGetUsersAsUser },
    { name: 'Get Users (as Admin)', fn: testGetUsersAsAdmin },
    { name: 'Get User by ID', fn: testGetUserById },
    { name: 'Refresh Token', fn: testRefreshToken },
    { name: 'Logout', fn: testLogout }
  ];
  
  let passed = 0;
  let total = tests.length;
  
  for (const test of tests) {
    try {
      const result = await test.fn();
      if (result) passed++;
    } catch (error) {
      log(`❌ ${test.name} crashed: ${error.message}`, 'red');
    }
  }
  
  log('\n📊 Test Results', 'bold');
  log('===============', 'bold');
  log(`✅ Passed: ${passed}/${total}`, passed === total ? 'green' : 'yellow');
  
  if (passed === total) {
    log('🎉 All tests passed!', 'green');
  } else {
    log('⚠️ Some tests failed. Check the logs above.', 'yellow');
  }
}

// Check if server is running
async function checkServer() {
  try {
    await axios.get(`${BASE_URL}/health`);
    return true;
  } catch (error) {
    return false;
  }
}

async function main() {
  log('🔍 Checking if server is running...', 'blue');
  
  const serverRunning = await checkServer();
  
  if (!serverRunning) {
    log('❌ Server is not running!', 'red');
    log('Please start the server first:', 'yellow');
    log('  npm run dev', 'yellow');
    process.exit(1);
  }
  
  log('✅ Server is running', 'green');
  await runAllTests();
}

main().catch(console.error);
