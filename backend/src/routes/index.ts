// src/routes/index.ts
import { Router } from 'express';
const router = Router();

router.get('/', (req, res) => {
    res.send('<h1>Hello, Express.js Server!</h1>');
});

export default router;
