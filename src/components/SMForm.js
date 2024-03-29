import React, { useState } from "react";
import { storage } from "../firebase/firebase";

const SMPostURL = "http://localhost:3000/social_media_posts";

export default function SMForm(props) {
  const [message, setMessage] = useState("");
  const [image, setImage] = useState(null);
  const [url, setURL] = useState("");
  const [progress, setProgress] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(url);
    // const formData = new FormData();

    fetch(SMPostURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.token}`,
      },
      body: JSON.stringify({
        social_media_post: { message: message, featured_image: url },
      }),
    })
      .then((response) => response.json())
      .then((SMP) => props.addPost(SMP));

    setMessage("");
    setImage("");
    setURL("");
  };

  const handleChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleUpload = (e) => {
    e.preventDefault();
    const uploadTask = storage.ref(`/images/${image.name}`).put(image);
    uploadTask.on(
      "state_changed",
      (snapShot) => {
        const progress = Math.round(
          (snapShot.bytesTransferred / snapShot.totalBytes) * 100
        );
        setProgress(progress);
      },
      (err) => {
        console.log(err);
      },
      () => {
        storage
          .ref("images")
          .child(image.name)
          .getDownloadURL()
          .then((url) => {
            setURL(url);
          });
      }
    );
  };

  return (
    <div className="SMFormDiv">
      <form
        encType="multipart/form-data"
        onSubmit={handleSubmit}
        className="SMForm"
      >
        <label htmlFor="message">
          What's on your mind, {props.user.username}?
        </label>
        <textarea
          rows="6"
          cols="50"
          className="MessageInput"
          type="text"
          onChange={(e) => setMessage(e.target.value)}
          value={message}
          required
        />
        <input
          type="file"
          className=".UploadInput"
          accept="image/png, image/jpeg"
          onChange={handleChange}
        ></input>
        {image ? (
          <h3 onClick={handleUpload} className="Upload">
            Upload image
          </h3>
        ) : (
          <p>✿ Please upload an image ✿</p>
        )}
        {url ? (
          <input type="submit" />
        ) : (
          <progress className="Progress" value={progress} max="100" />
        )}
      </form>
    </div>
  );
}
