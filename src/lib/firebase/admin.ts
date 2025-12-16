import "server-only";
import { initializeApp, getApps, getApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";

import fs from "fs";
import path from "path";

function getServiceAccount() {
  // 1. Try Environment Variable
  if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    try {
      return JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
    } catch {
      console.warn("⚠️ FIREBASE_SERVICE_ACCOUNT_KEY env var exists but is invalid JSON. Checking file...");
    }
  }

  // 2. Try Local File (easier for development)
  const localFile = path.join(process.cwd(), "service-account.json");
  if (fs.existsSync(localFile)) {
    try {
      return JSON.parse(fs.readFileSync(localFile, "utf-8"));
    } catch {
      console.error("⚠️ Found service-account.json but failed to parse it.");
    }
  }

  return undefined;
}

const serviceAccountKey = getServiceAccount();

// Alternative: individual env vars if prefered (more common for Vercel)
// For local dev, a service account json file path or stringified json is common.

if (!getApps().length) {
  if (serviceAccountKey) {
    initializeApp({
      credential: cert(serviceAccountKey),
    });
  } else {
    throw new Error("FIREBASE_SERVICE_ACCOUNT_KEY is missing or invalid. Please check your .env file.");
  }
}

export const adminApp = getApp();
export const adminDb = getFirestore(adminApp);
export const adminAuth = getAuth(adminApp);