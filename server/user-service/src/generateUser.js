const mongoose = require('mongoose');
const User = require('./models/User');


async function createDummyUsers() {
    const count = await User.countDocuments();
    if (count === 2) {
        console.log('Populating database with dummy users...');
        const dummyUsers = [
            {
                "username": "hcowgill0",
                "name": "Hazel Cowgill",
                "email": "hcowgill0@usa.gov",
                "role": "public",
                "password": "eK4*ot+YEc({$e"
            },
            {
                "username": "rallery1",
                "name": "Russell Allery",
                "email": "rallery1@woothemes.com",
                "role": "public",
                "password": "vY6>TbgoaH"
            },
            {
                "username": "frathke2",
                "name": "Fionna Rathke",
                "email": "frathke2@wikia.com",
                "role": "researcher",
                "password": "jR8$9(C_"
            },
            {
                "username": "sdowbiggin3",
                "name": "Suzann Dowbiggin",
                "email": "sdowbiggin3@sfgate.com",
                "role": "public",
                "password": "iZ8|X>4|'glp"
            },
            {
                "username": "bdimitriou4",
                "name": "Boot Dimitriou",
                "email": "bdimitriou4@jalbum.net",
                "role": "admin",
                "password": "gJ4!g\\f\"z"
            },
            {
                "username": "cshankster5",
                "name": "Cad Shankster",
                "email": "cshankster5@indiatimes.com",
                "role": "researcher",
                "password": "iS1{EL|+yY<K"
            },
            {
                "username": "tfrostick6",
                "name": "Toddie Frostick",
                "email": "tfrostick6@last.fm",
                "role": "researcher",
                "password": "lO9|_bc@U%AG*7K+"
            },
            {
                "username": "abuckeridge7",
                "name": "Adria Buckeridge",
                "email": "abuckeridge7@latimes.com",
                "role": "public",
                "password": "mN8@3NRDaL2.1,N"
            },
            {
                "username": "rwellen8",
                "name": "Robin Wellen",
                "email": "rwellen8@fc2.com",
                "role": "researcher",
                "password": "sY4@dr4K"
            },
            {
                "username": "nbasinigazzi9",
                "name": "Nelle Basini-Gazzi",
                "email": "nbasinigazzi9@ask.com",
                "role": "public",
                "password": "iU7~e0'Mc7#nU"
            }
        ];

        await User.insertMany(dummyUsers.map(user => ({
            ...user
        })));

        console.log('Dummy users added to the database.');
    } else {
        console.log('Database already has users. Skipping dummy data insertion.');
    }
};

module.exports = { createDummyUsers }
