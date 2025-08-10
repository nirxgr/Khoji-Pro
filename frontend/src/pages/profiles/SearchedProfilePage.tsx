import { useParams } from 'react-router-dom';
import { useContext, useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { AppContext } from '../../context/AppContext.jsx';
import './Profile.css'
import Header from '../../components/Header';
import { assets } from '../../assets/assets.js';
import { toast } from 'react-toastify';


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
    coverPictureUrl: string;
    profilePictureUrl: string;
}


const SearchedProfilePage = () => {
    const { id } = useParams();
    const [user, setUser] = useState<IUser | null>(null);
    const [reloadUser, setReloadUser] = useState(false);
    const { backendUrl } = useContext(AppContext);
    const [open, setOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);  
    const profileInputRef = useRef<HTMLInputElement>(null);
    const coverInputRef = useRef<HTMLInputElement>(null);


    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState<IUser | null>(null);

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        axios.get(`${backendUrl}/api/user/${id}`)
            .then((res) => {
                setUser(res.data);
                setReloadUser(false);
            })
            .catch((err) => console.log(err));
    }, [id, reloadUser]);

     useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        }
        if (open) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [open]);

        if (!user) return <p>No user found</p>;

    const handleProfileClick = () => {
        profileInputRef.current?.click();
    };

    const handleCoverClick = () => {
        coverInputRef.current?.click();
    };

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>,type: "profile" | "cover") => {
        const file = event.target.files?.[0];
        if (!file) return;

        setLoading(true);

        const data = new FormData();
        data.append("file", file);
        data.append("upload_preset", "khojipro");
        data.append("cloud_name", "dfuxutqkg");

        try {
            const res = await fetch("https://api.cloudinary.com/v1_1/dfuxutqkg/image/upload",{
                method: "POST",
                body: data,
            });

            const uploadedImage = await res.json();
            try {
                const endpoint =
                    type === "profile" ? "/api/update/updateProfilePic" : "/api/update/updateCoverPic";

                const { data } = await axios.post(backendUrl + endpoint, {
                    imageUrl: uploadedImage.url,
                });

                if (data.success) {
                    setReloadUser(true);
                    setOpen(false);
                    toast.success(data.message);
                } else {
                    toast.error(data.message);
                }
            } catch (err) {
                toast.error(err.message);
            }
        } catch (error) {
            console.error("Upload failed", error);
        } finally {
            setLoading(false);
        }
  };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (!formData) return;
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };
    
    const handleSave = async () => {
        if (!formData) return;

        try {
            const { data } = await axios.post(backendUrl + "/api/update/updateProfileDetails", formData);

            if (data.success) {
                setReloadUser(true);
                setShowForm(false);
                toast.success(data.message || "Profile updated successfully");
            } else {
                toast.error(data.message || "Failed to update profile");
            }
        } catch (error) {
            toast.error("Error updating profile");
        }
    };

    const handleCancel = () => {
        setShowForm(false);
        setFormData(null);
    };

    return (
        
        <div className="main">
            <Header />
            <div className="profile-container">
                <div className="profile-header">
                    <div className='cover-container' ref={containerRef}>
                        <img src={user.coverPictureUrl} alt="cover-photo"className='cover-photo' />

                        <button className="edit-icon-btn" onClick={() => setOpen(prev => !prev)}>
                            <img src={assets.pencil} alt="edit-icon" className="edit-icon"/>
                        </button>

                        {open && (
                            <div className="photo-dropdown">
                                <div className="photo-element" onClick={handleProfileClick}>
                                    Edit Profile Picture
                                </div>
                                <input
                                    type="file"
                                    accept="image/*"
                                    ref={profileInputRef}
                                    style={{ display: "none" }}
                                    onChange={(e) => handleFileUpload(e, "profile")}
                                />

                                <div className="photo-element" onClick={handleCoverClick}>
                                    Edit Cover Picture
                                </div>
                                <input
                                    type="file"
                                    accept="image/*"
                                    ref={coverInputRef}
                                    style={{ display: "none" }}
                                    onChange={(e) => handleFileUpload(e, "cover")}
                                />
                            </div>
                        )}
                    </div>

                    {loading && (
                        <div className="loading-spinner"></div>
                    )}

                    
                    <div className="profile-picture">
                        <img src={user.profilePictureUrl} alt="profile-photo" />
                    </div>
                    
                    <div className="profile-section-first">
                        <div className="profile-name">
                            <h2>{user?.firstName || '---'} {user.lastName || '---'}</h2>
                            <button className="edit-btn" onClick={() => {
                                if (user) setFormData(user);
                                setShowForm(true);
                            }}>
                            <img src={assets.pencil} alt="edit-icon" className="edit-icon"/>
                            </button>
                            {showForm && (
                                <div className="modal-overlay">
                                    <div className="modal-content">
                                        <h2>Edit Profile</h2>
                                        <p>First Name</p>
                                        <input
                                        type="text" name="firstName" 
                                        value={formData?.firstName || ""} onChange={handleChange}
                                        />
                                        <p>Last Name</p>
                                        <input type="text" name="lastName" 
                                        value={formData?.lastName}onChange={handleChange}
                                        />
                                        <p>Profession</p>
                                        <input type="text" name="profession"
                                        value={formData?.profession} onChange={handleChange}
                                        />
                                        <p>Location</p>
                                        <input type="text" name="location" 
                                        value={formData?.location}onChange={handleChange}
                                        />
                                        <p>Bio</p>
                                        <textarea name="bio" 
                                        value={formData?.bio}onChange={handleChange}
                                        />

                                        <div className="modal-buttons">
                                        <button onClick={handleSave} className="save-btn">Save</button>
                                        <button onClick={handleCancel} className="cancel-btn">Cancel</button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <p className="email">{user.profession || '---'}</p>
                            <p className="email">{user.email || '---'}</p>
                            <p className="location">
                                <img src={assets.location} alt="location icon" className="location-icon" />
                                {user.location || '---'}
                            </p>
                           
                        </div>
                        <div className="profile-bio">
                            {user.bio || '---'}
                        </div>
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
