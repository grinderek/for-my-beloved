const cover = document.querySelector("#cover");
const content = document.querySelector("#inside");
const envelope = document.querySelector("#envelope");
const seal = document.querySelector("#seal");
const letter = document.querySelector("#pull");
const contentHeading = document.querySelector(".section-top h1");

const invitation = document.querySelector("#invitation");
const dateOptions = document.querySelectorAll("[data-choice]");
const confirmButton = document.querySelector("#yes");
const confirmation = document.querySelector("#accepted");
const selectedPlan = document.querySelector("#plan");
const replyLink = document.querySelector("#reply");

const telegramUsername = "dannmmaster";
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

let selectedDate = "";
let dragStartY = null;

seal.addEventListener("click", openEnvelope);
letter.addEventListener("click", showLetter);
letter.addEventListener("pointerdown", startLetterDrag);
letter.addEventListener("pointerup", finishLetterDrag);
letter.addEventListener("pointercancel", () => {
  dragStartY = null;
});

for (const option of dateOptions) {
  option.addEventListener("click", () => selectDate(option));
}

confirmButton.addEventListener("click", confirmDate);

function openEnvelope() {
  envelope.classList.add("open");
  seal.disabled = true;
  letter.tabIndex = 0;

  // Даем карточке подняться над конвертом перед переводом фокуса.
  window.setTimeout(
    () => {
      if (!content.hidden) return;
      letter.focus({ preventScroll: true });
    },
    reducedMotion.matches ? 0 : 900,
  );
}

function showLetter() {
  if (!envelope.classList.contains("open")) return;

  cover.hidden = true;
  content.hidden = false;
  window.scrollTo(0, 0);
  contentHeading.tabIndex = -1;
  contentHeading.focus({ preventScroll: true });
}

function startLetterDrag(event) {
  if (!event.isPrimary || event.button !== 0) return;

  dragStartY = event.clientY;
  letter.setPointerCapture(event.pointerId);
}

function finishLetterDrag(event) {
  if (dragStartY === null) return;

  const distance = dragStartY - event.clientY;
  dragStartY = null;

  if (letter.hasPointerCapture(event.pointerId)) {
    letter.releasePointerCapture(event.pointerId);
  }

  if (distance > 25) showLetter();
}

function selectDate(selectedOption) {
  selectedDate = selectedOption.dataset.choice;

  for (const option of dateOptions) {
    option.setAttribute("aria-pressed", String(option === selectedOption));
  }

  confirmButton.disabled = false;
  confirmButton.textContent = "Да, пойдем ♡";
}

function confirmDate() {
  if (!selectedDate) return;

  const message = `Зайчик, я прочитала письмо ❤️ Давай на свидание: ${selectedDate}.`;
  replyLink.href = `https://t.me/${telegramUsername}?text=${encodeURIComponent(message)}`;
  selectedPlan.textContent = selectedDate;
  invitation.hidden = true;
  confirmation.hidden = false;

  if (!reducedMotion.matches) showHearts();

  confirmation.scrollIntoView({
    behavior: reducedMotion.matches ? "instant" : "smooth",
    block: "center",
  });
}

function showHearts() {
  for (let index = 0; index < 12; index += 1) {
    const heart = document.createElement("span");
    heart.className = "burst";
    heart.textContent = "♡";
    heart.setAttribute("aria-hidden", "true");
    heart.style.left = `${10 + Math.random() * 80}vw`;
    heart.style.top = `${50 + Math.random() * 35}vh`;
    document.body.append(heart);

    window.setTimeout(() => heart.remove(), 2000);
  }
}
