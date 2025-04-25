import express from 'express';
import cors from 'cors';
// import uploadRoutes from './routes/uploadRoutes';
// import dataRoutes from './routes/dataRoutes';
// import { connectToDatabase } from './utils/db';
const corsOptions = {
    origin: ["http://localhost:5173"],
};
const app = express();
const PORT = 3001;
app.use(cors(corsOptions));
// app.use(express.json());
// app.use('/api', uploadRoutes);
// app.use('/api', dataRoutes);
app.get("/api", (req, res) => {
    res.json({ fruits: ["apple", "orange", "banana"] });
});
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
// connectToDatabase().then(() => {
//     app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
// });
