import mongoose from 'mongoose';

const productSchema = mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, default: 'new_cylinder.png' },
    desc: { type: String, default: '' },
    category: { type: String, default: 'Accessories' },
    stock: { type: Number, default: 50 },
    isAvailable: { type: Boolean, default: true },
});

const auditLogSchema = mongoose.Schema({
    action: { type: String, required: true },
    detail: { type: String, default: '' },
    performedBy: { type: String, default: 'Super Admin' },
    timestamp: { type: Date, default: Date.now },
});

const platformSettingsSchema = mongoose.Schema(
    {
        key: {
            type: String,
            required: true,
            unique: true,
            default: 'global_config',
        },
        ceilingPricePerKg: {
            type: Number,
            default: 1250,
        },
        platformCommissionPercent: {
            type: Number,
            default: 4.5,
        },
        storeProducts: [productSchema],
        auditLogs: [auditLogSchema],
    },
    { timestamps: true }
);

const PlatformSettings = mongoose.model('PlatformSettings', platformSettingsSchema);

export default PlatformSettings;
