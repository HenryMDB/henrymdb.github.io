// ================= 1. XỬ LÝ MÀN HÌNH WELCOME (BYPASS AUTOPLAY) =================

function setupWelcomeScreen() {
    const welcomeScreen = document.getElementById("welcome-screen");
    const enterBtn = document.getElementById("enter-btn");
    const music = document.getElementById("bgMusic");
    const video = document.getElementById("bgVideo");

    // Nếu không có màn hình welcome trong HTML thì bỏ qua
    if (!welcomeScreen || !enterBtn) return;

    // Kiểm tra xem đã vào web lần nào chưa (trong phiên này)
    // Nếu muốn lúc nào F5 cũng hiện Welcome thì xóa dòng if này đi
    if (sessionStorage.getItem("visited") === "true") {
        welcomeScreen.style.display = "none";
        // Cố gắng phát lại nhạc/video nếu đã từng vào
        if (music) music.play().catch(() => {});
        if (video) video.play().catch(() => {});
        return;
    }

    // Sự kiện khi bấm nút "Click to Enter"
    enterBtn.addEventListener("click", () => {
        // 1. Bật nhạc (Quan trọng nhất)
        if (music) {
            music.muted = false;
            music.currentTime = 0;
            music.volume = 0.5; // Đặt âm lượng vừa phải (50%)
            music.play().then(() => {
                console.log("Music started success!");
            }).catch(e => console.error("Music error:", e));
        }

        // 2. Bật video nền
        if (video) {
            video.muted = true; // Video nền luôn tắt tiếng để không đè nhạc
            video.play();
        }

        // 3. Ẩn màn hình Welcome với hiệu ứng mờ
        welcomeScreen.style.opacity = "0";
        setTimeout(() => {
            welcomeScreen.style.display = "none";
        }, 500); // Khớp với transition trong CSS

        // 4. Lưu trạng thái "đã ghé thăm"
        sessionStorage.setItem("visited", "true");
    });
}

// ================= 2. CẤU HÌNH CÁC NÚT BẤM (CV, DRIVER) =================

function setupButtons() {
    // Nút tải CV (trang Home/About)
    const cvBtn = document.querySelector(".btn-box .btn");
    if (cvBtn) {
        // Vì file HTML đã đưa ra ngoài, đường dẫn giờ là trực tiếp
        cvBtn.addEventListener("click", () => window.open("sources/CV/myCV.pdf", "_blank"));
    }

    // Nút tải Driver (trang Tools)
    const driverBtn = document.querySelector(".Tools-box .edu-item .LT84");
    if (driverBtn) {
        driverBtn.addEventListener("click", () => window.open("sources/sourcesfile/LT84.exe", "_blank"));
    }
}

// ================= 3. HIỆU ỨNG CHỮ CHẠY (TYPED.JS) =================

let typedInstance; // Biến lưu instance để hủy khi chuyển trang

function runTypedEffect() {
    // Chỉ chạy nếu tìm thấy class .typing (tức là đang ở trang Home)
    if (document.querySelector(".typing")) {
        typedInstance = new Typed(".typing", {
            strings: ["Henry", "a Web Developer", "a Coder"], // Các chữ muốn chạy
            typeSpeed: 50,
            backSpeed: 60,
            loop: true,
        });
    }
}

// ================= 4. LOGIC CHUYỂN TRANG KHÔNG RELOAD (SPA) =================

async function loadPage(url) {
    try {
        // A. Hiệu ứng mờ đi (Fade Out)
        document.body.classList.remove("page-loaded");
        document.body.classList.add("page-fade-out");

        // B. Tải nội dung file HTML mới
        const response = await fetch(url);
        if (!response.ok) throw new Error("Load failed");
        const htmlText = await response.text();

        // C. Phân tích HTML lấy được để lọc lấy phần nội dung chính
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlText, "text/html");
        
        // Lấy thẻ section mới và cũ
        const newSection = doc.querySelector("section");
        const currentSection = document.querySelector("section");

        // D. Đợi 300ms cho hiệu ứng mờ chạy xong rồi mới tráo nội dung
        setTimeout(() => {
            if (newSection && currentSection) {
                // Hủy hiệu ứng chữ cũ nếu có (tránh lỗi đè chữ)
                if (typedInstance) {
                    typedInstance.destroy();
                    typedInstance = null;
                }

                // Tráo đổi nội dung
                currentSection.replaceWith(newSection);
                
                // Cập nhật URL trên trình duyệt
                window.history.pushState({}, "", url);
                
                // Cài đặt lại tất cả chức năng cho trang mới
                updateActiveNav();
                setupButtons();
                setupLinks();
                runTypedEffect();
            }

            // E. Hiện lại trang (Fade In)
            document.body.classList.remove("page-fade-out");
            document.body.classList.add("page-loaded");

        }, 300);

    } catch (error) {
        console.error("Lỗi chuyển trang:", error);
        // Nếu lỗi (ví dụ không chạy Live Server), fallback về chuyển trang thường
        window.location.href = url; 
    }
}

// Hàm cập nhật trạng thái Active trên Menu
function updateActiveNav() {
    // Lấy tên file hiện tại (ví dụ: about.html hoặc index.html)
    const path = window.location.pathname.split("/").pop() || "index.html";
    
    document.querySelectorAll("nav .links a").forEach(link => {
        link.classList.remove("active");
        
        // So sánh đường dẫn
        const href = link.getAttribute("href");
        if (href === path || (path === "" && href === "index.html")) {
            link.classList.add("active");
        }
    });
}

// Hàm chặn click thẻ A để chuyển hướng bằng JS
function setupLinks() {
    document.querySelectorAll("a[href]").forEach((link) => {
        // Clone node để xóa sự kiện cũ (tránh bị double click)
        const newLink = link.cloneNode(true);
        link.parentNode.replaceChild(newLink, link);

        const href = newLink.getAttribute("href");

        // Bỏ qua link ngoài (http), link neo (#), mailto, tel
        if (!href || href.startsWith("#") || href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("tel:")) {
            return;
        }

        newLink.addEventListener("click", (e) => {
            e.preventDefault(); // CHẶN RELOAD TRANG
            loadPage(href);     // GỌI HÀM SPA
        });
    });
}

// Xử lý nút Back/Forward của trình duyệt
window.addEventListener("popstate", () => {
    loadPage(window.location.href);
});

// ================= 5. KHỞI CHẠY KHI MỞ WEB =================

window.addEventListener("load", () => {
    // Thêm class để chạy hiệu ứng fade in ban đầu
    document.body.classList.add("page-loaded");
    
    // Video nền cố gắng chạy (muted)
    const vid = document.getElementById("bgVideo");
    if(vid) vid.play().catch(() => { vid.muted = true; vid.play(); });

    // Khởi tạo các chức năng
    setupWelcomeScreen(); // Màn hình Click to Enter
    setupButtons();       // Nút CV/Driver
    setupLinks();         // Link chuyển trang SPA
    runTypedEffect();     // Hiệu ứng chữ
    updateActiveNav();    // Highlight menu
});