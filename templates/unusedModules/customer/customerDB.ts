import { model, Schema } from "mongoose";


const customerSchema = new Schema({
  UserID: String,
  ExternalUUID: String,
  RealUUID: String,
  Application: String,
  BotStatus: {
    Type: Number,
    Text: String,
    Status: String,
    URL: String
  },
  DisplayName: String,
  GuildID: [String],
  ServerPort: String,
  WSAPI: String,
});



export const customerDB = model("customer", customerSchema);
