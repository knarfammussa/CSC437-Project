function relayEvent(event) {
    const customEvent = new CustomEvent('darkmode:toggle', {
      detail: { checked: event.target.checked },
      bubbles: true,
      cancelable: true
    });
  
    event.target.closest('label').dispatchEvent(customEvent);
  
    event.stopPropagation();
}
  
document.querySelector('label').addEventListener('change', relayEvent);
  

document.body.addEventListener('darkmode:toggle', function(event) {
    if (event.detail.checked) {
        document.body.classList.add('dark-mode');
      } else {
        document.body.classList.remove('dark-mode');
      }
});
  