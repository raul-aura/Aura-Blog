export function init(container) {

    const readButton = container.querySelector(".readButton");
    const file = container.querySelector(".file");

    readButton.addEventListener("click", () => {
        if (file.style.maxHeight) {
            file.style.maxHeight = null;
        } else {
            file.style.maxHeight = file.scrollHeight + "px";
        }
    });

}