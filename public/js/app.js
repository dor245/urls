console.log("Hola mundo");
//envento click
document.addEventListener("click", e => {
    if (e.target.dataset.short) {
        //data-short button
        const url = `${window.location.origin}/${e.target.dataset.short}`
        
        navigator.clipboard
        .writeText(url)
        .then(() => {
            console.log("Text copied to clipboard...");
        })
        .catch((err) => {
            console.log("Something went wrong", err);
        });
    }

});