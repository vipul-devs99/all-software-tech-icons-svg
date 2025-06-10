const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
    sourceDir: path.join(__dirname, 'icons'),
    outputDir: path.join(__dirname, 'public'),
    previewFile: path.join(__dirname, 'public', 'index.html')
};

// Ensure output directory exists
if (!fs.existsSync(CONFIG.outputDir)) {
    fs.mkdirSync(CONFIG.outputDir, { recursive: true });
}

// Get all SVG files from the source directory
function getSvgFiles(dir) {
    try {
        if (!fs.existsSync(dir)) {
            console.error(`Source directory does not exist: ${dir}`);
            return [];
        }
        
        const files = fs.readdirSync(dir);
        return files
            .filter(file => file.toLowerCase().endsWith('.svg'))
            .map(file => ({
                name: file,
                path: path.join(dir, file)
            }));
    } catch (error) {
        console.error(`Error reading directory ${dir}:`, error);
        return [];
    }
}

// Format the filename to a display name
function formatName(filename) {
    if (!filename) return '';
    
    // Remove .svg extension
    let name = filename.replace(/\.svg$/i, '');
    
    // Common replacements for better display
    const replacements = [
        { pattern: /\(CSharp\)/i, replacement: '(C#)' },
        { pattern: /\(CPlusPlus\)/i, replacement: '(C++)' },
        { pattern: /\(FSharp\)/i, replacement: '(F#)' },
        { pattern: /dotnet/gi, replacement: '.NET' },
        { pattern: /jsx?/gi, replacement: match => match.toUpperCase() },
        { pattern: /^node-?(js)?/i, replacement: 'Node.js' },
        { pattern: /typescript/i, replacement: 'TypeScript' },
        { pattern: /javascript/i, replacement: 'JavaScript' },
        { pattern: /html/gi, replacement: 'HTML' },
        { pattern: /css/gi, replacement: 'CSS' },
        { pattern: /api/gi, replacement: 'API' },
        { pattern: /sass/gi, replacement: 'Sass' },
        { pattern: /scss/gi, replacement: 'SCSS' },
        { pattern: /github/gi, replacement: 'GitHub' },
        { pattern: /gitlab/gi, replacement: 'GitLab' },
        { pattern: /bitbucket/gi, replacement: 'Bitbucket' },
        { pattern: /[-_]+/g, replacement: ' ' } // Replace all hyphens and underscores with spaces
    ];
    
    // Apply all replacements
    replacements.forEach(({ pattern, replacement }) => {
        if (typeof replacement === 'function') {
            name = name.replace(pattern, replacement);
        } else {
            name = name.replace(pattern, replacement);
        }
    });
    
    // Capitalize first letter of each word, preserving acronyms
    name = name.split(' ')
        .map(word => {
            // Skip words that are all uppercase (acronyms)
            if (/^[A-Z0-9]{2,}$/.test(word)) {
                return word;
            }
            // Handle words with dots (like .NET, ASP.NET)
            if (word.includes('.')) {
                return word.split('.')
                    .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
                    .join('.');
            }
            // Default capitalization
            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        })
        .join(' ');
    
    return name;
}

