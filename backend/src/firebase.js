import { readFileSync } from 'node:fs';
import { applicationDefault, cert, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { config } from './config.js';

let firebaseApp = null;

function buildCredential() {
  if (config.firebaseServiceAccountPath) {
    const serviceAccount = JSON.parse(readFileSync(config.firebaseServiceAccountPath, 'utf8'));
    return cert(serviceAccount);
  }
  return applicationDefault();
}

function app() {
  if (!firebaseApp) {
    firebaseApp = initializeApp({
      credential: buildCredential(),
      ...(config.firebaseProjectId ? { projectId: config.firebaseProjectId } : {}),
    });
  }
  return firebaseApp;
}

export function adminAuth() {
  return getAuth(app());
}