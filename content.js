chrome.runtime.onMessage.addListener(
    (message, sender, sendResponse) => {

        if (message.action === "GET_TIMESTAMP") {

            const video = document.querySelector("video");

            if (!video) {
                sendResponse({
                    success: false
                });

                return;
            }

            sendResponse({
                success: true,
                timestamp: video.currentTime
            });
        }

        return true;
    }
);