import { useEffect } from "react";

function Profile() {

	useEffect(() => {
		console.log('Api call for fetching profile details goes here.');

	})

	return (
		<div>
			Profile Page
		</div>
	);
}

export default Profile;
