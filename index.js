// Root entrypoint for Vercel project detection
// Actual serverless function is in api/index.js
import express from 'express';
export { handler } from './api/index.js';
