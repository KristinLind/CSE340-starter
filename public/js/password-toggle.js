const toggleBtn = document.querySelector(".toggle-password")
const pwdInput = document.getElementById("account_password")

if (toggleBtn && pwdInput) {
  toggleBtn.addEventListener("click", () => {
    const isPassword = pwdInput.type === "password"
    pwdInput.type = isPassword ? "text" : "password"
    toggleBtn.textContent = isPassword ? "🙈" : "👁️"
    toggleBtn.setAttribute("aria-pressed", String(isPassword))
  })
}

