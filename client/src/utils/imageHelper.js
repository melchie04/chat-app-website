export const uploadImage = (image) => {
  return new Promise((resolve, reject) => {
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "chat-app-website");
    data.append("cloud_name", "melchorcallos04");
    fetch("https://api.cloudinary.com/v1_1/melchorcallos04/image/upload", {
      method: "post",
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {
        resolve(data.url.toString());
      })
      .catch((err) => {
        console.log(err);
        reject(err);
      });
  });
};

export const createGroupImage = (text) => {
  const canvasWidth = 200;
  const canvasHeight = 200;
  const fontSize = 100;
  const fontFamily = "Arial";
  const canvas = document.createElement("canvas");
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  const context = canvas.getContext("2d");
  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, canvasWidth, canvasHeight);
  const randomColor = getRandomVisibleColor();
  context.fillStyle = randomColor;
  context.font = `${fontSize}px ${fontFamily}`;
  context.textBaseline = "middle";
  context.textAlign = "center";
  const x = canvasWidth / 2;
  const y = canvasHeight / 2;
  context.fillText(text.charAt(0).toUpperCase(), x, y);
  return canvas.toDataURL("image/jpeg");
};

function getRandomVisibleColor() {
  const minBrightness = 100;
  const randomR = Math.floor(
    Math.random() * (255 - minBrightness) + minBrightness
  );
  const randomG = Math.floor(
    Math.random() * (255 - minBrightness) + minBrightness
  );
  const randomB = Math.floor(
    Math.random() * (255 - minBrightness) + minBrightness
  );
  return `rgb(${randomR}, ${randomG}, ${randomB})`;
}
