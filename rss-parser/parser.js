let url = 'http://localhost:8080/https://feeds.feedburner.com/VideoCardzcom';

async function updateTimeline() {
    try {
        let parser = new RSSParser();
        const videocardzFeed = await parser.parseURL(url);
        const sortedItems = videocardzFeed.items.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
        const lastTenItems = sortedItems.slice(0, 10);

        let timelineDiv = document.querySelector('.timeline');
        timelineDiv.innerHTML = '';
        lastTenItems.forEach(async item => {
            let entryDiv = document.createElement('a');
            entryDiv.className = 'timeline-entry';
            entryDiv.href = item.link;
            entryDiv.target = '_blank';

            let dateBox = document.createElement('div');
            dateBox.className = 'date-box';
            let date = new Date(item.pubDate);
            dateBox.textContent = date.toLocaleDateString() + ' ' + date.toLocaleTimeString().slice(0, 5);
            entryDiv.appendChild(dateBox);

            let imgDiv = document.createElement('div');
            imgDiv.className = 'timeline-image';
            entryDiv.appendChild(imgDiv);

            let titleDiv = document.createElement('div');
            titleDiv.className = 'timeline-title';
            titleDiv.textContent = item.title;
            entryDiv.appendChild(titleDiv);

            timelineDiv.appendChild(entryDiv);

            let imgSrc = await fetchAndParseImageURL(item.link);
            if (imgSrc) {
                let img = document.createElement('img');
                img.className = 'timeline-img';
                img.src = imgSrc;
                imgDiv.appendChild(img);
            }
        });
    } catch (e) {
        console.error(e)
    }
}

updateTimeline().then(r => r);

async function fetchAndParseImageURL(articleURL) {
    try {
        const response = await fetch('http://localhost:8080/' + articleURL);
        const htmlText = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlText, 'text/html');
        const img = doc.querySelector('img.aligncenter');

        if (img) {
            return img.src;
        }
    } catch (error) {
        console.error('Fehler beim Abrufen oder Parsen der URL', error);
    }
}