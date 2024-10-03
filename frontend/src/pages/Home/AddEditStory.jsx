import React, { useState } from "react";
import { MdAdd, MdClose, MdUpdate, MdDeleteOutline } from "react-icons/md";
import DateSelector from "../../components/Input/DateSelector";
import ImageSelector from "../../components/Input/ImageSelector";
import TagInput from "../../components/Input/TagInput";
import axiosInstance from "../../utils/axiosInstance";
import moment from "moment";
import { toast } from "react-toastify";
import uploadImage from "../../utils/uploadImage";

const AddEditStory = ({ storyInfo, type, onClose, getAllStories }) => {
  const [title, setTitle] = useState(storyInfo?.title || "");
  const [storyImg, setStoryImg] = useState(storyInfo?.imageUrl || null);
  const [story, setStory] = useState(storyInfo?.story || "");
  const [visitedLocation, setVisitedLocation] = useState( storyInfo?.visitedLocation || []);
  const [visitedDate, setVisitedDate] = useState(storyInfo?.visitedDate || null);
  const [error, setError] = useState("")

  // Add New Travel story
  const addNewTravelStory = async () => {
    try {
      let imageUrl = "";
      if(storyImg) {
        const imgUploadRes = await uploadImage(storyImg);
        // Get image Url
        imageUrl = imgUploadRes.imageUrl || "";
      }

      const response = await axiosInstance.post("/story/add-story" , {
        title,
        story,
        imageUrl: imageUrl || "",
        visitedLocation,
        visitedDate: visitedDate
          ? moment(visitedDate).valueOf()
          : moment().valueOf()
      })

      if(response.data && response.data.story){
        toast.success("Added Successfully");
        // Refresh
        getAllStories()
        // Close the form
        onClose();
      }
    } catch (error) {
      if(error.response && error.response.data && error.response.data.message){
        setError(error.response.data.message)
      }else{
        setError("Unexpected Error occurred, Please try again")
      }
    }
  }

  // Update travel story
const updateTravelStory = async () => {
  const storyId = storyInfo._id;

  try {
    let imageUrl = storyInfo.imageUrl || ""; // Keep the old image URL by default

    // Prepare the data for the API request
    const postData = {
      title,
      story,
      imageUrl,
      visitedLocation,
      visitedDate: visitedDate
        ? moment(visitedDate).valueOf()
        : moment().valueOf(),
    };

    // If the image has changed, upload the new image
    if (typeof storyImg === "object") {
      const imgUploadRes = await uploadImage(storyImg);
      imageUrl = imgUploadRes.imageUrl || "";

      // Update the postData with the new image URL
      postData.imageUrl = imageUrl;
    }

    // Send the update request to the server
    const response = await axiosInstance.put("/story/edit-story/" + storyId, postData);

    if (response.data && response.data.story) {
      toast.success("Updated Successfully");
      getAllStories();
      onClose();
    }
  } catch (error) {
    if (error.response && error.response.data && error.response.data.message) {
      setError(error.response.data.message);
    } else {
      setError("Unexpected Error occurred, Please try again");
    }
  }
};



  const handleAddOrUpdateClick = () => {
    if(!title) {
      setError("Please enter the title")
      return
    }
    if(!story) {
      setError("Please enter the story")
      return
    }

    setError("");

    if(type === "edit") {
      updateTravelStory();
    }else{
      addNewTravelStory()
    }
  };

  // Delete story image and Update story
  const handleDeleteImg = async () => {
    // Deleting the image 
    const deleteImgRes = await axiosInstance.delete("/story/delete-image" ,{
      params: {
        imageUrl: storyInfo.imageUrl,
      },
    });

    if(deleteImgRes.data){
      const storyId = storyInfo._id;
      const postData = {
        title,
        story,
        imageUrl,
        visitedLocation,
        visitedDate: visitedDate
          ? moment(visitedDate).valueOf()
          : moment().valueOf(),
      };
      // Updating story
      const response = await axiosInstance.put("/story/edit-story/" + storyId, postData)
      setStoryImg(null)
    }
  };

  return (
    <>
      <div className="relative">
        <div className="flex items-center justify-between">
          <h5 className="text-xl font-medium text-slate-700">
            {type === "add" ? "Add Story" : "Update Story"}
          </h5>

          <div>
            <div className="flex items-center gap-3 bg-cyan-50/50 p-2 rounded-l-lg">
              {type === "add" ? (
                <button className="btn-small" onClick={handleAddOrUpdateClick}>
                  <MdAdd className="text-lg" /> ADD STORY
                </button>
              ) : (
                <>
                  <button
                    className="btn-small"
                    onClick={handleAddOrUpdateClick}
                  >
                    <MdUpdate className="text-lg" /> UPDATE STORY
                  </button>

                  {/* <button className="btn-small btn-delete" onClick={onClose}>
                    <MdDeleteOutline className="text-lg" /> DELETE
                  </button> */}
                </>
              )}
              <button className="" onClick={onClose}>
                <MdClose className="text-xl text-slate-400 hover:text-rose-600" />
              </button>
            </div>
            {error && (<p className="text-red-500 text-xs pt-2 text-right">{error}</p>)}
          </div>
        </div>
        <div>
          <div className="flex-1 flex flex-col gap2 pt-4">
            <label className="input-label">TITLE</label>
            <input
              type="text"
              className="text-xl text-slate-950 outline-none"
              placeholder="Journal Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <div className="my-3">
              <DateSelector date={visitedDate} setDate={setVisitedDate} />
            </div>

            <ImageSelector
              image={storyImg}
              setImage={setStoryImg}
              handleDeleteImg={handleDeleteImg}
            />

            <div className="flex flex-col gap-2 mt-4">
              <label className="input-label">STORY</label>
              <textarea
                type="text"
                className="text-sm text-slate-950 outline-none bg-slate-50 p-2 rounded"
                placeholder="Your Chronicles of Thought..."
                rows={16}
                value={story}
                onChange={({ target }) => setStory(target.value)}
              />
            </div>
            <div className="pt-3">
              <label className="input-label">TAGS</label>
              <TagInput tags={visitedLocation} setTags={setVisitedLocation} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddEditStory;
