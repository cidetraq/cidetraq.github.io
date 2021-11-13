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
