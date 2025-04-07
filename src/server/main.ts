import { NestFactory } from '@nestjs/core';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as express from 'express';
import { existsSync } from 'fs';
import { config } from 'dotenv';

config();

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
  });

  // Set global prefix for API routes
  app.setGlobalPrefix('api');

  // Use process.cwd() to get the current working directory
  const rootDir = process.cwd();
  const distDir = join(rootDir, 'dist');
  const indexHtmlPath = join(distDir, 'index.html');

  console.log('Working directory:', rootDir);
  console.log('Index.html path:', indexHtmlPath);
  console.log('Starting NestJS server with API routes at /api/*');

  // Verify the index.html file exists
  if (existsSync(indexHtmlPath)) {
    console.log('index.html file found in:', indexHtmlPath);
  } else {
    console.error('index.html file NOT found in:', indexHtmlPath);
  }

  // Serve static files from dist directory first
  app.use(express.static(distDir));

  // Add JSON body parser middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // SPA fallback - IMPORTANT: This should come after all other routes
  app.use('*', (req, res, next) => {
    // Skip API and socket.io routes
    if (req.originalUrl.startsWith('/api') || req.originalUrl.startsWith('/socket.io')) {
      return next();
    }

    // Skip requests for files with extensions that aren't HTML files
    if (req.originalUrl.includes('.') && !req.originalUrl.endsWith('.html')) {
      return next();
    }

    // Try to send index.html if it exists
    if (existsSync(indexHtmlPath)) {
      return res.sendFile(indexHtmlPath);
    } else {
      return res.status(404).send('Index.html not found. Make sure to build the frontend first.');
    }
  });

  await app.listen(3000);
  console.log('NestJS server running on http://localhost:3000');
}
bootstrap();
