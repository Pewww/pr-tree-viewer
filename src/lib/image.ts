export const getImageOfOpenedFolder = () => {
  const image = new Image();
  image.src = require('../assets/icons/default_folder_opened.svg');

  return image;
};

export const getImageOfClosedFolder = () => {
  const image = new Image();
  image.src = require('../assets/icons/default_folder.svg');

  return image;
};
