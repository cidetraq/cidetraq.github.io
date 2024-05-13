function markPortfolioPieceActive(id) {
  var card = document.getElementById(id);
  card.classList.add("portfolioActivePiece");
  console.log(card);
}

var viewBtns = document.querySelectorAll(".viewBtn");
viewBtns.forEach((btn, index) => {
  var id = "portfolioView" + index.toString();
  btn.addEventListener("click", () => {
    markPortfolioPieceActive(id);
  });
});

var cards = document.querySelectorAll(".card");
cards.forEach((card, index) => {
  card.id = "portfolioView" + index.toString();
});

document.addEventListener("DOMContentLoaded", function () {
  const cards = document.querySelectorAll(".card");
  let currentActiveCard = null; // Track the currently active card

  function startParticles(card) {
    if (currentActiveCard !== card) {
      if (currentActiveCard) {
        stopParticles(currentActiveCard); // Stop particles on previously active card
      }
      currentActiveCard = card; // Update the active card
      card.intervalId = setInterval(() => createParticle(card), 50);
    }
  }

  function stopParticles(card) {
    if (card.intervalId) {
      clearInterval(card.intervalId); // Clear the interval
      const particles = card.querySelectorAll(".particle");
      particles.forEach((particle) => particle.remove()); // Remove all particles
      card.intervalId = null; // Reset the interval ID
    }
  }

  cards.forEach((card) => {
    card.addEventListener("mouseenter", function () {
      startParticles(this);
    });

    card.addEventListener("mouseleave", function () {
      // Optionally keep the effect running until another card is touched or hovered
      // stopParticles(this); // Uncomment if you want the effect to stop on mouse leave
    });

    card.addEventListener("touchstart", function (e) {
      startParticles(this);
    });
  });

  function createParticle(container) {
    const particle = document.createElement("div");
    particle.className = "particle";

    // Randomize color variations of yellow-gold
    const colorIntensity = Math.random();
    particle.style.backgroundColor = `rgba(255, ${
      200 + 55 * colorIntensity
    }, 0, 0.8)`;

    // Randomize starting size
    const size = Math.random();
    particle.style.width = `${Math.round(4 * size)}px`;
    particle.style.height = `${Math.round(4 * size)}px`;

    container.appendChild(particle);

    // Set initial position
    const x = Math.random() * container.offsetWidth;
    particle.style.left = `${x}px`;
    particle.style.top = `${container.offsetHeight}px`;

    // Set animation
    particle.style.opacity = 0.5 + Math.random() * 0.5;
    setTimeout(() => {
      particle.style.opacity = 1;
      particle.style.transform = `translateY(${40}px)`;
      setTimeout(() => {
        particle.style.opacity -= 0.01;
      }, 100);
      setTimeout(() => {
        particle.remove();
      }, 3000);
    }, 1);
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const container = document.getElementById("tag-cloud");
  const p = container.querySelector("p");
  const words = p.textContent.split(" "); // Split the paragraph text by spaces
  const maxFontSize = 36; // Maximum font size in pixels
  const minFontSize = 12; // Minimum font size in pixels
  const totalWords = words.length;

  p.innerHTML = ""; // Clear existing text

  words.forEach((word, index) => {
    let size = maxFontSize - (index * (maxFontSize - minFontSize)) / totalWords;
    let span = document.createElement("span"); // Create a new span for each word
    span.style.fontSize = `${size}px`; // Set font size
    span.textContent = word + " "; // Add the word back with a space
    p.appendChild(span); // Append the span to the paragraph

    // Adding hover effect using JavaScript
    span.addEventListener("mouseover", () => {
      const currentSize = parseFloat(window.getComputedStyle(span).fontSize);
      span.style.fontSize = `${currentSize * 1.2}px`; // Increase by 20%
      span.classList.add("glowy-text");
    });

    span.addEventListener("mouseout", () => {
      const currentSize = parseFloat(window.getComputedStyle(span).fontSize);
      span.style.fontSize = `${currentSize / 1.2}px`; // Reset to original size
      span.classList.remove("glowy-text");
    });

    span.addEventListener("touchstart", function (e) {
      const currentSize = parseFloat(window.getComputedStyle(span).fontSize);
      span.style.fontSize = `${currentSize * 1.2}px`; // Increase by 20%
      span.classList.add("glowy-text");
    });

    span.addEventListener("touchend", function (e) {
      const currentSize = parseFloat(window.getComputedStyle(span).fontSize);
      span.style.fontSize = `${currentSize / 1.2}px`; // Reset to original size
      span.classList.remove("glowy-text");
    });
  });
});
