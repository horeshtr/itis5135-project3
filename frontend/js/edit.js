"use strict";

const id = new URLSearchParams(window.location.search).get("id");
const url = `http://localhost:3000/blogs/${id}`;

// get the form, input, and submit button elements
const form = document.querySelector("form");
const titleBox = form.querySelector("#title");
const contentBox = form.querySelector("#content");
const submitButton = form.querySelector("button");

// get the error notification elements
const errorMessageContainer = document.querySelector(".notification-container");
const errorMessageDiv = document.querySelector(".notification");
const errorMessageClose = document.querySelector(".close");

// create an empty variable for blog data
let blog;

// event listeners
window.addEventListener("DOMContentLoaded", fetchBlog); 
submitButton.addEventListener("click", updateBlog);

// fetch blog data
async function fetchBlog() {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw Error(`Error ${response.url} ${response.statusText}`);
        }

        blog = await response.json();

        populateForm();
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

// populate the form with existing data
function populateForm() {
    titleBox.value = blog.title;
    contentBox.value = blog.content;
}

// update the server data with edited form data
async function updateBlog(e) {
    if (form.reportValidity()) {
        e.preventDefault();

        blog.title = titleBox.value;
        blog.content = contentBox.value;

        try {
            const response = await fetch(url, {
                method: "PUT",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(blog)
            });
    
            if (!response.ok) {
                throw Error(`Error ${response.url} ${response.statusText}`)
            }
            
            window.location.href = `/details.html?id=${id}`;
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
}