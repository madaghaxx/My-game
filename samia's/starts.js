document.addEventListener("DOMContentLoaded", function () {
    const starContainer = document.querySelector(".stars");
    const numberOfStars = 100; // Nombre d'étoiles

    for (let i = 0; i < numberOfStars; i++) {
        const star = document.createElement("div");
        star.classList.add("star");

        // Position aléatoire
        star.style.left = `${Math.random() * 100}vw`;
        star.style.top = `${Math.random() * 100}vh`;

        // Taille aléatoire
        const size = Math.random() * 3 + 1;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;

        // Animation fluide avec durée aléatoire
        const duration = Math.random() * 5 + 5;
        star.style.animationDuration = `${duration}s`;
        star.style.animationDelay = `${Math.random() * 5}s`;

        starContainer.appendChild(star);
    }
});
