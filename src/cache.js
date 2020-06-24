import redis from 'redis';

const REDIS_PORT = process.env.REDIS_PORT || "6379";

const client = redis.createClient( REDIS_PORT );

export {
    client as redisclient
};