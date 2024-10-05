const m2s = require('mongoose-to-swagger');
const User = require('./models/user.model');

exports.options = {
    "openapi": "3.1.0",
    "info": {
        "version": "1.0.0",
        "title": "Products CRUD API",
        "description": "Products and Users application",
        "contact": {
            "name": "Coding Family",
            "url": "https://www.example.com",
            "email": "support@example.com"
        }
    },
    "components": {
        "schemas": {
            User: m2s(User)
        }
    }
}