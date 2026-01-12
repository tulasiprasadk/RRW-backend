// Root entrypoint for Vercel - re-export from api/index.js
// This file exists so Vercel can detect the project type
import express from 'express';
export { handler } from './api/index.js';
