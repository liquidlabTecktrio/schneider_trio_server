const swaggerJsDoc = require("swagger-jsdoc");

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Schneider Order Tracking System API",
            version: "1.0.0",
            // description: '![Schneider Logo](https://i.pinimg.com/originals/c8/f3/aa/c8f3aad95372b82b5b36503c3f82f454.png)',
        },
        servers: [
            {
                url: "https://sandbox.liquidlab.in",
                // url: "http://localhost:9090",
                description: "Local development server",
            },
            {
                url: "https://api.schneider-order-tracking.com",
                description: "Production server",
            },
        ],
    },
    apis: ["./swagger/*.js"], // Path to the API routes or documentation
};

const swaggerSpec = swaggerJsDoc(options);

module.exports = swaggerSpec;
