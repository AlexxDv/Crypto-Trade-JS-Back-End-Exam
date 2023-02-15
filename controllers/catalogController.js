const { hasUser, isGuest } = require("../middlewares/guards");
const {
  getById,
  create,
  getAll,
  deleteById,
  update,
  cryptoOffer,
  search,
} = require("../services/catalogService");
const { parseError } = require("../util/parser");
const catalogController = require("express").Router();

catalogController.get("/", async (req, res) => {
  const crypto = await getAll();
  res.render("catalog", {
    title: "Catalog page",
    user: req.user,
    crypto,
  });
});

catalogController.get("/:id/details", async (req, res) => {
  const crypto = await getById(req.params.id);

  //const isOwner = crypto.owner == req.user?._id

  // или да го сложим crypto.owner.toString()
  
  if (crypto.owner == req.user._id) {
    crypto.isOwner = true;
  } else if (
    crypto.bookings.map((b) => b.toString()).includes(req.user._id.toString())
  ) {
    crypto.isBooked = true;
  }

  res.render("details", {
    title: "Crypto Details",
    crypto,
  });
});

catalogController.get("/create", hasUser(), (req, res) => {
  res.render("create", {
    title: "Create new crypto",
  });
});

catalogController.post("/create", async (req, res) => {
  const crypto = {
    title: req.body.title,
    imageUrl: req.body.imageUrl,
    price: Number(req.body.price),
    description: req.body.description,
    paymentMethod: req.body.paymentMethod,
    owner: req.user._id,
  };

  try {
    if (Object.values(crypto).some((value) => !value)) {
      throw new Error("All fields are required");
    }

    await create(crypto);
    res.redirect("/catalog");
  } catch (err) {
    res.render("create", {
      title: "Create new crypto",
      errors: parseError(err),
      body: crypto,
    });
  }
});

catalogController.get("/:id/edit", hasUser(), async (req, res) => {
  const crypto = await getById(req.params.id);

  if (crypto.owner != req.user._id) {
    return res.redirect("/404");
  }

  res.render("edit", {
    title: "Edit Crypto",
    crypto,
  });
});

catalogController.post("/:id/edit", hasUser(), async (req, res) => {
  const crypto = await getById(req.params.id);

  if (crypto.owner != req.user._id) {
    return res.redirect("/404");
  }

  const edited = {
    title: req.body.title,
    imageUrl: req.body.imageUrl,
    price: Number(req.body.price),
    description: req.body.description,
    paymentMethod: req.body.paymentMethod,
  };

  try {
    if (Object.values(edited).some((value) => !value)) {
      throw new Error("All fields are required");
    }

    await update(req.params.id, edited);
    res.redirect(`/catalog/${req.params.id}/details`); // To check if this is the right page
  } catch (err) {
    res.render("edit", {
      title: "Edit Crypto",
      crypto: Object.assign(edited, { _id: req.params.id }),
      errors: parseError(err),
    });
  }
});

catalogController.get("/:id/delete", hasUser(), async (req, res) => {
  const crypto = await getById(req.params.id);

  if (crypto.owner != req.user._id) {
    return res.redirect("/404");
  }

  await deleteById(req.params.id);
  res.redirect("/catalog");
});

catalogController.get("/:id/crypto", hasUser(), async (req, res) => {
  const crypto = await getById(req.params.id);

  try {
    if (crypto.owner == req.user._id) {
      crypto.isOwner = true;
      throw new Error("You can't buy this already bouth crypto");
    }

    if (
      crypto.bookings.map((b) => b.toString()).includes(req.user._id.toString())
    ) {
      crypto.isBooked = true;
      throw new Error("You already added the crypto to your wish list");
    }
    await cryptoOffer(req.params.id, req.user._id);
    res.redirect(`/catalog/${req.params.id}/details`);
  } catch (err) {
    res.render("details", {
      title: "crypto Details",
      crypto,
      errors: parseError(err),
    });
  }
});

catalogController.get("/search",hasUser(), async (req, res) => {
  const { title, paymentMethod } = req.query;
  const crypto = await search(title, paymentMethod);

  res.render("search", {
    title: "Search",
    crypto,
  });
});

module.exports = catalogController;
