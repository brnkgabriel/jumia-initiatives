const checkbox = document.querySelector('input[type="checkbox"]')

checkbox.addEventListener("click", evt => {
  const target = evt.target
  console.log("checked", target.checked)
})