function itemLink(singleProLink) {
    for (let i = 0; i < singleProLink.length; i++) {
        singleProLink[i].addEventListener("click", function(event){
            event.preventDefault();
            sessionStorage.setItem(`singleProperty_${i}`, JSON.stringify(data[i]));
            window.open(`./single-property?recId=${i}`);
        });
    }
}

export { itemLink }