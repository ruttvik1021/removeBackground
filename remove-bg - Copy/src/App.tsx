import axios from "axios";
import { useEffect, useState } from "react";

const App = () => {
  const [image, setImage] = useState<any>();
  const [displayImage, setDisplayImage] = useState<any>();
  const [selectedBgColor, setSelectedBgColor] = useState<any>();
  const [backgroundImage, setBackgroundImage] = useState<any>();
  const [colorsArray, setColorsArray] = useState<any>();
  const [loading, setLoading] = useState(false);
  const [backgroundRemoved, setBackgroundRemoved] = useState(false);

  const settingImage = (image: any) => {
    setBackgroundRemoved(false);
    const file = image;
    const reader = new FileReader();
    reader.onloadend = () => {
      console.log("image", reader.result);
      setDisplayImage(reader.result);
    };
    reader.readAsDataURL(file);
    setImage(image);
  };

  const headers = {
    "ngrok-skip-browser-warning": "69420",
  };

  const backgrounds = [
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRMaoDBCRJLgAIEJb7PFfnlE4S6gxwNPgPOnKtAUGbxl-zcjuN3dp-KFVvi7RpHUS8dXMg&usqp=CAU",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwIbCAy87ISO32oSLE2CR9fMvtN4CavXfdCRLsixIwbYW9N8SSeuJU8LU1u6YJjwotlUA&usqp=CAU",
    "https://img.freepik.com/free-vector/hand-painted-watercolor-pastel-sky-background_23-2148902771.jpg?w=2000",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRMmDXrn-5hjWZ3iLWqwilPWJ63EwgO-pL5ZnTSM0UBILx7thbIXs0za2KdvwZCeyuRef8&usqp=CAU",
    "https://png.pngtree.com/thumb_back/fh260/background/20200714/pngtree-modern-double-color-futuristic-neon-background-image_351866.jpg",
    "https://static.vecteezy.com/system/resources/thumbnails/022/749/462/small/abstract-dark-grey-with-pink-light-line-and-text-on-blank-space-for-text-design-modern-luxury-futuristic-background-illustration-vector.jpg",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRTXFkRNKFlmQ_dtfyGdxHAEGWKpt5Z5y8EMyOriS--BUHbUzpmEYUl72vu6knUWhqvaXE&usqp=CAU",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQfrYOc5YyODyLGh6T2KZITNPQLhOA_Y6oMTaaXmHFA9Mv7yB1xHrVPHz7s2hTwATF-38A&usqp=CAU",
    "https://cdn.fstoppers.com/styles/large-16-9/s3/lead/2018/02/how-to-paint-digital-backdrops-1.jpg",
  ];

  const refreshColor = () => {
    let colors = [];
    for (let i = 0; i < 10; i++) {
      let randomColor = Math.floor(Math.random() * 16777215).toString(16);
      colors.push(`#${randomColor}`);
    }
    setColorsArray(colors);
  };

  useEffect(() => {
    refreshColor();
  }, []);

  const removeBg = () => {
    setSelectedBgColor("");
    setBackgroundImage("");
    const formData = new FormData();
    formData.append("Image", image);

    const url =
      "https://bca2-49-248-88-42.ngrok-free.app/api/BackgronudRemove/processImage";

    try {
      setLoading(true);
      axios
        .post(url, formData, { headers })
        .then((res: any) => {
          setDisplayImage(`data:image/png;base64,${res?.data}`);
          setLoading(false);
          setBackgroundRemoved(true);
        })
        .catch((err: any) => {
          console.log(err);
          setLoading(false);
          setBackgroundRemoved(false);
        });
    } catch (error) {
      setLoading(false);
      setBackgroundRemoved(false);
      console.log(error);
    }
  };

  const backgroundStyle = {
    backgroundColor: selectedBgColor,
    backgroundImage: `url(${backgroundImage})`,
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "50px",
        width: "100%",
      }}
    >
      <div style={{ marginRight: "50px" }}>
        <p>Upload Image</p>
        {displayImage ? (
          <img
            src={displayImage}
            alt=""
            width={"300px"}
            style={backgroundStyle}
          />
        ) : (
          <div>
            <input
              type="file"
              name=""
              id=""
              onChange={(e: any) => settingImage(e.target.files[0])}
            />
          </div>
        )}
        <div>
          {image && (
            <>
              {!loading && (
                <button
                  onClick={() => {
                    setImage(null);
                    setDisplayImage(null);
                    setBackgroundRemoved(false);
                  }}
                  style={{ marginRight: "10px" }}
                >
                  {" "}
                  Clear{" "}
                </button>
              )}
              {!backgroundRemoved && (
                <button onClick={() => removeBg()} disabled={loading}>
                  {loading ? "Loading..." : "Remove Background"}
                </button>
              )}
            </>
          )}
        </div>
      </div>
      <div>
        <p>Themes</p>
        <div>Solid Colors</div>
        <div>
          {colorsArray?.map((item: any) => (
            <button
              onClick={() => {
                setSelectedBgColor(item);
                setBackgroundImage(null);
              }}
              disabled={loading}
              style={{
                backgroundColor: item,
                marginRight: "10px",
              }}
            ></button>
          ))}
          <button onClick={refreshColor}>Refresh Colors</button>
        </div>
        <br />
        <br />
        <div>
          {backgrounds?.map((item: any) => (
            <button
              onClick={() => {
                setBackgroundImage(item);
                setSelectedBgColor(null);
              }}
              disabled={loading}
            >
              <img src={item} alt="" width="100px" height="100px" />
            </button>
          ))}
          {backgroundRemoved && (
            <button
              onClick={() => {
                setBackgroundImage("");
                setSelectedBgColor("");
              }}
              disabled={loading}
            >
              <img
                src="https://png.pngtree.com/png-vector/20190411/ourmid/pngtree-vector-cross-icon-png-image_925896.jpg"
                alt="Img"
                width="100px"
                height="100px"
              />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
