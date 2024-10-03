import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { MdAdd } from "react-icons/md";
import Modal from "react-modal";
import TravelStoryCard from "../../components/Cards/TravelStoryCard";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AddEditStory from "./AddEditStory";
import ViewTravelStory from "./ViewTravelStory";
import EmptyCard from "../../components/Cards/EmptyCard";
import { DayPicker } from "react-day-picker";
import moment from "moment";
import FilterInfoTitle from "../../components/Cards/FilterInfoTitle";
import { getEmptyCardMessage, getEmptyImage } from "../../utils/helper";
import dateimg from "../../assets/icons/datepicker.svg"
import dateRemoveImg from "../../assets/icons/date-remove.svg"

const Home = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [allStories, setAllStories] = useState([]);
  const [countStories, setCountStories] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("");
  const [dateRange, setDateRange] = useState({ from: null, to: null });
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);

  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type: "add",
    data: null,
  });

  const [openViewModal, setOpenViewModal] = useState({
    isShown: false,
    data: null,
  });
  // http://localhost:3000/api/v1/user/get-user
  // Get user info
  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get("/user/get-user");
      // Set user info if data exists
      setUserInfo(response.data.user);
    } catch (error) {
      console.log(error);
      if (error.response.user) {
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
      if (response.data && response.data.stories) {
        setAllStories(response.data.stories);
      }
      if (response.data && response.data.stories) {
        setCountStories(response.data.stories.length);
      }
      console.log(countStories);
    } catch (error) {
      console.log("An error occured");
    }
  };

  // Handle Edit Story Click
  const handleEdit = (data) => {
    setOpenAddEditModal({ isShown: true, type: "edit", data: data });
  };

  // Handle Travel Story Click
  const handleViewStory = (data) => {
    setOpenViewModal({ isShown: true, data });
  };

  // Handle Update Favourite
  const updateIsFavorite = async (storyData) => {
    const storyId = storyData._id;
    try {
      const response = await axiosInstance.put(
        "/story/updateUrFav/" + storyId,
        {
          isFavorite: !storyData.isFavorite,
        }
      );

      if (response.data && response.data.story) {
        if (!storyData.isFavorite) {
          toast.success("Added to Favorites");
        } else {
          toast.info("Removed from Favorites");
        }

        if(filterType === "search" && searchQuery){
          onSearchStory(searchQuery)
        }else if (filterType === "date"){
          filterStoriesByDate(dateRange);
        }else{getAllStories()}
      }
    } catch (error) {
      console.log("An error occurred");
    }
  };

  // Delete Story
  const deleteStory = async (data) => {
    const storyId = data._id;

    try {
      const response = await axiosInstance.delete(
        "/story/delete-story/" + storyId
      );
      if (response.data && !response.data.error) {
        toast.error("Deleted Successsfully");
        setOpenViewModal((prevState) => ({ ...prevState, isShown: false }));
        getAllStories();
      }
    } catch (error) {
      console.log("Unexpected Error occurred, Please try again");
    }
  };

  // Search stories
  const onSearchStory = async (query) => {
    try {
      const response = await axiosInstance.get("/search", {
        params: {
          query,
        },
      });

      if (response.data && response.data.stories) {
        setFilterType("search");
        setAllStories(response.data.stories);
      }
    } catch (error) {
      console.log("Unexpected Error occurred, Please try again");
    }
  };

  const handleClearSearch = () => {
    setFilterType("");
    getAllStories();
  };

  const filterStoriesByDate = async (day) => {
    try {
      const startDate = day.from ? moment(day.from).valueOf() : null;
      const endDate = day.to ? moment(day.to).valueOf() : null;

      if (startDate && endDate) {
        const response = await axiosInstance.get("/filter", {
          params: {
            startDate,
            endDate,
          },
        });

        if(response.data && response.data.stories){
          setFilterType("date")
          setAllStories(response.data.stories)
        }
      }
    } catch (error) {
      console.log("Unexpected Error occurred, Please try again");
    }
  };

  const handleDayClick = (day) => {
    setDateRange(day);
    filterStoriesByDate(day);
  };

  const resetFilter = () => {
    setDateRange({ from: null, to: null })
    setFilterType("")
    getAllStories();
  }


  useEffect(() => {
    getAllStories();
    getUserInfo();

    return () => {};
  }, []);
  
  return (
    <>
      <Navbar
        userInfo={userInfo}
        count={countStories}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearchNote={onSearchStory}
        handleClearSearch={handleClearSearch}
      />
      <div className="container mx-auto py-10">
        <FilterInfoTitle filterType={filterType} filterDates={dateRange} onClear={() => {
          resetFilter();
        }}/>
        <div className="flex gap-7">
          <div className="flex-1">
            {allStories.length > 0 ? (
              <div className="grid grid-cols- gap-4">
                {allStories.map((item) => {
                  return (
                    <TravelStoryCard
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
                    />
                  );
                })}
              </div>
            ) : (
              <EmptyCard imgSrc={getEmptyImage(filterType)} message={getEmptyCardMessage(filterType)} />
            )}
          </div>
          {/* Date Picker  */}
          
        </div>
      </div>
      {/* Date Picker Sidebar */}
      <div
          className={`fixed top-0 right-0 h-full w-[350px] bg-white border-l transition-transform transform ${
            isDatePickerVisible ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="p-4">
            <button
              onClick={() => setIsDatePickerVisible(false)}
              className="bg-cyan-500 text-white px-4 py-2 rounded-full mb-4"
            >
              Close Date Picker
            </button>
            <DayPicker
              captionLayout="dropdown-buttons"
              mode="range"
              selected={dateRange}
              onSelect={handleDayClick}
              pagedNavigation
            />
          </div>
        </div>

        {/* Toggle Button */}
        <button
          onClick={() => setIsDatePickerVisible(!isDatePickerVisible)}
          className="fixed top-20 right-0 bg-cyan-500 text-white px-4 py-2 rounded-l-md"
        >
          {isDatePickerVisible ? "Hide" : "Show"} Date Picker
        </button>
      {/* Add & Edit Travel Story Modal */}
      <Modal
        isOpen={openAddEditModal.isShown}
        onRequestClose={() => {}}
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.2)",
            zIndex: 999,
          },
        }}
        appElement={document.getElementById("root")}
        className="modal-box"
      >
        <AddEditStory
          type={openAddEditModal.type}
          storyInfo={openAddEditModal.data}
          onClose={() => {
            setOpenAddEditModal({ isShown: false, type: "add", data: null });
          }}
          getAllStories={getAllStories}
        />
      </Modal>

      {/* View Modal */}
      <Modal
        isOpen={openViewModal.isShown}
        onRequestClose={() => {}}
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.2)",
            zIndex: 999,
          },
        }}
        appElement={document.getElementById("root")}
        className="modal-box"
      >
        <ViewTravelStory
          storyInfo={openViewModal.data || null}
          onClose={() => {
            setOpenViewModal((prevState) => ({ ...prevState, isShown: false }));
          }}
          onEditClick={() => {
            setOpenViewModal((prevState) => ({ ...prevState, isShown: false }));
            handleEdit(openViewModal.data || null);
          }}
          onDeleteClick={() => {
            deleteStory(openViewModal.data || null);
          }}
        />
      </Modal>

      <button
        className="w-16 h-16 flex items-center justify-center rounded-full bg-primary hover:bg-cyan-400 fixed right-10 bottom-10"
        onClick={() => {
          setOpenAddEditModal({ isShown: true, type: "add", data: null });
        }}
      >
        <MdAdd className="text-[32px] text-white" />
      </button>
      <ToastContainer />
    </>
  );
};

export default Home;
