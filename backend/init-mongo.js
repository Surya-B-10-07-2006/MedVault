db = db.getSiblingDB('medvault');

db.createUser({
  user: 'medvault_user',
  pwd: 'medvault_password',
  roles: [
    {
      role: 'readWrite',
      db: 'medvault'
    }
  ]
});

db.createCollection('users');
db.createCollection('medicalrecords');
db.createCollection('accessrequests');
db.createCollection('auditlogs');
db.createCollection('refreshtokens');
db.createCollection('jtiblacklists');

print('Database initialized successfully');