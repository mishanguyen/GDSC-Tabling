// The rest of your existing code...
const URL = "./";

let model, webcam, labelContainer, maxPredictions;

async function init() {
    const hideButton = document.getElementById("start-btn");
    hideButton.style.display = "none";

    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    // Load the model and metadata
    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();
    
    // Setup webcam
    const flip = true; // Whether to flip the webcam
    webcam = new tmImage.Webcam(450, 450, flip); // Width, height, flip
    await webcam.setup(); // Request access to the webcam
    await webcam.play();
    window.requestAnimationFrame(loop);
    // Append elements to the DOM
    document.getElementById("webcam-container").appendChild(webcam.canvas);
    labelContainer = document.getElementById("label-container");
    for (let i = 0; i < maxPredictions; i++) { // and class labels
        labelContainer.appendChild(document.createElement("div"));
    }
    const info = document.getElementById("info");
    info.style.display = "flex";
    const info1 = document.getElementById("info1");
    info1.style.display = "flex";

    // Switching colors for SHOW GDSC
    const colors = ["#4285F4", "#34A853", "#FBBC05", "#EA4335"];
    const textElement = document.getElementById("text");
    const content = textElement.textContent;

    // Clear the original content
    textElement.innerHTML = '';

    for (let i = 0; i < content.length; i++) {
        // Create a new span for each letter
        const letterSpan = document.createElement("span");

        // Apply alternating colors
        const color = colors[i % colors.length];
        letterSpan.style.color = color;

        // Set the letter as the content of the new span
        letterSpan.textContent = content[i];

        // Append the new span to the original container
        textElement.appendChild(letterSpan);
    }

    const textElement1 = document.getElementById("text1");
    const content1 = textElement1.textContent;

    // Clear the original content
    textElement1.innerHTML = '';

    for (let i = 0; i < content.length; i++) {
        // Create a new span for each letter
        const letterSpan1 = document.createElement("span");

        // Apply alternating colors
        const color1 = colors[i % colors.length];
        letterSpan1.style.color = color1;

        // Set the letter as the content of the new span
        letterSpan1.textContent = content1[i];

        // Append the new span to the original container
        textElement1.appendChild(letterSpan1);
    }

    
}

async function loop() {
    webcam.update(); // update the webcam frame
    await predict();
    window.requestAnimationFrame(loop);
}

// run the webcam image through the image model
async function predict() {
    // if (countdown <= 0) {
    //     clearInterval(timerId); // Stop the timer
    //     labelContainer.innerHTML = "Time's up!"; // Display the message
    // }
    // predict can take in an image, video, or canvas HTML element
    const prediction = await model.predict(webcam.canvas);

    // Find the class with the highest probability
    let maxProbability = 0;
    let maxPredictionIndex = 0;
    for (let i = 0; i < maxPredictions; i++) {
        const probability = prediction[i].probability;
        if (probability > maxProbability) {
            maxProbability = probability;
            maxPredictionIndex = i;
        }
    }
    // Display only the maximum prediction
    const maxPrediction = prediction[maxPredictionIndex];
    const classPrediction = maxPrediction.className;
    const logo = document.getElementById("letters1");
    if (classPrediction === "yes") {
        logo.style.color = "#34A853";
    } else {
        logo.style.color = "#EA4335";
    }
}
