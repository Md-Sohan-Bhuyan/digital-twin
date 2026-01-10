import React from 'react';
import Navbar from './Home/Navbar';
import { Outlet } from 'react-router';
import Footer from './Home/Footer';

const HomeLayout = () => {
    return (
        <div>
            <Navbar />
            <Outlet />
            <Footer />
        </div>
    );
};

export default HomeLayout;