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
  const p = document.getElementById("tag-cloud").querySelector("p");
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
  });
});
