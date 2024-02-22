import {config} from 'dotenv';

config({path: '.env'});

const MONGO_URL=process.env.MONGO_URL
const PORT=process.env.PORT
const MONGO_DBNAME=process.env.MONGO_DBNAME
const ADMINUSER= process.env.ADMINUSER
const ADMINPASS= process.env.ADMINPASS
const KEY=process.env.KEY
const CLIENTID= process.env.CLIENTID
const CLIENTSECRET= process.env.CLIENTSECRET
const CALLBACKURL= process.env.CALLBACKURL

export default {MONGO_URL,PORT,MONGO_DBNAME, ADMINUSER, ADMINPASS, KEY, CLIENTID, CLIENTSECRET, CALLBACKURL}