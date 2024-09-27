import React, { useEffect, useState } from 'react'
import Navbar from '../../components/Navbar'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../../utils/axiosInstance';
import TravelStoryCard from '../../components/Cards/TravelStoryCard';

const Home = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null)
  const [allStories, setAllStories] = useState([])
  const [countStories, setCountStories] = useState(0);
  // http://localhost:3000/api/v1/user/get-user
  // Get user info
  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get("/user/get-user");
      // Set user info if data exists
      setUserInfo(response.data.user);
    } catch (error) {
      console.log(error)
      if(error.response.user){
        // Clear storage if anauthorized
        localStorage.clear();
        navigate("/login");
      }
    }
  };

  // Get all stories
  const getAllStories = async () => {
    try {
      const response = await axiosInstance.get("/story/get-all-stories");
      if(response.data && response.data.stories) {
        setAllStories(response.data.stories)
      }
      if(response.data && response.data.stories) {
        setCountStories(response.data.stories.length)
      }
      console.log(countStories)
    } catch (error) {
      console.log("An error occured")
    }
  }

  // Handle Edit Story Click
  const handleEdit = (data) => {}

  // Handle Travel Story Click
  const handleViewStory = (data) => {}

  // Handle Update Favourite
  const updateIsFavorite = async (storyData) => {
    const storyId = storyData._id;
    try {
      const response = await axiosInstance.put("/story/updateUrFav/" + storyId, {
        isFavorite: !storyData.isFavorite
      })
      if(response.data && response.data.story){
        getAllStories();
      }
    } catch (error) {
      console.log("An error occured");
    }
  }

  useEffect(() => { 
    getAllStories();
    getUserInfo(); 
    
    return () => {}
  }, [])
  return (
    <>
      <Navbar userInfo={userInfo} count={countStories}/>
      <div className='container mx-auto py-10'>
        <div className='flex gap-7'>
          <div className='flex-1'>
          {allStories.length > 0 ? (
            <div className='grid grid-cols-3 gap-4'>
              {allStories.map((item) => {
                return <TravelStoryCard 
                key={item._id}
                imgUrl={item.imageUrl}
                title={item.title}
                story={item.story}
                date={item.visitedDate}
                visitedLocation={item.visitedLocation}
                isFavorite={item.isFavorite}
                onEdit={() => handleEdit(item)}
                onClick={() => handleViewStory(item)}
                onIsFavoriteClick={() => updateIsFavorite(item)}
                />;
              })}
            </div>
          ) : (
            <>Empty Card here</>
          )}
          </div>
        </div>
      </div>
    </>
  )
}


export default Home