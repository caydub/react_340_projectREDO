// This module adapted from the starter code provided in CS340 Modules/Explorations

import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Pages
import Home from './pages/Home';
import Albums from './pages/Albums';
import Artists from './pages/Artists';
import Genres from './pages/Genres';
import Sales from './pages/Sales';
import Customers from './pages/Customers';
import AlbumRatings from "./pages/AlbumRatings.jsx";
import LineItems from "./pages/LineItems.jsx";
// Components
import Navigation from './components/Navigation';

// Define the backend port and URL for API requests
const backendPort = 59695;  // Use the port you assigned to the backend server, this would normally go in a .env file
// const backendPort = 55695;  // testing backend port
const backendURL = `http://classwork.engr.oregonstate.edu:${backendPort}`;

function App() {

    return (
        <>
            <Navigation />
            <Routes>
                <Route path="/" element={<Home backendURL={backendURL} />} />
                <Route path="/albums" element={<Albums backendURL={backendURL} />} />
                <Route path="/artists" element={<Artists backendURL={backendURL} />} />
                <Route path="/genres" element={<Genres backendURL={backendURL} />} />
                <Route path="/sales" element={<Sales backendURL={backendURL} />} />
                <Route path="/customers" element={<Customers backendURL={backendURL} />} />
                <Route path="/albumratings" element={<AlbumRatings backendURL={backendURL} />} />
                <Route path="/lineitems" element={<LineItems backendURL={backendURL} />} />
            </Routes>
        </>
    );

} export default App;