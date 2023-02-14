const Crypto = require("../models/Crypto");

async function getAll() {
  return await Crypto.find({}).lean(); // При подаване на празен обект, това означава -> намери ги всичките
}

async function getById(id) {
  return Crypto.findById(id).lean();
}

async function getByUserBooking(userId) {
  return Crypto.find({ bookings: userId }).lean();
}

async function create(crypto) {
  return await Crypto.create(crypto);
}

async function update(id, crypto) {
  const existing = await Crypto.findById(id);

  existing.title = crypto.title;
  existing.imageUrl = crypto.imageUrl;
  existing.price = Number(crypto.price);
  existing.description = crypto.description;
  existing.paymentMethod = crypto.paymentMethod;

  await existing.save();
}

async function deleteById(id) {
  await Crypto.findByIdAndRemove(id);
}

async function cryptoOffer(cryptoId, userId) {
  const crypto = await Crypto.findById(cryptoId);

  crypto.bookings.push(userId);
  await crypto.save();
}

async function search(title, paymentMethod) {
  let crypto = await this.getAll();

  if (title) {
    crypto = crypto.filter(
      (crypto) => crypto.title.toLowerCase() == title.toLowerCase()
    );
  }

  if (paymentMethod) {
    crypto = crypto.filter((crypto) => crypto.paymentMethod == paymentMethod);
  }

  return crypto;
}

module.exports = {
  getAll,
  getById,
  getByUserBooking,
  update,
  create,
  deleteById,
  cryptoOffer,
  search
};
