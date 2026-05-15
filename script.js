document.addEventListener("DOMContentLoaded", () => {
    const resumeBtn = document.getElementById("resumeBtn");

    function showContact() {
        alert("Recruiters and professional contacts can email Kevin Patel at pk612562@gmail.com to request my technical resume.");
    }

    if (resumeBtn) {
        resumeBtn.addEventListener("click", showContact);
    }

    const cards = document.querySelectorAll(".swipe-card");
    const prevBtn = document.getElementById("prevCard");
    const nextBtn = document.getElementById("nextCard");
    const counter = document.getElementById("cardCounter");

    let currentCard = 0;

    function showCard(index) {
        cards.forEach((card) => {
            card.classList.remove("active");
        });

        cards[index].classList.add("active");

        if (counter) {
            counter.textContent = `${index + 1} / ${cards.length}`;
        }
    }

    if (prevBtn && nextBtn && cards.length > 0) {
        prevBtn.addEventListener("click", () => {
            currentCard--;

            if (currentCard < 0) {
                currentCard = cards.length - 1;
            }

            showCard(currentCard);
        });

        nextBtn.addEventListener("click", () => {
            currentCard++;

            if (currentCard >= cards.length) {
                currentCard = 0;
            }

            showCard(currentCard);
        });

        showCard(currentCard);
    }
});