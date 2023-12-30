const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  prefix: { type: String, required: true },
  userId: { type: String, required: true },
  path: { type: String, required: true },
  type: { type: String, required: true },
  size: { type: Number, required: true },
  access: { type: [String], enum: ['private', 'shared', 'public'], required: true },
  sharedAccessIds:{type:[String], default:[]},
  version: { type: String, enum: ['current','other'], default: 'current' },
  versionId:{type: String, required: true},
  hash:{type: String, required: true,default: Date.now()},
  service:{type: String, enum: ['9100','9101','9200','9201']},
  url: { type: String, required: true },
}, { timestamps: true });
// timestamps: true adds createdAt and updatedAt fields to the schema

const FileMetadata = mongoose.model('File', fileSchema);

module.exports = FileMetadata;
