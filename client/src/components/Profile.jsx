import { useEffect, useState } from "react";

function Profile() {

	var [userInfo, setUserInfo] = useState({});

	useEffect(() => {
		console.log('Api call for fetching profile details goes here.');
		setTempUserInfo();
	}, []);

	const setTempUserInfo = () => {
		let info = {
			name: 'Manan Patel',
			picSvg: '',
			dob: '12/01/1999',
			email: 'mpate133@asu.edu',
			totalDocContribution: 5,
			ownedDocs: [
				{
					docName: 'Owned demo doc 1',
				},
				{
					docName: 'Owned demo doc 2'
				},
				{
					docName: 'Owned demo doc 3'
				}
			],
			sharedDocs: [
				{
					docName: 'Shared doc with Jay'
				},
				{
					dosName: 'Shared doc with Swapnil'
				}
			]
		};

		setUserInfo(info);
	};

	return (
		<div>
			Profile Page
		</div>
	);
}

export default Profile;
