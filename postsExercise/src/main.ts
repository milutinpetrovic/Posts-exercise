// Define interface for Post
interface Post {
  id: number;
  title: string;
  author: string;
}

function parseElement(id: string, elementType: "input" | "select" | "form") {
  const findElement = document.getElementById(id);

  if (!findElement) {
    return null;
  }

  if (elementType === "input" && findElement instanceof HTMLInputElement) {
    return findElement;
  } else if (elementType === "select" && findElement instanceof HTMLSelectElement) {
    return findElement;
  } else if (elementType === "form" && findElement instanceof HTMLFormElement) {
    return findElement;
  }

  return null;
}

// Function to create a new post
async function createNewPost() {
  const titleInput = parseElement("titleInput", "input")?.value.trim();
  const authorInput = parseElement("authorInput", "input")?.value.trim();

  if (!titleInput || !authorInput) {
    alert('Please enter both title and author.');
    return;
  }

  // POST request to the server to create a new post
  const response = await fetch('http://localhost:3000/posts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title: titleInput, author: authorInput }),
  });

  if (response.ok) {
    alert('New post created successfully!');
  } else {
    alert('Error creating post.');
  }


}
// Declare 'posts' as an array of Post objects
let posts: Post[] = [];

// Function to fetch posts
async function fetchPosts() {
  try {
    //GET request to the server to fetch posts
    const response = await fetch('http://localhost:3000/posts');
    if (response.ok) {
      posts = await response.json();

      // Display posts in the postsContainer
      const postsContainer = document.getElementById('postsContainer');

      if (postsContainer) {
        postsContainer.innerHTML = '';

        posts.forEach(post => {
          const postElement = document.createElement('div');
          postElement.innerHTML = `
            <p>ID: ${post.id}</p>
            <p>Title: ${post.title}</p>
            <p>Author: ${post.author}</p>
            <button onclick="deletePost(${post.id})">Delete Post</button>
            <hr>
          `;
          postsContainer.appendChild(postElement);
        });
      } else {
        throw new Error("Element with id 'postsContainer' not found.");
      }
    } else {
      const errorMessage = await response.text();
      throw new Error(`Error fetching posts: ${errorMessage}`);
    }
  } catch (error: any) {
    console.error(error.message);
    alert('An error occurred while fetching posts.');
  }
}

// Function to delete a post
async function deletePost(postId: number) {
  try {
    // Make a DELETE request to the server to delete the specified post
    const response = await fetch(`http://localhost:3000/${postId}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      alert('Post deleted successfully!');
      // Refresh the posts after deletion
      fetchPosts();
    } else {
      const errorMessage = await response.text();
      throw new Error(`Error deleting post: ${errorMessage}`);
    }
  } catch (error: any) {
    console.error(error.message);
    alert('An error occurred while deleting the post.');
  }
}

// Initial fetch of posts when the page loads
fetchPosts();
