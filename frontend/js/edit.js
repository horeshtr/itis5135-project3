"use strict";

const id = new URLSearchParams(window.location.search).get("id");
const url = `http://localhost:3000/blogs/${id}`;

const form = document.querySelector("form");
const titleBox = form.querySelector("#title");
const contentBox = form.querySelector("#content");
const submitButton = form.querySelector("button");

let blog;

// event listeners
window.addEventListener("DOMContentLoaded", fetchBlog); 
submitButton.addEventListener("click", updateBlog);

async function fetchBlog() {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw Error(`Error ${response.url} ${response.statusText}`);
        }

        blog = await response.json();

        populateForm();
    } catch(error) {
        console.log(error.message);
    }
}

function populateForm() {
    titleBox.value = blog.title;
    contentBox.value = blog.content;
}

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
            console.log(error.message)
        }
    }
}