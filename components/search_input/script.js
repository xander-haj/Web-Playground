export default function(previewElement) {
    const searchBox = previewElement.querySelector('#search-box');
    const suggestionsList = previewElement.querySelector('#suggestions-list');

    const searchData = [
        'Apple', 'Apricot', 'Avocado', 'Banana', 'Blackberry', 'Blueberry',
        'Cherry', 'Coconut', 'Cranberry', 'Date', 'Dragonfruit', 'Durian',
        'Elderberry', 'Fig', 'Grape', 'Grapefruit', 'Guava', 'Honeydew',
        'Kiwi', 'Lemon', 'Lime', 'Lychee', 'Mango', 'Nectarine', 'Orange',
        'Papaya', 'Passionfruit', 'Peach', 'Pear', 'Persimmon', 'Pineapple'
    ];

    let currentSuggestionIndex = -1;

    searchBox.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        if (query.length === 0) {
            hideSuggestions();
            return;
        }
        const matches = searchData.filter(item => item.toLowerCase().includes(query));
        showSuggestions(matches, query);
    });

    searchBox.addEventListener('keydown', (e) => {
        const suggestions = suggestionsList.querySelectorAll('li');
        if (suggestions.length === 0) return;

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                currentSuggestionIndex = (currentSuggestionIndex + 1) % suggestions.length;
                updateActiveSuggestion(suggestions);
                break;
            case 'ArrowUp':
                e.preventDefault();
                currentSuggestionIndex = (currentSuggestionIndex - 1 + suggestions.length) % suggestions.length;
                updateActiveSuggestion(suggestions);
                break;
            case 'Enter':
                e.preventDefault();
                if (currentSuggestionIndex >= 0) {
                    selectSuggestion(suggestions[currentSuggestionIndex].dataset.value);
                }
                break;
            case 'Escape':
                hideSuggestions();
                break;
        }
    });
    
    document.addEventListener('click', (e) => {
        if (!previewElement.contains(e.target)) {
            hideSuggestions();
        }
    });

    function showSuggestions(matches, query) {
        suggestionsList.innerHTML = '';
        currentSuggestionIndex = -1;
        if(matches.length === 0) {
            hideSuggestions();
            return;
        }

        matches.forEach(match => {
            const li = document.createElement('li');
            li.setAttribute('role', 'option');
            li.dataset.value = match;
            const regex = new RegExp(`(${query})`, 'gi');
            li.innerHTML = match.replace(regex, '<strong>$1</strong>');
            li.addEventListener('click', () => selectSuggestion(match));
            suggestionsList.appendChild(li);
        });

        suggestionsList.hidden = false;
        searchBox.setAttribute('aria-expanded', 'true');
    }

    function hideSuggestions() {
        suggestionsList.hidden = true;
        searchBox.setAttribute('aria-expanded', 'false');
        currentSuggestionIndex = -1;
    }

    function updateActiveSuggestion(suggestions) {
        suggestions.forEach((suggestion, index) => {
            suggestion.classList.toggle('active', index === currentSuggestionIndex);
            if(index === currentSuggestionIndex) {
                suggestion.scrollIntoView({ block: 'nearest' });
            }
        });
    }

    function selectSuggestion(value) {
        searchBox.value = value;
        hideSuggestions();
        console.log('Selected:', value);
    }
    lucide.createIcons();
}
