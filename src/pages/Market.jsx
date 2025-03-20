import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Footer } from './Footer'; // Adjust the import path as per your project structure
import lentilsImage from '../images/lentil.jpeg';
import appleImage from '../images/apple.jpeg';

const Market = () => {
    const [showPopup, setShowPopup] = useState(true);
    const [cropPredictions, setCropPredictions] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [localPrices, setLocalPrices] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Retrieve crop predictions from local storage
        const predictions = localStorage.getItem('cropPredictions');
        if (predictions) {
            setCropPredictions(JSON.parse(predictions));
        }

        // Fetch market data for default regions
        fetchMarketDataForDistricts(['Mumbai', 'Thane', 'Raigad', 'Palghar']);
    }, []);

    const fetchMarketData = async (district) => {
        const url = 'https://api.data.gov.in/resource/35985678-0d79-46b4-9ed6-6f13308a1d24';
        const params = {
            'api-key': '579b464db66ec23bdd000001c4f17efbf65d4f8c705ebff27d8edeb1',
            'format': 'json',
            'filters[State.keyword]': 'Maharashtra',
            'filters[District.keyword]': district,
            'filters[Commodity.keyword]': 'Apple', // Example commodity, you can adjust this based on prediction
            'filters[Arrival_Date]': '25-01-2025'
        };

        try {
            const response = await axios.get(url, { params });
            if (response.data.records && response.data.records.length > 0) {
                const minPrice = parseInt(response.data.records[0].Min_Price);
                const maxPrice = parseInt(response.data.records[0].Max_Price);
                return { district, minPrice, maxPrice };
            } else {
                return { district, minPrice: 'N/A', maxPrice: 'N/A' };
            }
        } catch (error) {
            console.error('Error fetching market data for district:', district, error.message);
            return { district, minPrice: 'N/A', maxPrice: 'N/A' };
        }
    };

    const fetchMarketDataForDistricts = async (districts) => {
        const priceData = await Promise.all(districts.map(district => fetchMarketData(district)));
        setLocalPrices(priceData);
    };

    const handleLogoutClick = () => {
        console.log("User logged out"); // Replace with actual logout logic
    };

    const handleCropPredictionClick = () => {
        setShowPopup(false);
        navigate("/Croppred");
    };

    const handleClosePopup = () => {
        setShowPopup(false);
    };

    return (
        <div
            className="relative flex size-full min-h-screen flex-col bg-[#fafcf8] group/design-root overflow-x-hidden"
            style={{ fontFamily: 'Manrope, "Noto Sans", sans-serif' }}
        >
            <div className="layout-container flex h-full grow flex-col">
                {/* Sidebar for mobile */}
                <div
                    className={`fixed left-0 top-0 h-full w-64 bg-white text-[#131811] transform ${
                        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    } transition-transform duration-300 z-30`}
                >
                    <div className="p-6 relative">
                        <h2 className="text-xl font-bold text-[#131811]">AgroVision AI</h2>
                        <button
                            onClick={() => setSidebarOpen(false)} // Close the sidebar
                            className="absolute top-4 right-4 text-[#131811] text-xl"
                        >
                            &#10005; {/* Cross icon */}
                        </button>
                        <nav className="mt-8 space-y-4">
                            <a href="#" className="block text-base font-medium text-[#131811] hover:underline" onClick={() => navigate("/")}>
                                Home
                            </a>
                            <a href="#" className="block text-base font-medium text-[#131811] hover:underline" onClick={() => navigate("/Contact")}>
                                Contact Us
                            </a>
                            <a href="#" className="block text-base font-medium text-[#131811] hover:underline" onClick={handleLogoutClick}>
                                Logout
                            </a>
                        </nav>
                    </div>
                </div>

                {/* Main content */}
                <div className="flex flex-col w-full h-full">
                    {/* Header */}
                    <header className="flex items-center justify-between w-full border-b border-solid border-[#f2f4f0] px-8 py-4">
                        <div className="flex items-center gap-8">
                            <div className="flex items-center gap-4 text-[#131811]">
                                <div className="size-8">
                                    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            fillRule="evenodd"
                                            clipRule="evenodd"
                                            d="M24 4H6V17.3333V30.6667H24V44H42V30.6667V17.3333H24V4Z"
                                            fill="currentColor"
                                        ></path>
                                    </svg>
                                </div>
                                <h2 className="text-[#131811] text-xl font-bold">AgriVision</h2>
                            </div>
                        </div>

                        {/* Mobile menu toggle */}
                        <button
                            className="sm:hidden text-[#131811] text-2xl"
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                        >
                            &#9776;
                        </button>

                        {/* Desktop menu */}
                        <nav className="hidden sm:flex gap-8">
                            <a className="text-[#131811] text-base font-medium" href="#" onClick={() => navigate("/welcome")}>
                                Home
                            </a>
                            <a className="text-[#131811] text-base font-medium" href="#" onClick={() => navigate("/Contact")}>
                                Contact Us
                            </a>
                            <a className="text-[#131811] text-base font-medium" href="#" onClick={handleLogoutClick}>
                                Logout
                            </a>
                        </nav>
                    </header>

                    {showPopup && (
                        <div className="fixed inset-0 flex items-center justify-center z-50">
                            <div className="absolute inset-0 bg-black opacity-50"></div>
                            <div className="relative bg-white rounded-lg shadow-lg p-8 max-w-sm mx-auto">
                                <button
                                    className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
                                    onClick={handleClosePopup}
                                >
                                    &#10005;
                                </button>
                                <h3 className="text-xl font-bold mb-4 text-center">Check Crop Prediction</h3>
                                <p className="text-gray-700 mb-4 text-center">
                                    First check which crops grow best in your soil.
                                </p>
                                <button
                                    className="w-full bg-[#80e619] text-[#141b0e] font-bold py-2 px-4 rounded"
                                    onClick={handleCropPredictionClick}
                                >
                                    Crop Prediction
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="px-40 flex flex-1 justify-center py-5">
                        <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
                            <div className="@container">
                                <div className="@[480px]:p-4">
                                    <div
                                        className="flex min-h-[300px] flex-col gap-6 bg-cover bg-center bg-no-repeat @[480px]:gap-8 @[480px]:rounded-xl items-start justify-center px-4 pb-10 @[480px]:px-10"
                                        style={{
                                            backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.4) 100%), url("https://cdn.usegalileo.ai/sdxl10/432286b6-d049-481a-bee2-96483212878e.png")',
                                        }}
                                    >
                                        <h1
                                            className="text-white text-4xl font-black leading-tight tracking-[-0.033em] @[480px]:text-5xl @[480px]:font-black @[480px]:leading-tight @[480px]:tracking-[-0.033em] text-center"
                                        >
                                            Find out what's growing in your area
                                        </h1>
                                    </div>
                                </div>
                            </div>
                            <h3 className="text-[#141b0e] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">Local markets</h3>
                            <div className="grid grid-cols-[repeat(auto-fit,minmax(158px,1fr))] gap-3 p-4">
                                <div className="flex flex-col gap-3 pb-3">
                                    <div
                                        className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-xl"
                                        style={{ backgroundImage: 'url("https://cdn.usegalileo.ai/sdxl10/2531a8b3-9d0b-4a62-a3ca-4f74df4b94ae.png")' }}
                                    ></div>
                                    <p className="text-[#141b0e] text-base font-medium leading-normal">Berkeley Farmers' Market</p>
                                </div>
                                <div className="flex flex-col gap-3 pb-3">
                                    <div
                                        className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-xl"
                                        style={{ backgroundImage: 'url("https://cdn.usegalileo.ai/sdxl10/3f78513d-a567-4e0d-aeab-e58213bcae92.png")' }}
                                    ></div>
                                    <p className="text-[#141b0e] text-base font-medium leading-normal">CUESA &amp; The Ferry Plaza Farmers Market</p>
                                </div>
                                <div className="flex flex-col gap-3 pb-3">
                                    <div
                                        className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-xl"
                                        style={{ backgroundImage: 'url("https://cdn.usegalileo.ai/sdxl10/6e74cd20-7887-491b-8e08-efb96d8d1b2e.png")' }}
                                    ></div>
                                    <p className="text-[#141b0e] text-base font-medium leading-normal">Marin Country Mart Farmers' Market</p>
                                </div>
                                <div className="flex flex-col gap-3 pb-3">
                                    <div
                                        className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-xl"
                                        style={{ backgroundImage: 'url("https://cdn.usegalileo.ai/sdxl10/04b3fc8d-a87f-4250-bb4f-da4a6a9991c6.png")' }}
                                    ></div>
                                    <p className="text-[#141b0e] text-base font-medium leading-normal">Grand Lake Farmers Market</p>
                                </div>
                                <div className="flex flex-col gap-3 pb-3">
                                    <div
                                        className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-xl"
                                        style={{ backgroundImage: 'url("https://cdn.usegalileo.ai/sdxl10/48d9c3b2-66a9-4f1a-bd19-54842c36bd62.png")' }}
                                    ></div>
                                    <p className="text-[#141b0e] text-base font-medium leading-normal">Jack London Square Farmers Market</p>
                                </div>
                                <div className="flex flex-col gap-3 pb-3">
                                    <div
                                        className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-xl"
                                        style={{ backgroundImage: 'url("https://cdn.usegalileo.ai/sdxl10/9f341fb9-b33d-4480-84aa-0204ba28c1a0.png")' }}
                                    ></div>
                                    <p className="text-[#141b0e] text-base font-medium leading-normal">Old Oakland Farmers Market</p>
                                </div>
                            </div>
                            <h3 className="text-[#141b0e] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">Predicted crops</h3>
                            <div className="grid grid-cols-[repeat(auto-fit,minmax(158px,1fr))] gap-3 p-4">
                                <div className="flex flex-col gap-3 pb-3">
                                    <div
                                        className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-xl"
                                        style={{ backgroundImage: 'url("https://cdn.usegalileo.ai/sdxl10/ec4834d5-8be4-49b8-847f-c35a22dd4dbf.png")' }}
                                    ></div>
                                    <div>
                                        <p className="text-[#141b0e] text-base font-medium leading-normal">Tomato</p>
                                        <p className="text-[#73974e] text-sm font-normal leading-normal">₹180 per kg</p>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-3 pb-3">
                                    <div
                                        className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-xl"
                                        style={{ backgroundImage: 'url("https://cdn.usegalileo.ai/sdxl10/a3ef1a65-5978-4309-ab19-cc89bacad34d.png")' }}
                                    ></div>
                                    <div>
                                        <p className="text-[#141b0e] text-base font-medium leading-normal">Maize</p>
                                        <p className="text-[#73974e] text-sm font-normal leading-normal">₹60 per ear</p>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-3 pb-3">
                                    <div
                                        className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-xl"
                                        style={{ backgroundImage: `url(${lentilsImage})` }}

                                    ></div>
                                    <div>
                                        <p className="text-[#141b0e] text-base font-medium leading-normal">Lentil</p>
                                        <p className="text-[#73974e] text-sm font-normal leading-normal">₹40 per head</p>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-3 pb-3">
                                    <div
                                        className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-xl"
                                        style={{ backgroundImage: `url(${appleImage})` }}

                                    ></div>
                                    <div>
                                        <p className="text-[#141b0e] text-base font-medium leading-normal">Apple</p>
                                        <p className="text-[#73974e] text-sm font-normal leading-normal">₹240 per pint</p>
                                    </div>
                                </div>
                            </div>
                            <h3 className="text-[#141b0e] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">Local prices</h3>
                            <div className="grid grid-cols-[repeat(auto-fit,minmax(158px,1fr))] gap-3 p-4">
                                {localPrices.length > 0 ? (
                                    localPrices.map((price, index) => (
                                        <div key={index} className="flex flex-col gap-3 pb-3">
                                            <div>
                                                <p className="text-[#141b0e] text-base font-medium leading-normal">{price.district}</p>
                                                <p className="text-[#73974e] text-sm font-normal leading-normal">Min Price: ₹{price.minPrice} Max Price: ₹{price.maxPrice}</p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p>No price data available.</p>
                                )}
                            </div>
                            <div className="flex px-4 py-3">
                                <button
                                    className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 flex-1 bg-[#80e619] text-[#141b0e] text-sm font-bold leading-normal tracking-[0.015em]"
                                    onClick={handleCropPredictionClick}
                                >
                                    <span className="truncate">Use AI to find the most suitable crops for your soil</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    <Footer /> {/* Add the Footer component here */}
                </div>
            </div>
        </div>
    );
};

export default Market;