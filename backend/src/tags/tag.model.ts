import * as mongoose from 'mongoose'

export const TagSchema = new mongoose.Schema({
    name: {type: String, required: true},
});

export interface Tag{
    id: string;
    name:string;
}