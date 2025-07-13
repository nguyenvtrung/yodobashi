export default function account() {
    const inputTaiKhoan = document.getElementById("taiKhoan");
    const inputMatKhau = document.getElementById("matKhau");

    let account = {};
    const storedAccount = localStorage.getItem("account");

    if (storedAccount) {
        account = JSON.parse(storedAccount);
        if (inputTaiKhoan && account.taiKhoan) {
            inputTaiKhoan.value = account.taiKhoan;
        }
        if (inputMatKhau && account.matKhau) {
            inputMatKhau.value = account.matKhau;
        }
    } else {
        account = {
            taiKhoan: inputTaiKhoan ? inputTaiKhoan.value : "",
            matKhau: inputMatKhau ? inputMatKhau.value : "",
        };
    }

    const saveAccountToLocalStorage = () => {
        const dataToSave = {
            taiKhoan: account.taiKhoan || "",
            matKhau: account.matKhau || "",
        };
        localStorage.setItem("account", JSON.stringify(dataToSave));
    };

    if (inputTaiKhoan) {
        inputTaiKhoan.addEventListener("change", (event) => {
            account.taiKhoan = event.target.value;
            saveAccountToLocalStorage();
        });
    }

    if (inputMatKhau) {
        inputMatKhau.addEventListener("change", (event) => {
            account.matKhau = event.target.value;
            saveAccountToLocalStorage();
        });
    }
    saveAccountToLocalStorage();
}
