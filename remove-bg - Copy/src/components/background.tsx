import { createRef, useEffect, useState } from "react";
import axios from "axios";
import FormData from "form-data";
// import fs from "fs";

const Background = () => {
  let firstImgRef = createRef<any>();
  const [image, setImage] = useState<string | null>("");
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [backgroundColor, setBackgroundColor] = useState<string | null>(null);
  const [binaryString, setBinaryString] = useState<string>("");
  const [imageType, setImageType] = useState<string>("");

  const removeBackground = async () => {
    const formData = new FormData();
    formData.append("size", "auto");
    formData.append("image_file_b64", binaryString);

    try {
      const response = await axios.post(
        "https://api.remove.bg/v1.0/removebg",
        formData,
        {
          responseType: "arraybuffer",
          headers: {
            "Content-Type": "multipart/form-data",
            "X-Api-Key": "BhLuZysJvVLEUct1Bpy7knnp",
          },
        }
      );

      if (response.status !== 200) {
        console.error("Error:", response.status, response.statusText);
        return;
      }

      console.log("responseImage", response.data);
      const base64String = arrayBufferToBase64(response.data);
      console.log("base64String", base64String);
      // setImage(response.data);
      setImage(imageType + "," + base64String);
    } catch (error) {
      console.error("Request failed:", error);
    }
  };

  const removeBackground1 = async () => {
    let payload = {
      image: binaryString,
    };

    const response = await axios.post(
      "http://localhost:3001/api/image/removebg",
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status !== 200) {
      console.error("Error:", response.status);
      return;
    }
    const base64String = arrayBufferToBase64(response.data);
    console.log("base64String", base64String);
    // setImage(response.data);
    setImage(imageType + "," + base64String);
  };

  const arrayBufferToBase64 = (arrayBuffer: any) => {
    const uint8Array = new Uint8Array(arrayBuffer);
    let binaryString = "";
    for (let i = 0; i < uint8Array.length; i++) {
      binaryString += String.fromCharCode(uint8Array[i]);
    }
    return btoa(binaryString);
  };

  const handleFileChange = async (event: any) => {
    const file = event.target.files[0];
    if (file) {
      try {
        const result: any = await convertImageToBinary(file);
        setBinaryString(result);
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  const convertImageToBinary = (file: any) => {
    return new Promise((resolve, reject) => {
      const reader: any = new FileReader();
      reader.onloadend = () => {
        const imageType1 = reader.result.split(",")[0];
        setImageType(imageType1);
        const base64String = reader.result.split(",")[1];
        setImage(imageType1 + "," + base64String);
        resolve(base64String);
      };
      reader.onerror = (error: any) => {
        reject(error);
      };
      reader.readAsDataURL(file);
    });
  };

  const containerColorStyle = {
    width: "500px",
    height: "300px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: `${backgroundColor}`,
  };
  const containerImageStyle = {
    width: "500px",
    height: "300px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundImage: `url(${backgroundImage})`,
  };

  const imageStyle = {
    maxWidth: "100%",
    maxHeight: "100%",
  };

  const colors = ["#264653", "#2A9D8F", "#E9C46A", "#F4A261", "#E76F51"];

  const imageUrls = [
    "https://i.ytimg.com/vi/h8ahuAprENc/maxresdefault.jpg",
    "http://thestoeckmann.com/wp-content/uploads/2020/05/35-North-America-Rocky-Mountains.jpg",
    "https://i.pinimg.com/736x/c9/50/2c/c9502ccdc0b302e187cf1d496731d413.jpg",
    "https://media.istockphoto.com/photos/colorful-nebula-in-space-360-degrees-3d-panorama-vr-background-picture-id891430598?k=6&m=891430598&w=0&h=qyHQTd_3aazcp3GiYAuT6_TDJ7QfYICB_TTeGtmVvCk=",
    "https://naldzgraphics.net/wp-content/uploads/2012/03/15-Blue.jpg",
  ];

  return (
    <div>
      <div>
        <div className="d-flex">
          <button onClick={() => firstImgRef?.current?.click()}>
            Add Image
          </button>
          <input
            id="myInput"
            type="file"
            ref={firstImgRef}
            onChange={(e: any) => handleFileChange(e)}
            style={{ display: "none" }}
            accept="image/png, image/jpeg, image/jpg"
          />
          <button onClick={removeBackground1}>Remove Background</button>
        </div>
        <div
          style={backgroundColor ? containerColorStyle : containerImageStyle}
        >
          {image && <img src={image} alt="Image" style={imageStyle} />}
        </div>
      </div>
      <div style={{ display: "flex" }}>
        {colors.map((item: any) => (
          <p
            style={{
              backgroundColor: item,
              width: "100px",
            }}
            onClick={() => {
              setBackgroundColor(item);
              setBackgroundImage(null);
            }}
          >
            {item}
          </p>
        ))}{" "}
      </div>
      <div style={{ display: "flex" }}>
        {imageUrls.map((item: any) => (
          <>
            <img
              src={item}
              alt="Image"
              width={"250px"}
              height={"250px"}
              onClick={() => {
                setBackgroundColor(null);
                setBackgroundImage(item);
              }}
            />
          </>
        ))}
      </div>
    </div>
  );
};

export default Background;
