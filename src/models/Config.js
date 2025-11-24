import mongoose from "mongoose";

const ConfigSchema = new mongoose.Schema({
  maintenanceMode: { type: Boolean, default: false },
  siteName: { type: String, default: "Nova News" }
}, { timestamps: true });

const Config = mongoose.models.Config || mongoose.model("Config", ConfigSchema);
export default Config;