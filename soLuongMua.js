export default function soLuongMua() {
    const inputSoLuongMua = document.getElementById("soLuongMua");
    const storedSoLuongMua = JSON.parse(localStorage.getItem("soLuongMua"));

    if (storedSoLuongMua) {
        inputSoLuongMua.value = storedSoLuongMua;
    }

    inputSoLuongMua.addEventListener("change", () => {
        const soLuongMoi = document.getElementById("soLuongMua");
        if (soLuongMoi.value) {
            localStorage.setItem("soLuongMua", JSON.stringify(soLuongMoi.value));
        } else {
            localStorage.removeItem("soLuongMua");
        }
    });
}