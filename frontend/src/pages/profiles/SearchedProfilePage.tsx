import { useParams } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AppContext } from '../../context/AppContext.jsx';
import './Profile.css'
import Header from '../../components/Header';


interface IUser {
    firstName: string;
    lastName: string;
    email: string;
    bio: string;
    experienceYears: number;
    profession: string;
    skills: string[];
    location: string;
    linkedid: string;
    github: string;
    languages: string[];
}


const SearchedProfilePage = () => {
    const { id } = useParams();
    const [user, setUser] = useState<IUser | null>(null);
    const { backendUrl } = useContext(AppContext);

    useEffect(() => {
        axios.get(`${backendUrl}/api/user/${id}`)
            .then((res) => setUser(res.data))
            .catch((err) => console.log(err));
    }, [id]);

    if (!user) return <p>No user found</p>;

    return (
        
        <div className="main">
            <Header />
            <div className="profile-container">
                <div className='profile-header'>
                    <div className="profile-picture initial">{user?.firstName?.[0]?.toUpperCase()}</div>
                    <div className="profile-name">
                        <h2>{user.firstName || '---'} {user.lastName || '---'}</h2>
                        <p className="email">{user.email || '---'}</p>
                        <p className="location">📍 {user.location || '---'}</p>
                    </div>
                </div>
                <div className="profile-section">
                    <h3 className="profile-section-title">Bio</h3>
                    <div className="profile-bio">
                        {user.bio || '---'}
                    </div>
                </div>

                <div className="profile-section">
                    <h3 className="profile-section-title">Professional Info</h3>
                    <div className="profile-info-grid">
                        <p><strong>Profession:</strong> {user.profession || '---'} </p>
                        <p><strong>Experience:</strong> {user.experienceYears || '---'} years</p>
                        <p><strong>Languages:</strong> {user.languages?.length ? user.languages.join(', ') : '---'} </p>
                    </div>
                </div>

                <div className="profile-section">
                    <h3 className="profile-section-title">Skills</h3>
                    <div className="profile-skills">
                        {user.skills?.length ? (
                        user.skills.map((skill, index) => (
                            <span key={index} className="skill-tag">{skill}</span>
                        ))
                        ) : (
                        <span className="skill-tag">---</span>
                        )}
                    </div>
                </div>

                <div className="profile-section">
                    <h3 className="profile-section-title">Social</h3>
                    <div className="social-links">
                        <a href={user.github || "#"} target="_blank" rel="noopener noreferrer"> GitHub Profile</a>
                        <a href={user.linkedid || "#"} target="_blank" rel="noopener noreferrer">LinkedIn Profile</a>
                    </div>
                </div>

            </div>
 
        </div>
    );
};

export default SearchedProfilePage;
