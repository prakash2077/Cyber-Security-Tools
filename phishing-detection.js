document.addEventListener("DOMContentLoaded", function () {
    const checkButton = document.querySelector(".btn-success");
    const urlInput = document.getElementById("url");
    const resultDiv = document.createElement("div");

    resultDiv.style.marginTop = "15px";
    resultDiv.style.fontWeight = "bold";
    resultDiv.style.textAlign = "center";
    resultDiv.style.color = "white";

    checkButton.parentNode.appendChild(resultDiv);

    checkButton.addEventListener("click", async function (event) {
        event.preventDefault();
        const url = urlInput.value.trim();
        if (!url) {
            resultDiv.innerText = "⚠️ Please enter a valid URL!";
            resultDiv.style.color = "orange";
            return;
        }

        try {
            const response = await fetch("https://safebrowsing.googleapis.com/v4/threatMatches:find?key=AIzaSyBLdIIohvQS35-SFLe3ZpkCPLyvI2hi3pg", {
                method: "POST",
                body: JSON.stringify({
                    client: { clientId: "phishing-detector", clientVersion: "1.0" },
                    threatInfo: {
                        threatTypes: ["MALWARE", "SOCIAL_ENGINEERING"],
                        platformTypes: ["ANY_PLATFORM"],
                        threatEntryTypes: ["URL"],
                        threatEntries: [{ url: url }]
                    }
                }),
                headers: { "Content-Type": "application/json" }
            });

            const data = await response.json();
            if (data.matches) {
                resultDiv.innerText = "🚨 This site is PHISHING!";
                resultDiv.style.color = "red";
            } else {
                resultDiv.innerText = "✅ This site is SAFE!";
                resultDiv.style.color = "green";
            }
        } catch (error) {
            console.error("Phishing detection error:", error);
            resultDiv.innerText = "❌ Error checking URL. Try again.";
            resultDiv.style.color = "yellow";
        }
    });
});
