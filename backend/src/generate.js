import mongoose from "mongoose";
import {node_mongo_crud}  from "@aniket7575/node_mongo_crud"
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const projectPath = __dirname
console.log(projectPath);

const moduleName = "Supplier"

node_mongo_crud(projectPath, moduleName)
