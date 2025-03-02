// server.mjs or server.js (with "type": "module" in package.json)
import 'dotenv/config';

import express from 'express';
import fetch from 'node-fetch';

const port = process.env.PORT || 3000;

console.log(port);

const app = express();
app.use(express.json());
const apiKey = process.env.API_KEY;
const N_key = process.env.N_KEY;
console.log(apiKey);


app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "https://git-serve.vercel.app/api");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Credentials", "true");
    next();
});

  
app.get('/api/electricity-estimate', async (req, res) => {
    
    
    const { country, electricityValue } = req.query;
    const url = 'https://carbonsutra1.p.rapidapi.com/electricity_estimate';
    const options = {
        method: 'POST',
        headers: {
            'x-rapidapi-key': apiKey,
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Bearer ${N_key}`
        },
        body: new URLSearchParams({
            country_name: country,
            electricity_value: electricityValue,
            electricity_unit: 'kWh'
        })
    };

    try {
        const response = await fetch(url, options);
        const data = await response.json();
        res.json(data);
        // console.log(res.json(data));
        
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch data' });
    }
});


app.get('/api/vehicle_makes/:make/vehicle_models', async (req, res) => {
    const make = req.params.make;
    const url = `https://carbonsutra1.p.rapidapi.com/vehicle_makes/${make}/vehicle_models`;
    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': apiKey,
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Bearer ${N_key}`
        }
    };

    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch data' });
        console.error(error);
    }
});
app.post('/api/vehicle_estimate_by_model', async (req, res) => {
    const {vehicle_make,vehicle_model,distance_value,distance_unit  } = req.body;
    const url = 'https://carbonsutra1.p.rapidapi.com/vehicle_estimate_by_model';
    const options = {
        method: 'POST',
        headers: {
            'x-rapidapi-key': apiKey,
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Bearer ${N_key}`
        },
        body: new URLSearchParams({
            vehicle_make,
            vehicle_model,
            distance_value,
            distance_unit
        })
    };
    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch data' });
        console.error(error);
    }
});

// Add this route to your existing server.js file

app.get('/api/airports', async (req, res) => {
    const keyword = req.query.keyword;
    const url = `https://carbonsutra1.p.rapidapi.com/airports-by-keyword?keyword=${keyword}`;
    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': apiKey,
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Bearer ${N_key}`
        }
    };

    try {
        const response = await fetch(url, options);
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch airport data' });
        console.error(error);
    }
});





app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

export default app; 
