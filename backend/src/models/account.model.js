const mongoose = require("mongoose");
const { ProviderEnum } = require("../enums/account-provider.enum");

const { Schema } = mongoose;

const accountSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    provider: {
      type: String,
      enum: Object.values(ProviderEnum),
      required: true,
    },
    providerId: {
      type: String,
      required: true,
      unique: true,
    },
    refreshToken: {
      type: String,
      default: null,
    },
    tokenExpiry: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        delete ret.refreshToken;
      },
    },
  },
);

const AccountModel = mongoose.model("Account", accountSchema);

module.exports = AccountModel;
