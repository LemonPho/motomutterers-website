export function pagination(totalElements, elementsPerPage, currentPage){
    let result = {
        pageNumbers: [],
        nextPage: "",
        previousPage: "",
    }

    let totalPages = Math.ceil(totalElements/elementsPerPage);
    let i = 0;
    let j;

    if(totalElements % elementsPerPage === 0){
        totalPages++;
    }
    j = totalPages;

    //if there are less then 10 announcements, then there is only one page of announcements
    if(totalElements <= elementsPerPage){
        return null;
    }

    //determining if there is a previous page available
    if(currentPage > 1){
        result.previousPage = "page-item";
    } else {
        result.previousPage = "page-item disabled"
    }

    //determining if there is a next page available
    if(currentPage < totalPages){
        result.nextPage = "page-item";
    } else {
        result.nextPage = "page-item disabled";
    }

    //finding out what numbers to display in the pagination view
    if(currentPage > 5){
        if(totalPages > (currentPage + 5)){
            i = currentPage - 5;
            j = currentPage + 5;
        } else {
            i = 10 - (totalPages - currentPage);
            j = i + 10;
        }
    }

    for(i; i < j; i++){
        result.pageNumbers.push(i+1);
    }

    return result;
}

export function dataURLtoFile(dataurl, filename) {
    var arr = dataurl.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[arr.length - 1]), 
        n = bstr.length, 
        u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }

    const fileExtension = mime.split("/")[1];
    filename = `${filename}.${fileExtension}`;

    return new File([u8arr], filename, {type:mime});
}

export function getScreenDimensions(){
    let result = {
        width: window.innerWidth,
        height: window.innerHeight,
    }

    return result
}

export function closeModals(clearInputFields){
    const modals = document.getElementsByClassName("custom-modal");
    const backgroundBlur = document.getElementById("background-blur");
    const inputFields = document.querySelectorAll('[data-category="input-field"]');

    //closing modals
    Array.prototype.forEach.call(modals, (modal) => {
        if(!modal.classList.contains("hidden")){
            modal.classList.toggle("hidden");
        }
    });

    //Erasing all inputs
    if(clearInputFields || clearInputFields == undefined){
        Array.prototype.forEach.call(inputFields, (inputField) => {
            if(inputField.tagName === "INPUT"){
                inputField.value = null;
                inputField.checked = false;
            } else {
                inputField.innerHTML = "";
            }
        })
    }
    
    if(!backgroundBlur.classList.contains("hidden")){
        backgroundBlur.classList.toggle("hidden");
    }
}

export function toggleModal(elementId, event, isLoggedIn, isAdmin, clearInputFields){
    const modal = document.getElementById(elementId);
    const backgroundBlur = document.getElementById("background-blur");
    event.stopPropagation();

    if(!modal.classList.contains("hidden")){
        closeModals(clearInputFields);
        return;
    }

    if((isLoggedIn === undefined || isLoggedIn === true) && (isAdmin === undefined || isAdmin === true)){
        closeDropdowns();
        closeModals(clearInputFields);

        modal.classList.toggle("hidden");
        backgroundBlur.classList.toggle("hidden");
    }
}

export function closeDropdowns(){
    //this function retrieves all the dropdowns currently on the page, and closes them all
    //this grabs the dropdown CONTENT divs, not the GENERAL dropdown div, and removes the show class
    const dropdowns = document.getElementsByClassName("dropdown-menu");
    const menuDropdowns = document.getElementsByClassName("menu-dropdown-content");

    Array.prototype.forEach.call(dropdowns, (dropdown) => {
        if(dropdown.classList.contains("show")){
            dropdown.classList.toggle("show");
        }
    });

    Array.prototype.forEach.call(menuDropdowns, (menuDropdown) => {
        if(menuDropdown.classList.contains("show")){
            menuDropdown.classList.toggle("show");
        }
    })
}

export function toggleDropdown(elementId, event, loggedIn){
    //finds the dropdown on the page, if it has the show class it closes the dropdowns, if not it adds show
    event.stopPropagation();

    const element = document.getElementById(elementId);

    if(element.classList.contains("show")){
        closeDropdowns();
        return;
    }

    closeDropdowns();
    if(elementId != undefined && (loggedIn == undefined || loggedIn == true)){
        element.classList.toggle("show");
    }
}

export function enterKeySubmit(event, method){
    event.stopPropagation();
    
    if(event.key == "Enter"){
        event.preventDefault();
        method();
    }
}

export function focusDiv(divId){
    const div = document.getElementById(divId);
    if(div){
        div.focus();
    }
}

export async function getProfilePictures(users){
    
}