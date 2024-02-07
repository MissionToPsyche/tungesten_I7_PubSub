import styled from 'styled-components';

function Home() {
    return (
        <div>
            <HomeImg src="https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=2072&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="satellite" />
            <ProjectName>PubSub Respository</ProjectName>
            <ProjectDesc>
                Welcome to the NASA Psyche Mission PubSub Respository, a centralized platform dedicated to archiving, managing, and sharing content
                related to the groundbreaking Psyche mission.
            </ProjectDesc>
            <KeyFeat className="home__feature">Key Features</KeyFeat>
            <Feat>
                <li>Efficient Management: Seamlessly organize and manage mission data for quick retrieval and analysis.</li>
                <li>View and download documents</li>
                <li>Collaborative Sharing: Facilitate collaboration and knowledge sharing among team members and stakeholders.</li>
            </Feat>

            <Goal>
                Our goal is to provide NASA and its collaborators with a robust platform for centralized content management,
                facilitating efficient data sharing and collaboration throughout the Psyche mission.
            </Goal>
        </div>
    )
}

export default Home

const HomeImg = styled.img`
width: 100%;
height: 300px;
object-fit: cover;
`

const ProjectName = styled.p`
font-size: 3rem;
margin-left: 2rem;
color: #333;
font-weight: normal;
`

const ProjectDesc = styled.p`
font-size: 19px;
margin-left: 2rem;
color: #302114;
font-weight: normal;
`

const KeyFeat = styled.p`
font-size: 2rem;
margin-left: 2rem;
color: #333;
`

const Feat = styled.ul`
font-size: 19px;
margin-left: 2rem;
color: #302114;
font-weight: normal;
`

const Goal = styled.p`
font-size: 19px;
margin: 2rem;
color: #302114;
font-weight: normal;
`
