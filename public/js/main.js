// Disaster alert system
const disasterTypes = ['flood', 'earthquake', 'hurricane', 'drought'];

const alertMessages = {
  flood: (location) => `Warning: Water logging detected in ${location}!`,
  earthquake: (data) => `Warning: Earthquake detected near ${data.location} with magnitude ${data.magnitude}.`,
  hurricane: (location) => `Warning: Hurricane detected near ${location}. Please take precautions!`,
  drought: (location) => `Warning: Drought detected in ${location}. Low rainfall and high temperatures recorded.`
};

function checkDisaster(type, location) {
  return fetch(`/check-${type}?location=${encodeURIComponent(location)}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    });
}

function handleAlertSubmit(event) {
  event.preventDefault();
  const form = event.target;
  const disasterType = form.id.split('-')[0];
  const location = document.getElementById(`${disasterType}-location`).value.trim();
  const resultDiv = document.getElementById(`${disasterType}-result`);

  resultDiv.textContent = `Checking ${disasterType} data...`;

  checkDisaster(disasterType, location)
    .then(data => {
      const isDisaster = data[`is${disasterType.charAt(0).toUpperCase() + disasterType.slice(1)}`];
      resultDiv.textContent = isDisaster 
        ? alertMessages[disasterType](location)
        : `No ${disasterType} activity detected in ${location}.`;
    })
    .catch(error => {
      resultDiv.textContent = `Error checking ${disasterType} data.`;
      console.error('Error:', error);
    });
}

// Set up event listeners for all disaster alert forms
disasterTypes.forEach(type => {
  const form = document.getElementById(`${type}-form`);
  if (form) {
    form.addEventListener('submit', handleAlertSubmit);
  }
});

// Additional site functionality can be added here