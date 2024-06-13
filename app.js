import { caching } from 'cache-manager';
import express from 'express';
import path, { dirname } from 'path';
import https from 'https';
import fs from 'fs';
import { fileURLToPath } from 'url';
import viewRoutes from './routes/viewRoutes.mjs';
import apiRoutes from './routes/apiRoutes.mjs';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authMiddleware from './middleware/authenticate.mjs';
// import pkg from 'body-parser';
// const { json } = pkg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 3000;

// Initialize memory cache
// const memoryCache = await caching('memory', {
//   max: 100,
//   ttl: 10 // seconds
// });

// const ttl = 60 * 1000;

// const cacheMiddleware = async (req, res, next) => {
//   const key = req.originalUrl;
//   console.log(key);

//   try {
//     const cachedResponse = await memoryCache.get(key);
//     if (cachedResponse) {
//       console.log(`Cache hit for ${key}`);
//       return res.send(cachedResponse);
//     } else {
//       console.log(`Cache miss for ${key}`);
//       res.sendResponse = res.send;
//       res.send = async (body) => {
//         try {
//           await memoryCache.set(key, body, ttl);
//           console.log(`Stored response in cache for ${key}`);
//         } catch (cacheError) {
//           console.error(`Error storing response in cache for ${key}:`, cacheError);
//         }
//         // console.log('inside applicatin--------->', body)
//         res.sendResponse(body);

//       };
//       next();
//     }
//   } catch (err) {
//     console.error(`Error accessing cache for ${key}:`, err);
//     next(err);
//   }
// };

var corsOptions = {
  origin: '*'
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  next();
});

app.use(viewRoutes); // Mount view routes under /
app.use('/api', apiRoutes); // Mount API routes under /api

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.message);
  res.status(500).send('Error. See console');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});


// https
//   .createServer(
//     {
//       key: fs.readFileSync(
//         "../../ssl/keys/bff00_24c1b_ad36abb477093a715917eae7aee918ad.key"
//       ),
//       cert: fs.readFileSync(
//         "../../ssl/certs/app_node_enterprisetalk_com_bff00_24c1b_1718271604_2f17848872b7192ed45e3f95aaa3cbda.crt"
//       ),
//     },
//     app
//   )
//   .listen(port, () => {
//     console.log(`Server is running on port ${port}.`);
//   });


