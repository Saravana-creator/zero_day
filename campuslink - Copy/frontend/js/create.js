document.getElementById("postForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const title = document.getElementById("title").value;
  const description = document.getElementById("description").value;
  const type = document.getElementById("type").value;
  const imageFile = document.getElementById("image").files[0];

  // Use dummy token for now; replace with real token after auth is ready
  const token = "Bearer test123456789";

  const formData = new FormData();
  formData.append("title", title);
  formData.append("description", description);
  formData.append("type", type);
  if (imageFile) {
    formData.append("image", imageFile);
  }

  try {
    const res = await fetch("http://localhost:5000/api/posts", {
      method: "POST",
      headers: {
        "Authorization": token  // No Content-Type header; browser sets it for multipart
      },
      body: formData
    });

    const data = await res.json();

    if (res.ok) {
      document.getElementById("msg").textContent = "Post created successfully!";
      document.getElementById("msg").className = "success";
      document.getElementById("msg").style.display = "block";
      document.getElementById("postForm").reset();
    } else {
      document.getElementById("msg").textContent = data.message || "Error creating post.";
      document.getElementById("msg").className = "error";
      document.getElementById("msg").style.display = "block";
    }
  } catch (err) {
    console.error(err);
    document.getElementById("msg").textContent = "Server error.";
    document.getElementById("msg").className = "error";
    document.getElementById("msg").style.display = "block";
  }
});
