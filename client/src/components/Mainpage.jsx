import { useNavigate } from 'react-router-dom';

export function Mainpage() {

    const navigate = useNavigate();

    return (
        <>
            <h1>Admin Dashboard</h1><br></br>
            <button onClick={() => navigate('/addUser')}>Add New User</button>
            <p>Show All Users</p>
            <p>Upload Publication</p>
            <p>Show All Publication</p>
            <p>My Uploads</p>
        </>
    )
}


