
window.onload = function() {
    getPosts();
};


function toggleForm() {
    const formContainer = document.getElementById("newPostFormContainer");
    if (formContainer.style.display === "none") {
        formContainer.style.display = "block";
    } else {
        formContainer.style.display = "none";
    }
}

         async function addPostIt() {
                  
            const author = document.getElementById("author").value.trim()
            const title = document.getElementById("title").value.trim()
            const body = document.getElementById("body").value.trim()
            const category = document.getElementById("category").value.trim()

        try {
       
        const response = await fetch('http://localhost:5000/posts', {
            method: "POST", 
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ author, title, body, category })
        });

        const result = await response.json();
        
        if (response.ok) {
            document.getElementById("responseMsg").innerText = "Post created successfully!";

            document.getElementById("title").value = "";
            document.getElementById("author").value = "";
            document.getElementById("body").value = "";
            document.getElementById("category").value = "";
            

            toggleForm(); // Hide form away again
            getPosts();
        } else {
            document.getElementById("responseMsg").innerText = result.error || "Failed to create post";
        }
    } catch (err) {
        document.getElementById("responseMsg").innerText = "Network error connecting to backend.";
    }
}


            //Frontend - Backend Connection
            const response = await fetch('http://localhost:5000/posts',{
                method:"POST" , 
                headers:{"Content-Type":"application/json"},
                body : JSON.stringify({author , title , body, category})
            });

            const result = await response.json();
            document.getElementById("responseMsg").innerText = result.message



            async function getPosts() {
    const listContainer = document.getElementById("postit-list");
    listContainer.innerHTML = "<li>Loading items...</li>";

    try {
        const response = await fetch('http://localhost:5000/posts');
        const responseData = await response.json();

        const posts = Array.isArray(responseData) ? responseData : (responseData.data || []);

        listContainer.innerHTML = ""; 

        if (posts.length === 0) {
            listContainer.innerHTML = "<li>No post-its found. Try creating one!</li>";
            return;
        }

        posts.forEach(post => {
            const listItem = document.createElement("li");
            listItem.style.marginBottom = "15px";
            listItem.innerHTML = `
                <strong>${post.title}</strong> [${post.category}]<br>
                <em>By: ${post.author}</em><br>
                <p style="margin-top: 5px; background: #fa83ba; padding: 8px; border-left: 3px solid #78dfd5;">${post.content}</p>
            `;
            listContainer.appendChild(listItem);
        });

    } catch (err) {
        listContainer.innerHTML = "<li style='color: red;'>Error pulling list items from database.</li>";
    }
}
