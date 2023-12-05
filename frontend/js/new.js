"use strict";

// get the post button and form elements
const postButton = document.querySelector("button[type=submit]");

const form = document.querySelector("form");
const requiredFields = form.querySelectorAll("[required]");
const inputs = document.querySelectorAll("input");
const textArea = document.querySelector("textarea");

const title = inputs[0].value;
const author = inputs[1].value;
const content = textArea.value;

const id = blogs.length;
const date = new Date();
const profile = "images/default.jpeg";

const newPost = {id, title, author, date, profile, content};

// set fetch url
const url = `http://localhost:3000/blogs/?id=${id}`;

// get the error notification elements
const errorMessageContainer = document.querySelector(".notification-container");
const errorMessageDiv = document.querySelector(".notification");

// Add functionality to the post button
form.addEventListener("submit", newPost);

// check form validity, PUT new post to the server
async function createNewPost(e) {
  
  const isValid = form.reportValidity();

  if (isValid) {
    e.preventDefault();
    
    // write newPost data to the server
    try {
        const response = await fetch(url, {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(newPost)
        });

        if (!response.ok) {
            throw Error(`Error ${response.url} ${response.statusText}`)
        }
        
        //window.location.href = "/";
    } catch(error) {
        console.log(error.message)
    }
    
    // reset the form
    form.reset();

    // return to the landing page
    window.location.href = "/index.html";

  } else {
    e.preventDefault();

    errorMessageDiv.innerHTML = "";
    errorMessageContainer.classList.remove("hidden");

    requiredFields.forEach(field => {
        if (field.value.trim() === "") {
            const fieldName = field.getAttribute("name");
            const errorMessage = document.createElement("p");
            errorMessage.textContent = `${fieldName} is required, please correct the form.`;
            errorMessageDiv.appendChild(errorMessage);
        }
    });
  }
}
