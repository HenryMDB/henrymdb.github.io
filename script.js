// ================= 1. XỬ LÝ MÀN HÌNH WELCOME =================
function setupWelcomeScreen() {
  const welcomeScreen = document.getElementById("welcome-screen");
  const enterBtn = document.getElementById("enter-btn");
  const music = document.getElementById("bgMusic");
  const video = document.getElementById("bgVideo");

  if (!welcomeScreen || !enterBtn) return;

  // Check session để không hiện lại nếu F5
  if (sessionStorage.getItem("visited") === "true") {
    welcomeScreen.style.display = "none";
    return;
  }

  enterBtn.addEventListener("click", () => {
    // Bật nhạc
    if (music) {
      music.muted = false;
      music.currentTime = 0;
      music.volume = 0.5;
      music.play().catch((e) => console.log("Audio play failed", e));
    }
    // Bật video nền
    if (video) {
      video.muted = true;
      video.play();
    }

    // Ẩn màn hình welcome
    welcomeScreen.style.opacity = "0";
    setTimeout(() => {
      welcomeScreen.style.display = "none";
    }, 500);

    sessionStorage.setItem("visited", "true");

    // Khởi động chữ chạy ngay khi vào
    runTypedEffect();
  });
}

// ================= 2. CHỨC NĂNG CHUYỂN TAB (SPA) =================
// Hàm này được gọi từ onclick trong HTML
function switchTab(tabId) {
  // 1. Ẩn tất cả các section
  const allSections = document.querySelectorAll(".tab-content");
  allSections.forEach((sec) => {
    sec.classList.remove("active");
  });

  // 2. Hiện section được chọn
  const targetSection = document.getElementById(tabId);
  if (targetSection) {
    targetSection.classList.add("active");
  }

  // 3. Cập nhật thanh Nav (Active state)
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.classList.remove("active");
    // So sánh data-target của thẻ a với tabId
    if (link.getAttribute("data-target") === tabId) {
      link.classList.add("active");
    }
  });

  // 4. Xử lý đặc biệt cho trang Home (hiệu ứng chữ chạy)
  // Nếu về trang Home thì chạy lại chữ, nếu rời trang Home thì tắt đi
  if (tabId === "home") {
    runTypedEffect();
  } else {
    if (typedInstance) {
      typedInstance.destroy();
      typedInstance = null;
    }
  }
}

// ================= 3. HIỆU ỨNG CHỮ CHẠY (TYPED.JS) =================
let typedInstance;

function runTypedEffect() {
  // Chỉ chạy nếu phần tử .typing đang hiện hữu
  const typingElement = document.querySelector(".typing");

  // Nếu chưa có instance nào thì tạo mới
  if (typingElement && !typedInstance) {
    typedInstance = new Typed(".typing", {
      strings: ["Henry", "a Web Developer", "a Coder"],
      typeSpeed: 50,
      backSpeed: 60,
      loop: true,
    });
  }
}

// ================= 4. CÁC NÚT BẤM KHÁC =================
function setupMiscButtons() {
  // Nút Driver LT84
  const driverBtn = document.querySelector(".LT84");
  if (driverBtn) {
    driverBtn.addEventListener("click", () =>
      window.open("sources/sourcesfile/LT84.exe", "_blank"),
    );
  }
}

// ================= 5. KHỞI CHẠY =================
window.addEventListener("load", () => {
  setupWelcomeScreen();
  setupMiscButtons();

  // Video nền luôn cố gắng chạy
  const vid = document.getElementById("bgVideo");
  if (vid)
    vid.play().catch(() => {
      vid.muted = true;
      vid.play();
    });

  // Mặc định chạy chữ nếu home đang active
  if (document.getElementById("home").classList.contains("active")) {
    runTypedEffect();
  }
});

function copyToClipboard(elementId, btnElement) {
  // 1. Lấy nội dung text từ thẻ code
  const textToCopy = document.getElementById(elementId).innerText;

  // 2. Sử dụng API Clipboard hiện đại
  navigator.clipboard
    .writeText(textToCopy)
    .then(() => {
      // 3. Hiệu ứng Visual: Đổi icon Copy thành dấu tích V
      const originalIcon = btnElement.innerHTML; // Lưu icon cũ

      // Đổi sang icon check (bx-check) và đổi màu xanh
      btnElement.innerHTML = "<i class='bx bx-check'></i>";
      btnElement.style.borderColor = "#7cff6a";
      btnElement.style.color = "#7cff6a";

      // 4. Sau 2 giây thì trả lại icon cũ
      setTimeout(() => {
        btnElement.innerHTML = "<i class='bx bx-copy'></i>";
        btnElement.style.borderColor = "#555"; // Trả về màu viền gốc
        btnElement.style.color = "white"; // Trả về màu chữ gốc
      }, 2000);
    })
    .catch((err) => {
      console.error("Không thể copy: ", err);
    });
}
