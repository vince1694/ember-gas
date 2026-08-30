/**
 * test_e2e.js — Full API & Database Integration Test Suite
 * Tests MongoDB Atlas connection, Brevo Email dispatch, and Auth API routes.
 */
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import nodemailer from 'nodemailer';
import User from './models/User.js';
import Order from './models/Order.js';
import Seller from './models/Seller.js';
import { sendOtpEmail } from './utils/emailUtils.js';

dotenv.config();

async function runE2ETestSuite() {
  console.log('----------------------------------------------------');
  console.log('🔥 EMBERGAS FULL BACKEND E2E TEST SUITE STARTING 🔥');
  console.log('----------------------------------------------------');

  let passed = 0;
  let failed = 0;

  // 1. TEST MONGODB ATLAS CONNECTION
  try {
    console.log('\n[TEST 1] Testing MongoDB Atlas Connection...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ PASS: MongoDB Atlas Connected Host:', mongoose.connection.host);
    passed++;
  } catch (err) {
    console.error('❌ FAIL: MongoDB Atlas Connection Failed:', err.message);
    failed++;
  }

  // 2. TEST BREVO SMTP CONNECTION
  try {
    console.log('\n[TEST 2] Testing Brevo SMTP Transport...');
    const transporter = nodemailer.createTransport({
      host: 'smtp-relay.brevo.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.BREVO_SMTP_USER,
        pass: process.env.BREVO_SMTP_KEY,
      },
    });
    await transporter.verify();
    console.log('✅ PASS: Brevo SMTP Credentials Authenticated!');
    passed++;
  } catch (err) {
    console.error('❌ FAIL: Brevo SMTP Verification Failed:', err.message);
    failed++;
  }

  // 3. TEST USER CREATION & MONGOOSE MODEL
  try {
    console.log('\n[TEST 3] Testing User Model & MongoDB Save...');
    const testEmail = `testuser_${Date.now()}@embergas.ng`;
    const user = new User({
      name: 'E2E Test User',
      email: testEmail,
      phone: '08012345678',
      password: 'testpassword123',
      role: 'customer'
    });
    await user.save();
    console.log('✅ PASS: Created Test User ID:', user._id.toString());
    
    // Clean up test user
    await User.deleteOne({ _id: user._id });
    console.log('✅ PASS: Cleaned up Test User');
    passed++;
  } catch (err) {
    console.error('❌ FAIL: User Model Test Failed:', err.message);
    failed++;
  }

  // 4. TEST SELLER MODEL & QUERY
  try {
    console.log('\n[TEST 4] Testing Seller Depot Query...');
    const sellers = await Seller.find({});
    console.log(`✅ PASS: Queried Sellers Count: ${sellers.length}`);
    passed++;
  } catch (err) {
    console.error('❌ FAIL: Seller Query Failed:', err.message);
    failed++;
  }

  // 5. TEST BREVO EMAIL DISPATCH UTILITY
  try {
    console.log('\n[TEST 5] Testing Brevo OTP Email Dispatch...');
    const testOtp = Math.floor(100000 + Math.random() * 900000).toString();
    await sendOtpEmail(process.env.BREVO_FROM_EMAIL || 'b726ba001@smtp-brevo.com', 'E2E Tester', testOtp);
    console.log('✅ PASS: OTP Email Dispatched via Brevo SMTP!');
    passed++;
  } catch (err) {
    console.error('❌ FAIL: Brevo Email Dispatch Failed:', err.message);
    failed++;
  }

  console.log('\n----------------------------------------------------');
  console.log(`📊 TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log('----------------------------------------------------');

  await mongoose.disconnect();
  process.exit(failed > 0 ? 1 : 0);
}

runE2ETestSuite();
