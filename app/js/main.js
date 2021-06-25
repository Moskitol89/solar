

const tabButtons = Array.prototype.slice
    .call(document.querySelector(".rate__tabs-names")
    .children),
    tabs = Array.prototype.slice
        .call(document.querySelector(".rate__tabs")
            .children);

document.querySelectorAll(".rate__tab-name")
    .forEach(function (el) {
        el.addEventListener("click", function (el){
            switchTabs(this);
        });
    })

function switchTabs(clickedTabButton) {
    let indexOfClicked = tabButtons.indexOf(clickedTabButton);
    tabButtons.forEach( el => {
           el.classList.remove("active");
    });
    tabs.forEach( el => {
           el.classList.remove("active");
    });
    tabButtons[indexOfClicked].classList.add("active");
    tabs[indexOfClicked].classList.add("active");
}
const swiper = new Swiper(".rate__info-slider", {
    autoplay: true,
    loop: true,
    navigation: {
        nextEl: ".rate__info-arrow-next",
        prevEl: ".rate__info-arrow-prev"
    }
});