require('dotenv').config();
const { startConsumer } = require('./kafkaConsumer');
const Redis = require('ioredis');
const { EventEmitter } = require('events');

// Initialize Redis client
const redis = new Redis({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD,
});

const consumersConfig = [
    {
        groupId: 'consumer-group-1',
        topics: ['users'],
        eventName: 'user-event',
        eventHandler: async (decodedValue, topic, partition) => {
            console.log(`[Group 1] Received message from topic "${topic}" partition ${partition}:`, decodedValue);

            // Assuming decodedValue is already an object parsed from JSON
            const userLoginData = decodedValue;

            // Construct Redis key for the user (e.g., user:login:userId)
            const redisKey = `user:login:${userLoginData.userId}`;

            // Update Redis cache with user login data
            await redis.set(redisKey, JSON.stringify(userLoginData));
            console.log(`Updated Redis cache for user: ${userLoginData.userId}`);
        },
    },
    {
        groupId: 'consumer-group-3',
        topics: ['user-deletions'],
        eventName: 'user-deleted',
        eventHandler: async (decodedValue, topic, partition) => {
            console.log(`[Group 3] Received UserDeleted message from topic "${topic}" partition ${partition}:`, decodedValue);

            // Assume decodedValue contains the user deletion information, including the teams
            const userDeletionData = decodedValue;

            // Construct Redis key for the user (e.g., user:info:userId)
            const userRedisKey = `user:info:${userDeletionData.userId}`;

            // Remove user information from Redis cache
            await redis.del(userRedisKey);
            console.log(`Removed Redis cache entry for deleted user: ${userDeletionData.userId}`);

            // Process each team the user was a part of
            for (const team of userDeletionData.teams) {
                // Construct Redis key for the team (e.g., team:info:teamId)
                const teamRedisKey = `team:info:${team.teamId}`;

                // Fetch team information from Redis
                const teamDataString = await redis.get(teamRedisKey);
                if (teamDataString) {
                    const teamData = JSON.parse(teamDataString);

                    // Remove the user from the team's member list
                    teamData.members = teamData.members.filter(memberUsername => memberUsername !== userDeletionData.username);

                    // Save the updated team information back into Redis
                    await redis.set(teamRedisKey, JSON.stringify(teamData));
                    console.log(`Updated Redis cache entry for team: ${team.teamName} after removing deleted user: ${userDeletionData.username}`);
                }
            }
        },
    },
    {
        groupId: 'consumer-group-4',
        topics: ['user-creations'],
        eventName: 'user-created',
        eventHandler: async (decodedValue, topic, partition) => {
            console.log(`[Group 4] Received UserCreated message from topic "${topic}" partition ${partition}:`, decodedValue);

            const userCreationData = decodedValue;

            // Construct Redis key for the new user (e.g., user:info:userId)
            const userRedisKey = `user:info:${userCreationData.userId}`;

            // Store new user information in Redis cache
            await redis.set(userRedisKey, JSON.stringify(userCreationData));
            console.log(`Stored new user information in Redis: ${userCreationData.userId}`);

            // Process each team the user is a part of and update Redis accordingly
            for (const team of userCreationData.teams) {
                const teamRedisKey = `team:info:${team.teamId}`;
                const teamData = {
                    teamId: team.teamId,
                    teamName: team.teamName,
                    members: team.members
                };
                await redis.set(teamRedisKey, JSON.stringify(teamData));
                console.log(`Updated Redis cache entry for team: ${team.teamName} with new user: ${userCreationData.username}`);
            }
        },
    },


    // Add more consumer configurations if necessary
];

async function startConfiguredConsumer(config) {
    const messageEventEmitter = new EventEmitter();
    try {
        await startConsumer({
            groupId: config.groupId,
            topics: config.topics,
            eventName: config.eventName,
            isRegistryDecode: false,
            messageEventEmitter
        });

        messageEventEmitter.on(config.eventName, config.eventHandler);
        console.log(`Consumer [${config.groupId}] started. Subscribed to topics: ${config.topics.join(', ')}`);
    } catch (error) {
        console.error(`Error starting the consumer [${config.groupId}]:`, error);
    }
}

function runAllConsumers() {
    consumersConfig.forEach(startConfiguredConsumer);
}

runAllConsumers();
