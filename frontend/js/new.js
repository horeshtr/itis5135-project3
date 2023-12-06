"use strict";

// get the post button and form elements
const postButton = document.querySelector("button[type=submit]");

const form = document.querySelector("form");
const requiredFields = form.querySelectorAll("[required]");

// set fetch url
const url = "http://localhost:3000/blogs";

// get the error notification elements
const errorMessageContainer = document.querySelector(".notification-container");
const errorMessageDiv = document.querySelector(".notification");
const errorMessageClose = document.querySelector(".close");

// Add functionality to the post button
form.addEventListener("submit", createNewPost);

// Query the server for the blogs data
async function fetchItemCount() {
    try {
        const response = await fetch(url);
        if(!response.ok)
            throw Error(`Error ${response.url} ${response.statusText}`);
        
        // calculate total number of blogs and the required number of pages
        const itemCount = parseInt(response.headers.get('x-total-count'));
        return itemCount;
        
    } catch(error) {
        errorMessageDiv.innerHTML = "";
        errorMessageContainer.classList.remove("hidden");
        const errorMessageP = document.createElement("p");
        errorMessageDiv.appendChild(errorMessageP);
        errorMessageP.innerHTML = error.message;

        errorMessageClose.addEventListener("click", () => {
            errorMessageContainer.classList.add("hidden");    
        })
    }
}

// check form validity, PUT new post to the server
async function createNewPost(e) {

    e.preventDefault();
    const isValid = form.reportValidity();

    const inputs = document.querySelectorAll("input");
    const textArea = document.querySelector("textarea");

    const title = inputs[0].value;
    const author = inputs[1].value;
    const content = textArea.value;
    
    // fetch item count
    const itemCount = await fetchItemCount();

    const id = itemCount + 1;
    const date = new Date();
    const profile = "images/default.jpeg";

    const newPost = {id, title, author, date, profile, content};

    if (isValid) {
        
        // write newPost data to the server
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(newPost)
            });

            if (!response.ok) {
                throw Error(`Error ${response.url} ${response.statusText}`)
            }
            
        } catch(error) {
            errorMessageDiv.innerHTML = "";
            errorMessageContainer.classList.remove("hidden");
            const errorMessageP = document.createElement("p");
            errorMessageDiv.appendChild(errorMessageP);
            errorMessageP.innerHTML = error.message;

            errorMessageClose.addEventListener("click", () => {
                errorMessageContainer.classList.add("hidden");    
            })
        }
    
    // reset the form
    form.reset();

    // return to the landing page
    window.location.href = "/index.html";
  }
}
