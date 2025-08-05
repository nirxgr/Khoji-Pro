import React, { useContext, useEffect, useState } from 'react'
import Header from '../../components/Header.tsx'
import { Link, useNavigate } from 'react-router-dom';
import Hero from '../../components/HeroSection.tsx'
import { assets } from '../../assets/assets.js';
import './home.css';
import { AppContext } from '../../context/AppContext.jsx';
import axios from 'axios';


interface IUser {
    _id: number,
    firstName: string;
    lastName: string;
    email: string;
}

const Home = () => {
    const { backendUrl } = useContext(AppContext);
    const [search, setSearch] = useState('');
    const [userList, setUserList] = useState<IUser[]>([]);
    const navigate = useNavigate();


    useEffect(() => {
        if (!search.trim()) {
            setUserList([]);
            return;
        }

        const delayDebounce = setTimeout(() => {
            axios.get(`${backendUrl}/api/user/search?query=${search}`)
                .then(res => {
                    setUserList(res.data);
                    console.log(userList);
                })
                .catch(err => {
                    console.error('Search failed:', err);
                    setUserList([]);
                });
        }, 100); 

        return () => clearTimeout(delayDebounce);
    }, [search, backendUrl]);

    
      return (
        <div className='main'>
            <Header />
            <Hero />
            <div className="search-bar">
                <img src={assets.search}className='search-icon'/>
                    <input type="text" placeholder="Search for professionals" className="search-input" value={search} onChange={(e) => setSearch(e.target.value)}/>
                    <button className="search-button">Search</button>
            </div>


            {search.trim() === '' ?(
                <>
                    <div className='content'>
                        <h1>Explore Professional Categories</h1>
                        <p>Discover verified professionals across various fields</p>
                    </div>

                    <div className='content-group'>
                        <div className='content-card'>
                            <h2>UI/UX Designers</h2>
                            <p>Experts in user experience and interface design</p>
                            <h4>850+ Professionals</h4>
                        </div>
                        <div className='content-card'>
                            <h2>Developers</h2>
                            <p>Code builders for web, mobile, and software</p>
                            <h4>3000+ Professionals</h4>
                        </div>
                        <div className='content-card'>
                            <h2>Data Analysts</h2>
                            <p>Insight extractors from complex data sets</p>
                            <h4>700+ Professionals</h4>
                        </div>
                        <div className='content-card'>
                            <h2>QA Engineers</h2>
                            <p>Testers ensuring software quality and reliability</p>
                            <h4>600+ Professionals</h4>
                        </div>
                    </div>
                </>
            ) : ( 
                <>
                    <div className="record-count">
                        <p>{userList.length} users found.</p>
                    </div>
            
            
                    <div className="search-results">
                        {userList.length > 0 ? (
                            userList.map((user: IUser) => (
                                <div onClick={ () => navigate(`/profile/${user._id}`)} key={user.email} className="result-card">
                                    <p>{user.firstName} {user.lastName}</p>
                                    <p>Email: {user.email }</p>
                                </div>
                            ))
                        ) : (
                            search && <p>No users found.</p>
                        )}
                    </div>
                
                </>
            )}

        </div>
    );
};


export default Home