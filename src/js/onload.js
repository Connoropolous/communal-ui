
// Prevents backspace except in the case of textareas and text inputs to prevent user navigation.
document.addEventListener('keydown', function (e) {
  var preventKeyPress = false

  if (e.keyCode === 8) {
    var d = e.srcElement || e.target
    switch (d.tagName.toUpperCase()) {
      case 'TEXTAREA':
        preventKeyPress = d.readOnly || d.disabled
        break
      case 'INPUT':
        preventKeyPress = d.readOnly || d.disabled ||
          (d.attributes.type && _.contains(['radio', 'checkbox', 'submit', 'button'], d.attributes.type.value.toLowerCase()))
        break
      case 'DIV':
        preventKeyPress = d.readOnly || d.disabled || !(d.attributes.contentEditable && d.attributes.contentEditable.value === 'true')
        break
      default:
        preventKeyPress = true
        break
    }
  }

  if (preventKeyPress) e.preventDefault()
})
