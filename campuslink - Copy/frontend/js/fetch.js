async function fetchPosts() {
  try {
    const res = await fetch("http://localhost:5000/api/posts");
    if (!res.ok) throw new Error("Failed to fetch posts");

    const posts = await res.json();
    const container = document.getElementById("postsContainer");
    container.innerHTML = "";

    if (posts.length === 0) {
      container.innerHTML = "<p>No posts found.</p>";
      return;
    }

    posts.forEach(post => {
      const postDiv = document.createElement("div");
      postDiv.classList.add("post");

      postDiv.innerHTML = `
        <h3>${post.title}</h3>
        <p><strong>Type:</strong> ${post.type}</p>
        <p>${post.description}</p>
        ${post.image ? `<img src="http://localhost:5000/uploads/${post.image}" alt="Image" style="max-width: 100%; height: auto; margin-top: 10px;" />` : ""}
        <p><em>Posted on: ${new Date(post.date).toLocaleDateString()}</em></p>
        <hr/>
      `;
      container.appendChild(postDiv);
    });
  } catch (error) {
    document.getElementById("postsContainer").innerHTML = `<p>Error: ${error.message}</p>`;
  }
}

window.onload = fetchPosts;
