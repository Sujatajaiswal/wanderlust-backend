const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing"); // Assuming listing model is in models/listing.js
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync"); // Ensure this utility is correctly defined
//const ExpressError = require("./utils/ExpressError.js");

//const MONGO_URL = "mongodb://localhost:27017/wanderlust";
const MONGO_URL =
  process.env.MONGO_URI || "mongodb://localhost:27017/wanderlust";

// MongoDB connection
main()
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.error("Database connection error:", err);
  });

async function main() {
  await mongoose.connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}

// EJS setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);

// Middleware
app.use(express.urlencoded({ extended: true })); // To parse form data
app.use(methodOverride("_method")); // To handle PUT and DELETE requests
app.use(express.static(path.join(__dirname, "public"))); // Static files (e.g., CSS, images)

// Home Route ("/")
app.get("/", async (req, res) => {
  try {
    const allListings = await Listing.find({});
    res.render("home", { allListings }); // Ensure this matches your EJS file
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving listings");
  }
});

// Listings Route ("/listings")
app.get(
  "/listings",
  wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index", { allListings });
  })
);

// New Listing Route ("/listings/new")
app.get("/listings/new", (req, res) => {
  res.render("listings/new");
});

// Show Listing Route ("/listings/:id")
app.get(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show", { listing });
  })
);

// Create Listing Route ("/listings")
app.post(
  "/listings",
  wrapAsync(async (req, res) => {
    const { title, description, image, price, country, location } =
      req.body.listing;

    if (!title || !description || !image || !price || !country || !location) {
      return res
        .status(400)
        .render("listings/new", { error: "All fields are required." });
    }

    if (isNaN(price) || price <= 0) {
      return res
        .status(400)
        .render("listings/new", { error: "Please enter a valid price." });
    }

    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
  })
);

// Edit Listing Route ("/listings/:id/edit")
app.get(
  "/listings/:id/edit",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit", { listing });
  })
);

// Update Listing Route ("/listings/:id")
app.put(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`);
  })
);

// Delete Listing Route ("/listings/:id")
app.delete(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
  })
);

// Sample Listing Route ("/testListing") for testing purposes
app.get(
  "/testListing",
  wrapAsync(async (req, res) => {
    const sampleListing = new Listing({
      title: "My New Villa",
      description: "By the beach",
      price: 1200,
      location: "Calangute, Goa",
      country: "India",
    });

    await sampleListing.save();
    console.log("Sample listing saved");
    res.send("Sample listing added successfully.");
  })
);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).render("error", { message: "Something went wrong!" });
});

// Server setup
// app.listen(8080, () => {
//   console.log("Server is listening on port 8080");
// });
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

// const express = require("express");
// const app = express();
// const mongoose = require("mongoose");
// const Listing = require("./models/listing"); // Assuming listing model is in models/listing.js
// const path = require("path");
// const methodOverride = require("method-override");
// const ejsMate = require("ejs-mate");
// const wrapAsync = require("./utils/wrapAsync.js"); // Ensure this utility is correctly defined
// const ExpressError = require("./utils/ExpressError.js"); // Assuming you have an ExpressError class for error handling

// const MONGO_URL = "mongodb://localhost:27017/wanderlust";

// // MongoDB connection
// main()
//   .then(() => {
//     console.log("Connected to DB");
//   })
//   .catch((err) => {
//     console.error("Database connection error:", err);
//   });

// async function main() {
//   await mongoose.connect(MONGO_URL, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   });
// }

// // EJS setup
// app.set("view engine", "ejs");
// app.set("views", path.join(__dirname, "views"));
// app.engine("ejs", ejsMate);

// // Middleware
// app.use(express.urlencoded({ extended: true })); // To parse form data
// app.use(methodOverride("_method")); // To handle PUT and DELETE requests
// app.use(express.static(path.join(__dirname, "public"))); // Static files (e.g., CSS, images)

// // Home Route ("/")
// app.get("/", async (req, res) => {
//   try {
//     const allListings = await Listing.find({});
//     res.render("home", { allListings }); // Ensure this matches your EJS file
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Error retrieving listings");
//   }
// });

// // Listings Route ("/listings")
// app.get(
//   "/listings",
//   wrapAsync(async (req, res) => {
//     const allListings = await Listing.find({});
//     res.render("listings/index", { allListings });
//   })
// );

// // New Listing Route ("/listings/new")
// app.get("/listings/new", (req, res) => {
//   res.render("listings/new");
// });

// // Show Listing Route ("/listings/:id")
// app.get(
//   "/listings/:id",
//   wrapAsync(async (req, res) => {
//     const { id } = req.params;
//     const listing = await Listing.findById(id);
//     res.render("listings/show", { listing });
//   })
// );

// // Create Listing Route ("/listings")
// app.post("/listings", async (req, res) => {
//   const { title, description, image, price, country, location } =
//     req.body.listing;

//   // Check for missing fields
//   if (!title || !description || !image || !price || !country || !location) {
//     return res.status(400).render("listings/new", {
//       error: "Something went wrong! All fields are required.",
//     });
//   }

//   // Validate price (must be a number and greater than 0)
//   if (isNaN(price) || price <= 0) {
//     return res.status(400).render("listings/new", {
//       error: "Something went wrong! Please enter a valid price.",
//     });
//   }

//   // Create a new listing if the data is valid
//   const newListing = new Listing(req.body.listing);

//   try {
//     await newListing.save();
//     res.redirect("/listings");
//   } catch (err) {
//     res.status(500).send("Something went wrong! Could not save the listing.");
//   }
// });

// // Edit Listing Route ("/listings/:id/edit")
// app.get(
//   "/listings/:id/edit",
//   wrapAsync(async (req, res) => {
//     const { id } = req.params;
//     const listing = await Listing.findById(id);
//     res.render("listings/edit", { listing });
//   })
// );

// // Update Listing Route ("/listings/:id")
// app.put(
//   "/listings/:id",
//   wrapAsync(async (req, res) => {
//     const { id } = req.params;
//     await Listing.findByIdAndUpdate(id, { ...req.body.listing });
//     res.redirect(`/listings/${id}`);
//   })
// );

// // Delete Listing Route ("/listings/:id")
// app.delete(
//   "/listings/:id",
//   wrapAsync(async (req, res) => {
//     const { id } = req.params;
//     await Listing.findByIdAndDelete(id);
//     res.redirect("/listings");
//   })
// );

// // Sample Listing Route ("/testListing") for testing purposes
// // app.get(
// //   "/testListing",
// //   wrapAsync(async (req, res) => {
// //     const sampleListing = new Listing({
// //       title: "My New Villa",
// //       description: "By the beach",
// //       price: 1200,
// //       location: "Calangute, Goa",
// //       country: "India",
// //     });

// //     await sampleListing.save();
// //     console.log("Sample listing saved");
// //     res.send("Sample listing added successfully.");
// //   })
// // );

// // Error handling middleware
// app.use((err, req, res, next) => {
//   console.error(err);
//   res.status(500).render("error", { message: "Something went wrong!" });
// });

// // Server setup
// app.listen(8080, () => {
//   console.log("Server is listening on port 8080");
// });
