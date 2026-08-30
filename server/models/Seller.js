import mongoose from 'mongoose';

const cylinderStockSchema = mongoose.Schema({
    size: { type: String, enum: ['6kg', '12.5kg', '25kg', '50kg'], required: true },
    availableCount: { type: Number, default: 0 },
    pricePerKg: { type: Number, default: 1300 },
    status: { type: String, enum: ['AVAILABLE', 'LOW_STOCK', 'OUT_OF_STOCK', 'CLOSED'], default: 'AVAILABLE' }
});

const sellerSchema = mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        name: { type: String, required: true },
        sellerType: { type: String, enum: ['filling_station', 'independent_seller'], required: true },
        isVerified: { type: Boolean, default: true },
        rating: { type: Number, default: 4.8 },
        reviewCount: { type: Number, default: 128 },
        distanceKm: { type: Number, default: 1.2 },
        locationName: { type: String, default: 'Ikeja, Lagos' },
        coords: {
            lat: { type: Number, default: 6.6018 },
            lng: { type: Number, default: 3.3515 }
        },
        address: { type: String, default: '23 Allen Avenue, Ikeja, Lagos' },
        phone: { type: String, default: '0803 123 4567' },
        openingHours: { type: String, default: '8:00 AM - 7:00 PM' },
        isOpen: { type: Boolean, default: true },
        deliveryAvailable: { type: Boolean, default: true },
        pickupAvailable: { type: Boolean, default: true },
        inventory: [cylinderStockSchema],
        todaySalesNGN: { type: Number, default: 45600 },
        todayOrdersCount: { type: Number, default: 18 },
        gasSoldKg: { type: Number, default: 183 },
        branchesCount: { type: Number, default: 1 }
    },
    { timestamps: true }
);

const Seller = mongoose.model('Seller', sellerSchema);
export default Seller;
