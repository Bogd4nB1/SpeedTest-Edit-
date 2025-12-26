import { client } from "./database.js";
import { createResults, createIndex } from "./sqlquery.js";

export const initTables = async () =>{
    client.query(createResults);
    client.query(createIndex);
};
