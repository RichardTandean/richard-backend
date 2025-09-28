const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

// Mock user data
const mockUsers = [
  // Admins (5 users)
  { name: 'Alice Johnson', email: 'alice.johnson@example.com', role: 'admin' },
  { name: 'Bob Smith', email: 'bob.smith@example.com', role: 'admin' },
  { name: 'Carol Davis', email: 'carol.davis@example.com', role: 'admin' },
  { name: 'David Wilson', email: 'david.wilson@example.com', role: 'admin' },
  { name: 'Eva Brown', email: 'eva.brown@example.com', role: 'admin' },
  
  // Regular users (25 users)
  { name: 'Frank Miller', email: 'frank.miller@example.com', role: 'user' },
  { name: 'Grace Lee', email: 'grace.lee@example.com', role: 'user' },
  { name: 'Henry Taylor', email: 'henry.taylor@example.com', role: 'user' },
  { name: 'Ivy Chen', email: 'ivy.chen@example.com', role: 'user' },
  { name: 'Jack Anderson', email: 'jack.anderson@example.com', role: 'user' },
  { name: 'Kate Martinez', email: 'kate.martinez@example.com', role: 'user' },
  { name: 'Liam Thompson', email: 'liam.thompson@example.com', role: 'user' },
  { name: 'Maya Rodriguez', email: 'maya.rodriguez@example.com', role: 'user' },
  { name: 'Noah Garcia', email: 'noah.garcia@example.com', role: 'user' },
  { name: 'Olivia White', email: 'olivia.white@example.com', role: 'user' },
  { name: 'Paul Harris', email: 'paul.harris@example.com', role: 'user' },
  { name: 'Quinn Clark', email: 'quinn.clark@example.com', role: 'user' },
  { name: 'Rachel Lewis', email: 'rachel.lewis@example.com', role: 'user' },
  { name: 'Sam Walker', email: 'sam.walker@example.com', role: 'user' },
  { name: 'Tina Hall', email: 'tina.hall@example.com', role: 'user' },
  { name: 'Uma Young', email: 'uma.young@example.com', role: 'user' },
  { name: 'Victor King', email: 'victor.king@example.com', role: 'user' },
  { name: 'Wendy Wright', email: 'wendy.wright@example.com', role: 'user' },
  { name: 'Xavier Lopez', email: 'xavier.lopez@example.com', role: 'user' },
  { name: 'Yara Hill', email: 'yara.hill@example.com', role: 'user' },
  { name: 'Zoe Scott', email: 'zoe.scott@example.com', role: 'user' },
  { name: 'Adam Green', email: 'adam.green@example.com', role: 'user' },
  { name: 'Bella Adams', email: 'bella.adams@example.com', role: 'user' },
  { name: 'Charlie Baker', email: 'charlie.baker@example.com', role: 'user' },
  { name: 'Diana Nelson', email: 'diana.nelson@example.com', role: 'user' },
  { name: 'Ethan Carter', email: 'ethan.carter@example.com', role: 'user' },
  { name: 'Fiona Mitchell', email: 'fiona.mitchell@example.com', role: 'user' },
  { name: 'George Perez', email: 'george.perez@example.com', role: 'user' },
  { name: 'Hannah Roberts', email: 'hannah.roberts@example.com', role: 'user' },
  { name: 'Ian Turner', email: 'ian.turner@example.com', role: 'user' },
];

// Generate random avatars (base64 encoded simple patterns)
const generateAvatar = (name, index) => {
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
    '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
  ];
  const color = colors[index % colors.length];
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase();
  
  // Simple SVG avatar as base64
  const svg = `
    <svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="50" fill="${color}"/>
      <text x="50" y="60" text-anchor="middle" fill="white" font-family="Arial" font-size="24" font-weight="bold">${initials}</text>
    </svg>
  `;
  
  return Buffer.from(svg).toString('base64');
};

async function generateMockUsers() {
  try {
    console.log('🚀 Starting to generate mock users...');
    
    // Check if users already exist
    const existingUsers = await prisma.user.count();
    if (existingUsers > 0) {
      console.log(`⚠️  Found ${existingUsers} existing users. Skipping generation to avoid duplicates.`);
      console.log('To regenerate, first clear the database with: npx prisma db push --force-reset');
      return;
    }
    
    const password = 'password123'; // Default password for all mock users
    const hashedPassword = await bcrypt.hash(password, 12);
    
    let createdCount = 0;
    
    for (let i = 0; i < mockUsers.length; i++) {
      const userData = mockUsers[i];
      const avatarBase64 = generateAvatar(userData.name, i);
      
      try {
        await prisma.user.create({
          data: {
            name: userData.name,
            email: userData.email,
            passwordHash: hashedPassword,
            role: userData.role,
            avatarUrl: `data:image/svg+xml;base64,${avatarBase64}`,
          },
        });
        
        createdCount++;
        console.log(`✅ Created user ${i + 1}/${mockUsers.length}: ${userData.name} (${userData.role})`);
        
        // Add small delay to avoid overwhelming the database
        await new Promise(resolve => setTimeout(resolve, 100));
        
      } catch (error) {
        console.error(`❌ Failed to create user ${userData.name}:`, error.message);
      }
    }
    
    console.log(`\n🎉 Successfully created ${createdCount} mock users!`);
    console.log('\n📋 Login credentials for testing:');
    console.log('All users have password: password123');
    console.log('\n👑 Admin users:');
    mockUsers.filter(u => u.role === 'admin').forEach(u => {
      console.log(`  - ${u.email}`);
    });
    console.log('\n👤 Regular users:');
    mockUsers.filter(u => u.role === 'user').forEach(u => {
      console.log(`  - ${u.email}`);
    });
    
  } catch (error) {
    console.error('❌ Error generating mock users:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
generateMockUsers();
