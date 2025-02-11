import React from 'react';
import NavBar from '../components/NavBar';
import Section1 from '../components/section1';
import Footer from '../components/Footer';
import Services from '../components/Services';
import Contact from '../components/Contact'
import '../css/Home.css';

function Home() {
    return (
        <div className="home">
            <div className="content">
                <NavBar />
                <Section1 />
                <Services />
                <Contact />
                <Footer />
            </div>
        </div>

    )
}

export default Home