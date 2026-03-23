import { createClient } from "redis"
import {env} from "../config/env.service.js"


export const client = createClient({
  url: env.radis_url
});

client.on("error", function(err) {
  throw err;
});

export const connectionRdais=async ()=>{
    try {
    await client.connect()
    console.log("redis connected")
    } catch (error) {
        console.log(error)
    }
  
}
