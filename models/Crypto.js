const { Schema, model, Types } = require("mongoose");

const URL_PATTERN = /^https?:\/\/.+$/i;

const cryptoSchema = new Schema({
  title: {
    type: String,
    required: true,
    minLength: [2, "Title length must be at least 2 characters long"],
  },
  imageUrl: {
    type: String,
    required: true,
    validate: {
      validator: (value) => URL_PATTERN.test(value),
      message: "Please enter a valid url",
    },
  },
  price: {
    type: Number,
    required: true,
    min: [0, "Price must be postitive number"],

  },
  description: {
    type: String,
    required: true,
    minLength: [10, "Description length must be at least 10 characters long"],
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: {
        values: ["crypto-wallet", "credit-card", "debit-card", "paypal"],
        message: "Please select a valid payment method",
    }
  },
  bookings: { type: [Types.ObjectId], ref: "User", default: [] },
  owner: { type: Types.ObjectId, ref: "User", required: true },
});

const Crypto = model("Crypto", cryptoSchema);

module.exports = Crypto;
