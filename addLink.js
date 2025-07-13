export default function addLink() {
    const loadProductLinks = () => {
        const productListContainer = document.querySelector(
            "#formInputLinkMuaHang_lists"
        );
        const listSP = JSON.parse(localStorage.getItem("listSP")) || [];
        productListContainer.innerHTML = "";
        listSP.forEach((linkSanPham) => {
            const productLinkElement = createProductLinkElement(linkSanPham);
            productListContainer.appendChild(productLinkElement);
        });
    };

    const createProductLinkElement = (linkSanPham) => {
        const wrapperDiv = document.createElement("div");
        wrapperDiv.className =
            "flex items-center justify-between p-1 my-1 bg-white rounded-sm";

        const pElement = document.createElement("a");
        pElement.className = "text-xs text-indigo-800 cursor-pointer flex-grow";
        pElement.href = linkSanPham;
        pElement.target = "_blank";
        pElement.textContent = `${String(linkSanPham).substring(
            String(linkSanPham).indexOf("product/") !== -1
                ? String(linkSanPham).indexOf("product/") + 8
                : 0,
            linkSanPham.length - 1
        )} `;

        // Tạo nút "Xem"
        const viewButton = document.createElement("button");
        viewButton.textContent = "Xem";
        viewButton.className =
            "ml-2 px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50";

        // Thêm sự kiện click cho nút "Xem"
        viewButton.addEventListener("click", (event) => {
            event.stopPropagation();
            window.open(
                linkSanPham,
                "Popup Window",
                `width=${screen.width / 1.5},height=${
                    screen.height / 1.5
                },left=${(screen.width - screen.width / 1.5) / 2},top=${
                    (screen.height - screen.height / 1.5) / 2
                },resizable=yes,scrollbars=yes,status=yes`
            );
            console.log("Đã mở link xem:", linkSanPham);
        });

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Xóa";
        deleteButton.className =
            "ml-2 px-2 py-1 bg-red-700 text-white text-xs rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50";

        deleteButton.addEventListener("click", (event) => {
            event.stopPropagation();
            deleteProductLink(linkSanPham);
        });

        const buttonContainer = document.createElement("div");
        buttonContainer.className = "flex space-x-1";

        buttonContainer.appendChild(viewButton);
        buttonContainer.appendChild(deleteButton);

        wrapperDiv.appendChild(pElement);
        wrapperDiv.appendChild(buttonContainer);

        return wrapperDiv;
    };

    const deleteProductLink = (linkToDelete) => {
        let listSP = JSON.parse(localStorage.getItem("listSP")) || [];

        listSP = listSP.filter((link) => link !== linkToDelete);

        localStorage.setItem("listSP", JSON.stringify(listSP));

        loadProductLinks();
        console.log("Đã xóa link:", linkToDelete);
    };

    const btnThemSanPham = document.querySelector("#btnThemSanPham");
    if (btnThemSanPham) {
        btnThemSanPham.addEventListener("click", () => {
            let listSP = JSON.parse(localStorage.getItem("listSP")) || [];
            const linkSanPhamInput = document.querySelector("#linksanpham");
            const linkSanPham = linkSanPhamInput.value.trim();

            if (linkSanPham.length === 0) {
                alert("Chưa nhập link sản phẩm");
                return;
            }

            if (listSP.includes(linkSanPham)) {
                alert("Link sản phẩm này đã tồn tại!");
                return;
            }

            listSP = [...listSP, linkSanPham];
            localStorage.setItem("listSP", JSON.stringify(listSP));
            loadProductLinks();

            alert("Thêm sản phẩm thành công");
            linkSanPhamInput.value = "";
            console.log(listSP);
        });
    }

    loadProductLinks();
}
