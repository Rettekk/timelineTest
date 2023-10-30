let url = 'http://localhost:8080/https://feeds.feedburner.com/VideoCardzcom';

async function updateTimeline() {
    let parser = new RSSParser();

    const videocardzFeed = await parser.parseURL(url);
    console.log(videocardzFeed);

    const sortedItems = videocardzFeed.items.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
    const lastTenItems = sortedItems.slice(0, 5);

    let timelineDiv = document.querySelector('.timeline');
    lastTenItems.forEach(item => {
        let entryDiv = document.createElement('a');
        entryDiv.className = 'timeline-entry';
        entryDiv.href = item.link;
        entryDiv.target = '_blank';

        let dateBox = document.createElement('div');
        dateBox.className = 'date-box';
        let date = new Date(item.pubDate);
        dateBox.textContent = date.toLocaleDateString() + ' ' + date.toLocaleTimeString().slice(0, 5);
        entryDiv.appendChild(dateBox);

        let titleDiv = document.createElement('div');
        titleDiv.className = 'timeline-title';
        titleDiv.textContent = item.title;
        entryDiv.appendChild(titleDiv);

        timelineDiv.appendChild(entryDiv);
    });
}

updateTimeline().then(r => console.log('Updated timeline' + r));
