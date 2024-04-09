import React, { useState, useEffect } from 'react';
import './UserUpdate.css'; // Import your CSS file
//user update and updating the details of the user
const UserUpdate = ({ username }) => {
    const [user, setUser] = useState({});
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        dateOfBirth: '',
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        // Fetch user data based on username and populate the form fields
        const fetchUser = async () => {
            try {
                const response = await fetch(`https://api.example.com/users/${username}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch user data');
                }
                const userData = await response.json();
                setUser(userData);
                setFormData({
                    firstName: userData.firstName,
                    lastName: userData.lastName,
                    email: userData.email,
                    dateOfBirth: userData.dateOfBirth || '', // Assuming dateOfBirth is a string
                });
            } catch (error) {
                console.error(error);
            }
        };

        fetchUser();
    }, [username]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        setErrors({
            ...errors,
            [e.target.name]: '',
        });
    };
    //handling the submit and validating the input data
    const handleSubmit = async (e) => {
        e.preventDefault();
        // Validate form data
        const newErrors = {};
        if (!formData.firstName.trim()) {
            newErrors.firstName = 'First name is required';
        }
        if (!formData.lastName.trim()) {
            newErrors.lastName = 'Last name is required';
        }
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Invalid email format';
        }
        if (!formData.dateOfBirth.trim()) {
            newErrors.dateOfBirth = 'Date of birth is required';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            // Call API endpoint to update user data
            const response = await fetch(`https://api.example.com/users/${username}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            if (!response.ok) {
                throw new Error('Failed to update user data');
            }
            alert('User data updated successfully');
        } catch (error) {
            console.error(error);
            alert('Failed to update user data');
        }
    };
    //form to take input and updating the details.
    return (
        <div className="update-user-container">
            <h2>Update User</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="firstName">First Name:</label>
                    <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                    />
                    {errors.firstName && <div>{errors.firstName}</div>}
                </div>
                <div>
                    <label htmlFor="lastName">Last Name:</label>
                    <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                    />
                    {errors.lastName && <div>{errors.lastName}</div>}
                </div>
                <div>
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                    />
                    {errors.email && <div>{errors.email}</div>}
                </div>
                <div>
                    <label htmlFor="dateOfBirth">Date of Birth:</label>
                    <input
                        type="date"
                        id="dateOfBirth"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                    />
                    {errors.dateOfBirth && <div>{errors.dateOfBirth}</div>}
                </div>
                <button type="submit">Update</button>
            </form>
        </div>
    );
};

export default UserUpdate;
