import React, { useState } from 'react';

const AdminUserForm = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        // Add more fields as needed
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Form validation
        const newErrors = {};
        if (!formData.firstName.trim()) {
            newErrors.firstName = 'First name is required';
        }
        if (!formData.lastName.trim()) {
            newErrors.lastName = 'Last name is required';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        // Call API endpoint to update/add user data
        try {
            const response = await fetch('/api/user', {
                method: 'POST', // or PUT/PATCH for updating
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            if (!response.ok) {
                throw new Error('Failed to update/add user data');
            }
            // Handle success
            console.log('User data updated/added successfully');
        } catch (error) {
            console.error(error);
        }
    };

    return (
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
                {errors.firstName && <span>{errors.firstName}</span>}
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
                {errors.lastName && <span>{errors.lastName}</span>}
            </div>
            {/* Add more fields as needed */}
            <button type="submit">Submit</button>
        </form>
    );
};

export default AdminUserForm;
