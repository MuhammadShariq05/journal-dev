import no_search from "../assets/icons/not_found.svg"
import no_filer_data from "../assets/icons/no_filter_data.svg"
import emptyImage from "../assets/icons/quill-svgrepo-com.svg"


export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^/s@]+$/;
  return regex.test(email);
}

export const getInitials = (username) => {
  if(!username) return ""
  const words = username.split(" ");
  let initials = "";

  for(let i = 0; i < Math.min(words.length, 2); i++){
    initials += words[i].charAt(0).toUpperCase();
  }

  return initials;
}

export const getEmptyCardMessage = (filterType) => {
  switch(filterType){
    case "search":
      return `Oops! No stories found matching your search`;
    case "date":
      return `No stories found in the given date range`;
    default:
      return ``
  }
}


export const getEmptyImage = (filterType) => {
  switch(filterType){
    case "search":
      return no_search
    case "date":
      return no_filer_data
    default: 
      return emptyImage
  }
}