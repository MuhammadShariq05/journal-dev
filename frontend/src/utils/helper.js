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