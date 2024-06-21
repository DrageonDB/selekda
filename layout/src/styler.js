// get all lists
const backgroundImageAttrName = 'data-background-image';
const elementContainsBgImg = document.querySelectorAll(`[${backgroundImageAttrName}]`);

elementContainsBgImg.forEach(item => {
    const val = item.getAttribute(backgroundImageAttrName);
    item.style.backgroundImage = `url('${val}')`;
    item.style.backgroundSize = `contain`;
    item.style.backgroundRepeat = `no-repeat`;
    item.style.backgroundPosition = `center`;
});

// Redirection
const redirectHrefAttrName = 'data-redirect-href';
const elementContainsredirectHrefAttrName = document.querySelectorAll(`[${redirectHrefAttrName}]`);

elementContainsredirectHrefAttrName.forEach(item => {
    const val = item.getAttribute(redirectHrefAttrName);
    item.setAttribute('onclick', `window.location='${val}';`);
});