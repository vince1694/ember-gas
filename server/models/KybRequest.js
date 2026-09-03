import mongoose from 'mongoose';

const kybRequestSchema = mongoose.Schema(
    {
        vendor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: false,
        },
        stationName: {
            type: String,
            required: true,
            trim: true,
        },
        ownerName: {
            type: String,
            default: 'Station Operator',
            trim: true,
        },
        email: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
            index: true,
        },
        phone: {
            type: String,
            default: '',
            trim: true,
        },
        licenseNumber: {
            type: String,
            default: 'DPR/NMDPRA/RC-' + Math.floor(100000 + Math.random() * 900000),
            trim: true,
        },
        address: {
            type: String,
            default: 'Lagos, Nigeria',
        },
        status: {
            type: String,
            enum: ['PENDING', 'VERIFIED', 'REJECTED'],
            default: 'PENDING',
            index: true,
        },
        stationType: {
            type: String,
            enum: ['filling_station', 'independent_seller', 'vendor'],
            default: 'filling_station',
        },
        documents: {
            idCard: { type: String, default: '' },
            businessPermit: { type: String, default: '' },
        },
        rejectionReason: {
            type: String,
            default: '',
        },
        notes: {
            type: String,
            default: '',
        },
        requestedAt: {
            type: Date,
            default: Date.now,
        },
        reviewedAt: {
            type: Date,
        },
        reviewedBy: {
            type: String,
            default: 'Super Admin',
        },
    },
    {
        timestamps: true,
    }
);

const KybRequest = mongoose.model('KybRequest', kybRequestSchema);

export default KybRequest;
