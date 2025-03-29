import axios from "axios";

import FormData from "form-data"; // Import FormData

const API_KEY = "6d207e02198a847aa98d0a2a901485a5"; // Freeimage.host API Key

// ✅ Function to Convert File to Base64
// function convertFileToBase64(filePath) {
//   const fileBuffer = fs.readFileSync(filePath);
//   return fileBuffer.toString("base64");
// }

// ✅ Controller Function for Uploading Images
export const uploadImage = async (req, res, next) => {
  try {
    if (!req.body.image) {
      req.imageUrl = "";
      next();
      // res.status(400).json({ message: "Empty Image String" });
    } else {
      // const imagePath = req.file.path; // Get the file path
      const base64Data = req.body.image;

      // Delete the locally saved file to free up space

      // ✅ Prepare FormData
      const formData = new FormData();
      formData.append("key", API_KEY); // Freeimage API Key
      formData.append("action", "upload");
      formData.append("source", base64Data); // Ensure it's a file stream

      // ✅ Send the request
      const response = await axios.post(
        "https://freeimage.host/api/1/upload",
        formData
      );

      req.imageUrl = response.data.image.url; // Get the uploaded image URL
      next();
    }
    // Pass to the next middleware
  } catch (error) {
    console.error(
      "Image upload error:",
      error.response ? error.response.data : error.message
    );
    return res.status(500).json({ error: "Image upload failed" });
  }
};
