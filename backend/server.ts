// server.ts (根目录)
import app from './src/app';
import 'dotenv/config';

const port = process.env.PORT;

app.listen(port, () => {
    console.log(`Server is running on port ${port}\n`);
    console.log(`Go to http://127.0.0.1:${port}/`);
});
