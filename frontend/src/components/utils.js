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

export function toggleDropdown(elementId, event, loggedIn){
    //finds the dropdown on the page, if it has the show class it closes the dropdowns, if not it adds show
    event.stopPropagation();

    const element = document.getElementById(elementId);

    if(element.classList.contains("show")){
        return;
    }

    if(elementId != undefined && (loggedIn == undefined || loggedIn == true)){
        element.classList.toggle("show");
    }
}

export function enterKeySubmit(event, method){    
    if(event.key == "Enter"){
        event.preventDefault();
        method();
    }
}

export function autoResizeTextarea(textarea){
    if(!textarea.classList.contains("textarea-expand")){
        return;
    }

    textarea.style.height = textarea.scrollHeight + "px";
}

export function toggleCardBody(div){
    if(!div || !div.classList.contains("card-body")){
        return;
    }

    div.classList.toggle("expanded");
}