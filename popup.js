const saveButton = document.getElementById("saveTimestamp");
const bookmarksContainer =
    document.getElementById("bookmarks");


saveButton.addEventListener("click", async () => {

    const tabs = await chrome.tabs.query({
        active: true,
        currentWindow: true
    });

    const tab = tabs[0];

    chrome.tabs.sendMessage(
        tab.id,
        {
            action: "GET_TIMESTAMP"
        },
        async (response) => {

            if (!response || !response.success) {
                alert("No YouTube video found.");
                return;
            }

            const bookmark = {
                timestamp: response.timestamp,
                url: tab.url,
                title: tab.title
            };

            const result = await chrome.storage.local.get(
                "bookmarks"
            );

            const bookmarks = result.bookmarks || [];

            bookmarks.push(bookmark);

            await chrome.storage.local.set({
                bookmarks
            });

            loadBookmarks();
        }
    );
});

function formatTime(seconds) {

    const minutes = Math.floor(seconds / 60);

    const remainingSeconds =
        Math.floor(seconds % 60);

    return `${minutes}:${remainingSeconds
        .toString()
        .padStart(2, "0")}`;
}

async function loadBookmarks() {

    const result =
        await chrome.storage.local.get("bookmarks");

    const bookmarks =
        result.bookmarks || [];

    bookmarksContainer.innerHTML = "";

    bookmarks.forEach((bookmark, index) => {

        const item = document.createElement("div");

        item.innerHTML = `
      <div>
        <strong>${formatTime(bookmark.timestamp)}</strong>
      </div>

      <div>
        ${bookmark.title}
      </div>
    `;

        item.style.cursor = "pointer";

        item.addEventListener("click", () => {

            const timestamp =
                Math.floor(bookmark.timestamp);

            const url =
                `${bookmark.url}&t=${timestamp}s`;

            chrome.tabs.create({
                url: url
            });

        });

        bookmarksContainer.appendChild(item);

    });
}