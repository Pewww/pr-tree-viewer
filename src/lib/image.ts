import {
  getIconForFile,
  getIconForFolder,
  getIconForOpenFolder
} from 'vscode-icons-js';

export const getImageOfFileExtension = (fileName: string) => {
  const image = new Image();
  image.src = require(`../assets/icons/${getIconForFile(fileName)}`);

  return image;
};

export const getImageOfOpenedFolder = () => {
  const image = new Image();
  image.src = require(`../assets/icons/${getIconForOpenFolder('')}`);

  return image;
};

export const getImageOfClosedFolder = () => {
  const image = new Image();
  image.src = require(`../assets/icons/${getIconForFolder('')}`);

  return image;
};