// Generate the HTML preview
function generatePreview(icons) {
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tech Icons Collection</title>
    <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🎨</text></svg>">
    <meta name="description" content="Browse and search through a collection of technology icons in SVG format">
    <meta name="theme-color" content="#3498db">
    <style>
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f5f5f5;
            padding: 20px;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
        }
        header {
            text-align: center;
            margin-bottom: 30px;
            padding: 20px 0;
        }
        h1 {
            margin-bottom: 10px;
            color: #2c3e50;
        }
        .search-container {
            margin: 20px 0;
            text-align: center;
        }
        #search {
            padding: 10px 20px;
            width: 100%;
            max-width: 500px;
            border: 2px solid #ddd;
            border-radius: 25px;
            font-size: 16px;
            outline: none;
            transition: border-color 0.3s;
        }
        #search:focus {
            border-color: #3498db;
        }
        #icon-count {
            display: inline-block;
            background: #3498db;
            color: white;
            padding: 5px 15px;
            border-radius: 20px;
            margin-top: 10px;
            font-size: 14px;
        }
        .icons-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
            gap: 20px;
            margin-top: 20px;
        }
        .icon-card {
            background: white;
            border-radius: 8px;
            padding: 20px 15px;
            text-align: center;
            cursor: pointer;
            transition: all 0.2s ease;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: flex-start;
            height: 100%;
            position: relative;
            overflow: hidden;
        }
        
        .icon-container {
            width: 64px;
            height: 64px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 12px;
        }
        .icon-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 20px rgba(0,0,0,0.1);
        }
        .icon {
            max-width: 100%;
            max-height: 100%;
            object-fit: contain;
            transition: transform 0.2s ease;
        }
        
        .icon-card:hover .icon {
            transform: scale(1.1);
        }
        
        .icon-filename {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            background: rgba(0,0,0,0.8);
            color: white;
            font-size: 10px;
            padding: 4px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            opacity: 0;
            transition: opacity 0.2s ease;
            border-bottom-left-radius: 8px;
            border-bottom-right-radius: 8px;
        }
        
        .icon-card:hover .icon-filename {
            opacity: 1;
        }
        .icon-name {
            font-size: 14px;
            color: #2c3e50;
            margin-top: 5px;
            word-break: break-word;
        }
        .no-results {
            grid-column: 1 / -1;
            text-align: center;
            padding: 40px 20px;
            color: #7f8c8d;
        }
        .no-results svg {
            width: 48px;
            height: 48px;
            margin-bottom: 15px;
            color: #bdc3c7;
        }
        .no-results h3 {
            margin-bottom: 10px;
            color: #2c3e50;
        }
        footer {
            text-align: center;
            margin-top: 40px;
            padding: 20px 0;
            color: #7f8c8d;
            font-size: 14px;
        }
        @media (max-width: 768px) {
            .icons-grid {
                grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
                gap: 15px;
            }
            .icon-card {
                padding: 15px 10px;
            }
            .icon {
                width: 40px;
                height: 40px;
            }
            .icon-name {
                font-size: 12px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>Tech Icons Collection</h1>
            <p>A collection of ${icons.length} technology icons in SVG format</p>
        </header>
        
        <div class="search-container">
            <input type="text" id="search" placeholder="Search ${icons.length} icons...">
            <div id="icon-count">${icons.length} icons</div>
        </div>
        
        <div class="icons-grid" id="icons-container">
            ${icons.map(icon => `
                <div class="icon-card" data-name="${icon.displayName.toLowerCase()}" data-filename="${icon.originalName}">
                    <div class="icon-container">
                        <img src="${icon.filename}" alt="${icon.displayName}" class="icon" loading="lazy" onerror="this.onerror=null; this.src='data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0iI2RjZGNkYyIgZD0iTTEyIDJBMTAgMTAgMCAwIDAgMiAxMkExMCAxMCAwIDAgMCAxMiAyMkExMCAxMCAwIDAgMCAyMiAxMkExMCAxMCAwIDAgMCAxMiAyTTE3IDE4SDEzVjE0SDExVjE4SDdWMTBIMTdWMThNMTUgMTZIMTNWMTJIMTVWMTZNMTEgMTZIOVYxMkgxMVYxNloiLz48L3N2Zz4='">
                    </div>
                    <div class="icon-name">${icon.displayName}</div>
                    <div class="icon-filename">${icon.originalName}</div>
                </div>
            `).join('')}
        </div>
        
        <footer>
            <p>© ${new Date().getFullYear()} Tech Icons Collection. All icons are property of their respective owners.</p>
        </footer>
    </div>

    <script>
        const icons = ${JSON.stringify(icons, null, 2)};
        const container = document.getElementById('icons-container');
        const searchInput = document.getElementById('search');
        const iconCount = document.getElementById('icon-count');
        
        // Store the original HTML for restoring after search
        const originalHTML = container.innerHTML;
        
        // Function to filter icons based on search term
        function filterIcons(searchTerm) {
            const term = searchTerm.toLowerCase().trim();
            
            if (!term) {
                // If search is empty, restore original HTML
                container.innerHTML = originalHTML;
                iconCount.textContent = \`\${icons.length} \${icons.length === 1 ? 'icon' : 'icons'}\`;
                return;
            }
            
            const cards = container.querySelectorAll('.icon-card');
            let visibleCount = 0;
            
            cards.forEach(card => {
                const name = card.getAttribute('data-name');
                const filename = card.getAttribute('data-filename').toLowerCase();
                const isVisible = name.includes(term) || filename.includes(term);
                card.style.display = isVisible ? 'flex' : 'none';
                if (isVisible) visibleCount++;
            });
            
            // Update the icon count
            iconCount.textContent = \`\${visibleCount} \${visibleCount === 1 ? 'icon' : 'icons'}\`;
            
            // Show no results message if no icons match
            if (visibleCount === 0) {
                container.innerHTML = \`
                    <div class="no-results">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                            <line x1="11" y1="8" x2="11" y2="14"></line>
                            <line x1="11" y1="16" x2="11.01" y2="16"></line>
                        </svg>
                        <h3>No icons found</h3>
                        <p>Try adjusting your search or check back later for more icons.</p>
                    </div>
                \`;
            }
        }
        
        // Add event listener for search input
        searchInput.addEventListener('input', (e) => {
            filterIcons(e.target.value);
        });
        
        // Add click handler to copy icon filename
        document.addEventListener('click', (e) => {
            const card = e.target.closest('.icon-card');
            if (card && !card.classList.contains('no-results')) {
                const filename = card.getAttribute('data-filename');
                if (filename && navigator.clipboard) {
                    navigator.clipboard.writeText(filename).then(() => {
                        const originalText = card.querySelector('.icon-name').textContent;
                        const iconName = card.querySelector('.icon-name');
                        iconName.textContent = 'Copied!';
                        iconName.style.color = '#4CAF50';
                        
                        setTimeout(() => {
                            iconName.textContent = originalText;
                            iconName.style.color = '';
                        }, 2000);
                    }).catch(err => {
                        console.error('Failed to copy filename:', err);
                        // Fallback for older browsers
                        const textArea = document.createElement('textarea');
                        textArea.value = filename;
                        document.body.appendChild(textArea);
                        textArea.select();
                        try {
                            document.execCommand('copy');
                            const originalText = card.querySelector('.icon-name').textContent;
                            const iconName = card.querySelector('.icon-name');
                            iconName.textContent = 'Copied!';
                            iconName.style.color = '#4CAF50';
                            
                            setTimeout(() => {
                                iconName.textContent = originalText;
                                iconName.style.color = '';
                            }, 2000);
                        } catch (err) {
                            console.error('Fallback copy failed:', err);
                        }
                        document.body.removeChild(textArea);
                    });
                }
            }
        });
    </script>
</body>
</html>`;
    
    return html;
}

// Main function to generate the preview
function generateIconPreview() {
    try {
        console.log('Generating icon preview...');
        console.log(`Looking for icons in: ${CONFIG.sourceDir}`);
        
        // Get all SVG files
        const svgFiles = getSvgFiles(CONFIG.sourceDir);
        
        if (svgFiles.length === 0) {
            console.error('No SVG files found in the icons directory');
            console.log('Please ensure you have SVG files in the following directory:');
            console.log(CONFIG.sourceDir);
            return;
        }
        
        console.log(`Found ${svgFiles.length} SVG files`);
        
        // Process icons
        const icons = svgFiles.map(file => ({
            filename: `../icons/${file.name}`,
            displayName: formatName(file.name),
            originalName: file.name
        }));
        
        // Sort icons alphabetically
        icons.sort((a, b) => a.displayName.localeCompare(b.displayName));
        
        // Generate HTML
        const html = generatePreview(icons);
        
        // Write to file
        fs.writeFileSync(CONFIG.previewFile, html, 'utf8');
        
        console.log(`✅ Successfully generated preview with ${icons.length} icons`);
        console.log(`📁 Preview file: ${CONFIG.previewFile}`);
        console.log(`🌐 Open the preview in your browser to view the icons`);
    } catch (error) {
        console.error('❌ Error generating icon preview:', error);
        process.exit(1);
    }
}

// Run the generator
generateIconPreview();