function simulateTelemetry() {
  const temp = (28 + Math.random() * 5).toFixed(1);
  const moisture = (40 + Math.random() * 20).toFixed(1);
  const humidity = (50 + Math.random() * 10).toFixed(1);

  document.getElementById('temp').textContent = temp;
  document.getElementById('moisture').textContent = moisture;
  document.getElementById('humidity').textContent = humidity;
}
setInterval(simulateTelemetry, 3000);
simulateTelemetry();

fetch('/api/crops')
  .then(res => res.json())
  .then(data => {
    const container = document.getElementById('image-container');
    let index = 0;

function showImage() {
  const crop = data[Math.floor(Math.random() * data.length)];
  container.innerHTML = `
    <h3>Plot ${crop.plot} - ${crop.status}</h3>
    <img src="assets/mock-images/${crop.image}" width="300" />
  `;
}

    showImage();
    setInterval(showImage, 5000);
  });

  const printTasks = [
  "Drone Arm v2.1",
  "Sensor Mount v1.3",
  "Propeller Guard v1.0",
  "Pesticide Dispenser v2.5",
  "Battery Tray v3.0"
];

function simulatePrintQueue() {
  const taskList = document.getElementById('print-tasks');
  const task = printTasks[Math.floor(Math.random() * printTasks.length)];
  const li = document.createElement("li");
  li.textContent = `🖨️ Printing: ${task}`;
  taskList.prepend(li);
  if (taskList.children.length > 5) taskList.removeChild(taskList.lastChild);
}
setInterval(simulatePrintQueue, 4000);

function handleCommand() {
  const input = document.getElementById("commandInput").value.toLowerCase();
  const output = document.getElementById("commandOutput");
  let response = "";

  if (input.includes("start scan")) {
    response = "✅ Drone scan started on Field 2.";
  } else if (input.includes("pause") || input.includes("stop")) {
    response = "🛑 Operation paused.";
  } else if (input.includes("status")) {
    response = "📡 System status: Battery 83%, connectivity stable.";
  } else if (input.includes("spray") || input.includes("water")) {
    response = "💧 Spraying pesticide in zone 3.";
  } else {
    response = "🤖 Command not recognized. Try: 'Start scan', 'Show status', 'Spray crops'";
  }

  output.textContent = `👤 You: ${input}\n\n${response}`;
  document.getElementById("commandInput").value = '';
}


function startListening() {
  if (!('webkitSpeechRecognition' in window)) {
    alert("Sorry, your browser doesn't support speech recognition.");
    return;
  }

  const recognition = new webkitSpeechRecognition();
  recognition.lang = 'en-US';
  recognition.interimResults = false;

  recognition.onresult = function(event) {
    const command = event.results[0][0].transcript;
    document.getElementById("commandInput").value = command;
    handleCommand();
  };

  recognition.onerror = function(event) {
    alert("Error occurred in recognition: " + event.error);
  };

  recognition.start();
}


