fetch("data/news.json")
  .then(response => response.json())
  .then(newsList => {
    const container = document.getElementById("news-container");

    // Sort by date descending
    newsList.sort((a, b) => new Date(b.date) - new Date(a.date));

    newsList.forEach(entry => {
      const item = document.createElement("div");
      item.className = "news-item";

      item.innerHTML = `
        <div class="news-date">${entry.date}</div>
        <div class="news-text">${entry.text}</div>
      `;

      container.appendChild(item);
    });
  })
  .catch(err => console.error("Failed to load news:", err));
