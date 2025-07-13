import addLink from "./addLink.js";
import updateThoiGianHen from "./updateThoiGianHen.js";
import soLuongMua from "./soLuongMua.js";
import account from "./account.js";

const APP = {
    TAB_OPEN_DELAY: 500,
    openAllLinks: () => {
        const listSP = JSON.parse(localStorage.getItem("listSP")) || [];
        const soLuong = JSON.parse(localStorage.getItem("soLuongMua")) || [];

        if (listSP.length === 0) {
            console.log(
                "Không tìm thấy liên kết nào trong localStorage để mở."
            );
            alert("Không có liên kết sản phẩm nào để mở.");
            return;
        }

        let index = 0;
        const openNextLink = () => {
            if (index < listSP.length) {
                const linkToOpen = listSP[index];
                const maxWidth = window.screen.width;
                const maxHeight = window.screen.height;
                const maxWTab = 2;
                const maxHTab = 3;
                let w = maxWidth / maxWTab;
                let h = maxHeight / maxHTab;
                let c = 0;
                let r = index;
                if (r >= maxWTab) {
                    r = r % maxWTab;
                    c = Math.floor(index / maxWTab);
                }

                window.open(
                    `${linkToOpen}?soluong=${
                        Number(soLuong) || 1
                    }&status=active`,
                    "_blank",
                    // `Popup_Window_${index}`,
                    // `width=${w},height=${h},left=${r * w},top=${
                    //     c * h
                    // },resizable=yes,scrollbars=yes,status=yes`
                );
                index++;
                r++;
                setTimeout(openNextLink, APP.TAB_OPEN_DELAY);
            } else {
                console.log("Đã mở tất cả các liên kết trong danh sách.");
            }
        };
        console.log(
            `Bắt đầu mở ${listSP.length} liên kết với độ trễ ${APP.TAB_OPEN_DELAY}ms mỗi liên kết.`
        );
        openNextLink();
    },

    btnBatDau: () => {
        const btn = document.getElementById("btnBatDau");
        btn.addEventListener("click", () => {
            APP.openAllLinks();
        });
    },

    start: () => {
        addLink();
        updateThoiGianHen();
        soLuongMua();
        account();
        APP.btnBatDau();
    },
};

APP.start();
