"use strict";

const MAX_LENGTH = 50;//maximum length of the blog content shown on the page, i.e., if the blog content is longer, truncate it.
const PAGE_LIMIT = 12;//number of blogs per page

const url = "http://localhost:3000/blogs";

// get the article wrapper element
const articleWrapper = document.querySelector(".articles-wrapper");

// get the pagination container element
const paginationContainer = document.querySelector(".pagination-container");

// create empty array for blogs data
let blogs = [];

// create empty variables for blog and page count calcs, set the initial page number
let totalPages;
let currentPage = 1;

// Event listener for page load
window.addEventListener("DOMContentLoaded", fetchBlogs);

// Query the server for the blogs data
async function fetchBlogs() {
    try {
        const response = await fetch(`${url}?_page=${currentPage}&_limit=${PAGE_LIMIT}&_sort=date&_order=asc`);
        if(!response.ok)
            throw Error(`Error ${response.url} ${response.statusText}`);
        blogs = await response.json();
        
        // calculate total number of blogs and the required number of pages
        const blogCount = response.headers.get('x-total-count');
        totalPages = Math.ceil(parseInt(blogCount) / PAGE_LIMIT);
        
        // load the blogs
        loadBlogs();

        // clear the pagination container and create the pagination buttons
        paginationContainer.innerHTML = "";
        paginationButtons();

    } catch(error) {
        console.log(error.message)
    }
}

// Create a DOM fragment for each item in the blogs object
function loadBlogs() {
    const fragment = document.createDocumentFragment();
    blogs.forEach(blog => fragment.append(displayPosts(blog)));
    articleWrapper.innerHTML = "";
    articleWrapper.append(fragment);
}


// Generate the post elements and display them
function displayPosts(blog) {

    // create a new article element
    const articleCard = document.createElement("article");
    articleCard.classList.add("card");
    
    // add event listener to go to blog details when blog card is clicked
    articleCard.addEventListener("click", function() {
        window.location.href = `/details.html?id=${blog.id}`;
    });

    // create the article card header
    const cardHeaderDiv = document.createElement("div");
    cardHeaderDiv.classList.add("card-header");

    const authorImage = document.createElement("img");
    const cardTitleDateDiv = document.createElement("div");

    // create the article card body
    const cardBodyDiv = document.createElement("div");
    cardBodyDiv.classList.add("card-body");

    const articleTitle = document.createElement("h3");
    const articleBody = document.createElement("p");

    articleCard.appendChild(cardHeaderDiv);
    cardHeaderDiv.appendChild(authorImage);
    cardHeaderDiv.appendChild(cardTitleDateDiv);

    articleCard.appendChild(cardBodyDiv);
    cardBodyDiv.appendChild(articleTitle);
    cardBodyDiv.appendChild(articleBody);

    // set attributes using data from each object in posts
    articleCard.setAttribute("data-id", blog.id);

    authorImage.setAttribute("src", blog.profile);
    authorImage.setAttribute("alt", "profile picture");
    authorImage.setAttribute("class", "avatar");

    cardTitleDateDiv.innerText = blog.author + " - " + blog.date;

    articleTitle.innerText = blog.title;

    // truncate the displayed content based on the maximum allowable character length
    let postContent = blog.content;
    let displayContent = "";
    let remainingContent = "";
    if (postContent.length > MAX_LENGTH) {
    displayContent = postContent.substring(0, MAX_LENGTH);
    remainingContent = postContent.substring(MAX_LENGTH);

    articleBody.innerText = displayContent + " ...";
    } else {
    articleBody.innerText = blog.content;
    }

    return articleCard;

}

// function to create pagination buttons
function paginationButtons() {
    for (let page = 1; page <= totalPages; page++) {
        const pageButton = document.createElement("button");
        pageButton.classList.add("page-btn");
        pageButton.textContent = page;
        pageButton.setAttribute("data-page", page);

        // add a click event listener to the page buttons
        pageButton.addEventListener("click", () => {
            let pageNumber = parseInt(pageButton.getAttribute("data-page"));
            currentPage = pageNumber;

            // call setActivePageBtn to set the active page button to the current page
            setActivePageBtn(currentPage);  

            // send fetch request to json server for blog posts on currentPage
            fetchBlogs();
        });

        paginationContainer.appendChild(pageButton);
    }
    
    // Set current page button to page 1 and display posts
    setActivePageBtn(currentPage);
}

// set the active page button
function setActivePageBtn(pageNumber) {
    const pageButtons = document.querySelectorAll(".page-btn");

    //remove active class for all buttons
    pageButtons.forEach((button) => {
      button.classList.remove("active");
    })

    //set active class for the clicked button
    let clickedPageBtn = document.querySelector(`.page-btn[data-page="${pageNumber}"]`);
    clickedPageBtn.classList.add("active");
  }

//search functionality
//get the search bar element
const searchBarElement = document.querySelector(".search-bar");

//add change event listener to the search bar element
searchBarElement.addEventListener("change", () => {
    // get the text value from the search bar input
    const searchInput = document.querySelector('input[type="search"]');
    const searchInputValue = searchInput.value;

    if (searchInputValue !== "") {
        // update the fetch request url based on the searchInputValue
        let urlUpdate = `&q=${searchInputValue}`;

    } else {
        // return the first page of blog posts
    }
});