const mongoose = require("mongoose");

const reviewSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const serviceSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    image: [
      {
        type: String,
        required: true,
      },
    ],
    color: {
      type: String,
    },
    flavour: {
      type: String,
    },

    brand: {
      type: String,
    },
    category: {
      type: mongoose.Schema.Types.Number,
      required: true,
      ref: "Category",
    },
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Vendor",
    },
    location: {
      type: { type: String, default: "Point" },
      coordinates: { type: [Number], index: "2dsphere" },
    },
    size: {
      type: String,
    },

    description: {
      type: String,
    },
    details: [
      {
        type: String,
      },
    ],

    reviews: [reviewSchema],
    rating: {
      type: Number,
      required: true,
      default: 0,
    },
    city: {
      type: String,
    },

    sell_price: {
      type: Number,
      required: true,
      default: 0,
    },
    discount: {
      type: Number,

      default: 0,
    },
    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);
serviceSchema.index({ location: "2dsphere" });

const Service = mongoose.model("Service", serviceSchema);

module.exports = Service;
