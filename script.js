const cvBtn = document.querySelector(".btn-box .btn");
if (cvBtn) {
  cvBtn.addEventListener("click", () => {
    window.open("sources/CV/myCV.pdf", "_blank");
  });
}

const cvBtn2 = document.querySelector(".Tools-box .edu-item .LT84");
if (cvBtn2) {
  cvBtn2.addEventListener("click", () => {
    window.open("../sources/sourcesfile/LT84.exe", "_blank");
  });
}
 
const vid = document.getElementById("bgVideo");

vid.play().catch(() => {
  vid.muted = true;
  vid.play();
});

// =============== PAGE FADE TRANSITION ===============
window.addEventListener("load", () => {
  document.body.classList.add("page-loaded");
});

document.querySelectorAll("a[href]").forEach((link) => {
  const href = link.getAttribute("href");

  if (
    !href ||
    href.startsWith("#") ||
    href.startsWith("mailto:") ||
    href.startsWith("tel:") ||
    link.target === "_blank"
  ) {
    return;
  }

  link.addEventListener("click", (e) => {
    e.preventDefault();
    const url = href;

    document.body.classList.add("page-fade-out");

    setTimeout(() => {
      window.location.href = url;
    }, 300);
  });
});

var typed = new Typed(".typing", {
  strings: ["Henry", "a Web Developer", "a Coder"],
  typeSpeed: 50,
  BackSpeed: 60,
  loop: true,
});
