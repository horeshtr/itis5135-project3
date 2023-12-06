"use strict";

// get id from the current browser url
const id = new URLSearchParams(window.location.search).get("id");

// set the fetch url
const url = `http://localhost:3000/blogs/${id}`;

// get the article wrapper element
const articleWrapper = document.querySelector("article");

// create empty array for blogs data
let blogs = [];

// Event listener for page load
window.addEventListener("DOMContentLoaded", fetchBlogs);

// Query the server for the blogs data
async function fetchBlogs() {
    try {
        const response = await fetch(url);
        if(!response.ok)
            throw Error(`Error ${response.url} ${response.statusText}`);
        blogs = await response.json();
        
        generateBlog(blogs);

    } catch(error) {
        console.log(error.message)
    }
}

// generate all DOM elements, set attributes and classes, and render blog data on page
function generateBlog(blog) {
    articleWrapper.innerHTML = "";

    const blogH2 = document.createElement("h2");
    blogH2.innerText = blog.title
    articleWrapper.appendChild(blogH2);

    const blogHeaderDiv = document.createElement("div");
    blogHeaderDiv.classList.add("article-header");
    articleWrapper.appendChild(blogHeaderDiv);

    const profilePic = document.createElement("img");
    profilePic.setAttribute("src", blog.profile);
    profilePic.setAttribute("alt", "profile picture");
    profilePic.setAttribute("height", "60px");
    profilePic.setAttribute("width", "60px");
    profilePic.classList.add("avatar");
    blogHeaderDiv.appendChild(profilePic);

    const authorDateDiv = document.createElement("div");
    authorDateDiv.innerText = `${blog.author} | ${blog.date}`;
    blogHeaderDiv.appendChild(authorDateDiv);

    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("btn-container");
    blogHeaderDiv.appendChild(buttonContainer);

    const editButton = document.createElement("a");
    editButton.classList.add("btn");
    editButton.setAttribute("href", `/edit.html?id=${id}`)
    buttonContainer.appendChild(editButton);

    const editIcon = document.createElement("i");
    editIcon.classList.add("fa-solid", "fa-pen");
    editButton.appendChild(editIcon);

    const deleteButton = document.createElement("button");
    deleteButton.classList.add("btn");
    buttonContainer.appendChild(deleteButton);

    deleteButton.addEventListener("click", deletePost);

    const deleteIcon = document.createElement("i");
    deleteIcon.classList.add("fa-solid", "fa-trash-can");
    deleteButton.appendChild(deleteIcon);

    const articleBody = document.createElement("p");
    articleBody.classList.add("article-body");
    articleBody.innerText = blog.content;
    articleWrapper.appendChild(articleBody);

    return articleWrapper;
}

async function deletePost() {
    const response = await fetch(url, {method: "DELETE"});
    if (!response.ok) {
        throw Error(`Error ${response.url} ${response.statusText}`);
    } else {
        window.location.href = "/";
    }
}