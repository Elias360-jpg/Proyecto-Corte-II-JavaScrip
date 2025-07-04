    const express = require('express');
    const authRoutes = require('./routes/authRoutes'); // Asegúrate de que esta línea esté
    const productRoutes = require('./routes/productRoutes');
    require('dotenv').config();

    const app = express();
    const PORT = process.env.PORT || 3000;

    app.use(express.json()); // Middleware para parsear JSON bodies

    // Rutas de autenticación
    app.use('/api/auth', authRoutes); // ¡Esta línea es crucial!
    // Rutas de productos
    app.use('/api/products', productRoutes);

    app.get('/', (req, res) => {
        res.send('API REST en funcionamiento!');
    });

    app.listen(PORT, () => {
        console.log(`Servidor corriendo en el puerto ${PORT}`);
    });