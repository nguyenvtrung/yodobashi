// Hàm tiện ích để lấy phần tử DOM hoặc cảnh báo nếu không tìm thấy
function getElementByIdOrWarn(id) {
    const element = document.getElementById(id);
    if (!element) {
        console.warn(`Không tìm thấy phần tử có ID '${id}'.`);
    }
    return element;
}

// Hàm để phân tích cú pháp chuỗi ngày giờ từ input (ví dụ: "2024-07-09T14:30")
function parseInputDateTime(dateTimeString) {
    if (!dateTimeString) return null;
    const [datePart, timePart] = dateTimeString.split("T");
    if (!datePart || !timePart) return null;

    const [year, month, day] = datePart.split("-").map(Number);
    const [hour, minute] = timePart.split(":").map(Number);

    // Trả về đối tượng Date thay vì một đối tượng tùy chỉnh,
    // điều này giúp sử dụng Date API dễ dàng hơn
    return new Date(year, month - 1, day, hour, minute);
}

// Hàm để lưu thời gian hẹn vào localStorage
function saveAppointmentTime(dateObject) {
    if (dateObject instanceof Date && !isNaN(dateObject)) {
        // Lưu các thành phần riêng lẻ để tương thích với cấu trúc cũ nếu cần,
        // hoặc bạn có thể lưu thẳng chuỗi ISO nếu thoiGianMuaCountDown được cập nhật
        localStorage.setItem("thoiGianHen", JSON.stringify({
            nam: dateObject.getFullYear(),
            thang: dateObject.getMonth() + 1, // +1 vì tháng là 0-indexed
            ngay: dateObject.getDate(),
            gio: dateObject.getHours(),
            phut: dateObject.getMinutes(),
        }));
    } else {
        localStorage.removeItem("thoiGianHen");
    }
}

// Hàm để lấy và parse thời gian hẹn từ localStorage
function getAppointmentTimeFromLocalStorage() {
    const dateLocalString = localStorage.getItem("thoiGianHen");
    if (!dateLocalString) return null;

    try {
        const data = JSON.parse(dateLocalString);
        // Kiểm tra tính hợp lệ của dữ liệu đã parse
        if (
            data &&
            typeof data === "object" &&
            typeof data.nam === "number" &&
            typeof data.thang === "number" &&
            typeof data.ngay === "number" &&
            typeof data.gio === "number" &&
            typeof data.phut === "number"
        ) {
            // Trả về đối tượng Date
            const date = new Date(
                data.nam,
                data.thang - 1, 
                data.ngay,
                data.gio,
                data.phut
            );
            return isNaN(date.getTime()) ? null : date;
        }
    } catch (e) {
        console.error("Lỗi parse JSON hoặc dữ liệu không hợp lệ từ 'thoiGianHen':", e);
    }
    return null;
}

// Cập nhật giá trị input "thoiGianHen" từ localStorage khi tải trang
function initializeAppointmentInput() {
    const inputThoiGianHen = getElementByIdOrWarn("thoiGianHen");
    if (!inputThoiGianHen) return;

    const storedDate = getAppointmentTimeFromLocalStorage();
    if (storedDate) {
        // Định dạng lại thành chuỗi "YYYY-MM-DDTHH:MM" để gán vào input type="datetime-local"
        const year = storedDate.getFullYear();
        const month = String(storedDate.getMonth() + 1).padStart(2, "0");
        const day = String(storedDate.getDate()).padStart(2, "0");
        const hours = String(storedDate.getHours()).padStart(2, "0");
        const minutes = String(storedDate.getMinutes()).padStart(2, "0");
        inputThoiGianHen.value = `${year}-${month}-${day}T${hours}:${minutes}`;
    } else {
        inputThoiGianHen.value = ""; // Xóa giá trị nếu không có trong localStorage
    }
}

// Hàm cập nhật đếm ngược và hiển thị
function updateCountdownDisplay() {
    const displayElement = getElementByIdOrWarn("thoiGianMuaCountDown");
    const btnBatDau = document.getElementById("btnBatDau");
    if (!displayElement) return;

    const targetDate = getAppointmentTimeFromLocalStorage();

    if (!targetDate) {
        displayElement.innerHTML = "Không có thời gian hẹn được đặt.";
        btnBatDau.classList.remove('pointer-events-none');
        btnBatDau.classList.remove('opacity-50');
        return;
    }

    const now = new Date();
    const difference = targetDate.getTime() - now.getTime();
    btnBatDau.classList.add('pointer-events-none');
    btnBatDau.classList.add('opacity-50');
    

    if (difference <= 0) {
        displayElement.innerHTML = "Thời gian đã hết! Bắt đầu chạy";
        //Chạy khi  về 0
        btnBatDau.classList.remove('pointer-events-none');
        btnBatDau.classList.remove('opacity-50');
        btnBatDau.click();
        // Xóa interval nếu có
        const existingInterval = displayElement.dataset.countdownInterval;
        if (existingInterval) {
            clearInterval(Number(existingInterval));
            delete displayElement.dataset.countdownInterval;
        }
        return;
    }

    const seconds = Math.floor((difference / 1000) % 60);
    const minutes = Math.floor((difference / (1000 * 60)) % 60);
    const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));

    const formatNumber = (num) => String(num).padStart(2, "0");

    displayElement.innerHTML = `
        ${days} ngày ${formatNumber(hours)} giờ ${formatNumber(minutes)} phút ${formatNumber(seconds)} giây
    `;
}

export default function updateThoiGianHen() {
    initializeAppointmentInput(); // Cập nhật  khi tải trang

    const inputThoiGianHen = getElementByIdOrWarn("thoiGianHen");
    if (inputThoiGianHen) {
        inputThoiGianHen.addEventListener("change", () => {
            const thoiGianMoiValue = inputThoiGianHen.value; // Lấy giá trị trực tiếp từ input
            const parsedDate = parseInputDateTime(thoiGianMoiValue);
            saveAppointmentTime(parsedDate); 

            const displayElement = getElementByIdOrWarn("thoiGianMuaCountDown");
            if (displayElement && displayElement.dataset.countdownInterval) {
                clearInterval(Number(displayElement.dataset.countdownInterval));
                delete displayElement.dataset.countdownInterval;
            }

            // Bắt đầu đếm ngược mới ngay lập tức và thiết lập interval
            updateCountdownDisplay();
            const newInterval = setInterval(updateCountdownDisplay, 1000);
            if (displayElement) {
                displayElement.dataset.countdownInterval = newInterval; // Lưu interval ID vào dataset
            }
        });
    }

    // Khởi tạo đếm ngược lần đầu khi tải trang
    updateCountdownDisplay();
    const displayElement = getElementByIdOrWarn("thoiGianMuaCountDown");
    if (displayElement) {
        const initialInterval = setInterval(updateCountdownDisplay, 1000);
        displayElement.dataset.countdownInterval = initialInterval;
    }
}