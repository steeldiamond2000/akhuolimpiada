// Admin parol hash generatori
// Ishlatish: node --env-file-if-exists=/vercel/share/.env.project scripts/generate-hash.js <parol>

const bcrypt = require('bcryptjs');

const password = process.argv[2];

if (!password) {
  console.log('Ishlatish: node scripts/generate-hash.js <parol>');
  console.log('Misol: node scripts/generate-hash.js admin123');
  process.exit(1);
}

const hash = bcrypt.hashSync(password, 10);

console.log('\n===========================================');
console.log('Parol:', password);
console.log('Hash:', hash);
console.log('===========================================\n');
console.log('SQL buyruq:');
console.log(`UPDATE admins SET password_hash = '${hash}' WHERE username = 'admin';`);
console.log('\n');
