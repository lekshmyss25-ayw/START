let currentEditingId = null;

window.onload = function() {
    getPosts();
};

function toggleForm() {
    const formContainer = document.getElementById("newPostFormContainer");
    if (formContainer.style.display === "none" || formContainer.style.display === "") {
        formContainer.style.display = "block";
    } else {
        formContainer.style.display = "none";
        resetFormState(); 
    }
}

function resetFormState() {
    currentEditingId = null;
    const formTitle = document.getElementById("formTitleText");
    const submitBtn = document.getElementById("submitBtn");
    
    if (formTitle) formTitle.innerText = "Add a New Post-It";
    if (submitBtn) submitBtn.value = "Submit Post";
    
    document.getElementById("title").value = "";
    document.getElementById("author").value = "";
    document.getElementById("body").value = "";
    document.getElementById("category").value = "";
}


async function handleFormSubmit() {
    const author = document.getElementById("author").value.trim();
    const title = document.getElementById("title").value.trim();
    const body = document.getElementById("body").value.trim();
    const category = document.getElementById("category").value.trim();

    const payload = { author, title, body, category };
    
    let url = 'http://localhost:5000/posts';
    let method = 'POST';

    
    if (currentEditingId) {
        url = `http://localhost:5000/posts/${currentEditingId}`;
        method = 'PUT';
    }

    try {
        const response = await fetch(url, {
            method: method, 
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            document.getElementById("responseMsg").innerText = currentEditingId ? "Post updated successfully!" : "Post created successfully!";
            document.getElementById("responseMsg").style.color = "green";
            resetFormState();
            toggleForm(); 
            getPosts(); 
        } else {
            const result = await response.json();
            document.getElementById("responseMsg").innerText = result.error || "Operation failed";
            document.getElementById("responseMsg").style.color = "red";
        }
    } catch (err) {
        document.getElementById("responseMsg").innerText = "Network error connecting to backend.";
        document.getElementById("responseMsg").style.color = "red";
    }
}


function addPostIt() {
    handleFormSubmit();
}


async function getPosts() {
    const listContainer = document.getElementById("postit-list");
    const searchInput = document.getElementById("searchBar");
    const searchQuery = searchInput ? searchInput.value.trim() : "";
    
    listContainer.innerHTML = "<li>Loading items...</li>";
    
    let targetUrl = 'http://localhost:5000/posts';
    if (searchQuery) {
        targetUrl += `?search=${encodeURIComponent(searchQuery)}`;
    }

    try {
        const response = await fetch(targetUrl);
        const responseData = await response.json();
        const posts = Array.isArray(responseData) ? responseData : (responseData.data || []);

        listContainer.innerHTML = ""; 

        if (posts.length === 0) {
            listContainer.innerHTML = "<li>No post-its found.</li>";
            return;
        }

        posts.forEach(post => {
            const postDate = post.createdAt ? new Date(post.createdAt) : new Date();
            const formattedDate = postDate.toLocaleDateString('en-IN', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
            
            });

            const contentString = post.content || post.body || '';

            const listItem = document.createElement("li");
            listItem.style.marginBottom = "15px";
            listItem.innerHTML = `
                <div class="text" style="font-size: 1.1rem; font-weight: normal; flex: 1;">
                    <strong>${post.title}</strong> [${post.category}]<br>
                    <p style="margin-top: 5px; background: #fffbcc; padding: 8px; border-left: 3px solid #ffda6a; font-size: 1.1rem;">${contentString}</p>
                    <span style="font-size: 0.85rem; color: #555;">
                        By: <em>${post.author}</em> • <small style="color: #888;">${formattedDate}</small>
                    </span>
                </div>
                <!-- Added operational UI action buttons using your CSS class links -->
                <button class="move-button" onclick="prepareUpdate('${post._id}', '${escapeJS(post.title)}', '${escapeJS(post.author)}', '${escapeJS(contentString)}', '${escapeJS(post.category)}')">Edit</button>
                <button class="delete-button" onclick="deletePostIt('${post._id}')">Delete</button>
            `;
            listContainer.appendChild(listItem);
        });

    } catch (err) {
        listContainer.innerHTML = "<li style='color: red;'>Error pulling list items from database.</li>";
    }
}


function prepareUpdate(id, title, author, content, category) {
    currentEditingId = id;
    
    const formTitle = document.getElementById("formTitleText");
    const submitBtn = document.getElementById("submitBtn");
    
    if (formTitle) formTitle.innerText = "Edit Post-It Note";
    if (submitBtn) submitBtn.value = "Update Post";
    
    document.getElementById("title").value = title;
    document.getElementById("author").value = author;
    document.getElementById("body").value = content;
    document.getElementById("category").value = category;
    
    document.getElementById("newPostFormContainer").style.display = "block";
    window.scrollTo({ top: 0, behavior: 'smooth' });
}


async function deletePostIt(id) {
    if (!confirm("Are you sure you want to remove this post-it note?")) return;
    try {
        const response = await fetch(`http://localhost:5000/posts/${id}`, { method: "DELETE" });
        if (response.ok) {
            document.getElementById("responseMsg").innerText = "Post-it deleted successfully.";
            document.getElementById("responseMsg").style.color = "green";
            getPosts();
        } else {
            const result = await response.json();
            document.getElementById("responseMsg").innerText = result.error || "Delete failed.";
            document.getElementById("responseMsg").style.color = "red";
        }
    } catch (err) {
        document.getElementById("responseMsg").innerText = "Error deleting from database.";
        document.getElementById("responseMsg").style.color = "red";
    }
}


function escapeJS(str) {
    return str.replace(/'/g, "\\'").replace(/"/g, '&quot;').replace(/\n/g, '\\n');
}
