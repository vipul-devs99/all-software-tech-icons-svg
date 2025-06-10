const fs = require('fs');
const path = require('path');

// Function to get all SVG files in the directory
function getSvgFiles(dir) {
    try {
        const files = fs.readdirSync(dir);
        const svgFiles = [];
        
        files.forEach(file => {
            // Only process SVG files
            if (file.toLowerCase().endsWith('.svg')) {
                svgFiles.push({
                    path: path.join(dir, file),
                    name: file
                });
            }
        });
        
        return svgFiles;
    } catch (error) {
        console.error(`Error reading directory ${dir}:`, error);
        return [];
    }
}

// Function to convert filename to a display name
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

// Generate the icons data
function generateIconsData() {
    try {
        const iconsDir = path.join(__dirname, '../../icons');  // Changed from src/icons to icons
        const svgFiles = getSvgFiles(iconsDir);
        
        console.log(`Found ${svgFiles.length} SVG files in ${iconsDir}`);
        
        const icons = svgFiles.map(file => {
            const displayName = formatName(file.name);
            const relativePath = `../icons/${file.name}`;
            
            return {
                name: displayName,
                filename: relativePath,
                originalName: file.name
            };
        });
        
        // Sort icons alphabetically by display name
        icons.sort((a, b) => a.name.localeCompare(b.name));
        
        return icons;
    } catch (error) {
        console.error('Error generating icons data:', error);
        return [];
    }
}

// Update the preview.html file with the icons data
function updatePreviewFile() {
    try {
        const icons = generateIconsData();
        const previewDir = path.join(__dirname, '../../public');
        const previewPath = path.join(previewDir, 'preview.html');
        
        // Create public directory if it doesn't exist
        if (!fs.existsSync(previewDir)) {
            fs.mkdirSync(previewDir, { recursive: true });
        }
        
        console.log(`Generating preview with ${icons.length} icons...`);
        
        // Create a simple HTML template with the icons
        const htmlTemplate = `<!DOCTYPE html>`;
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tech Icons Collection</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
        }
        h1 {
            text-align: center;
            color: #333;
        }
        #search-container {
            margin: 20px 0;
            text-align: center;
        }
        #search {
            padding: 10px 15px;
            width: 100%;
            max-width: 500px;
            border: 1px solid #ddd;
            border-radius: 20px;
            font-size: 16px;
            outline: none;
        }
        #icon-count {
            display: inline-block;
            margin-left: 10px;
            background: #4CAF50;
            color: white;
            padding: 2px 8px;
            border-radius: 10px;
            font-size: 14px;
        }
        #icons-container {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
            gap: 20px;
            margin-top: 20px;
        }
        .icon-card {
            background: white;
            border-radius: 8px;
            padding: 15px;
            text-align: center;
            cursor: pointer;
            transition: transform 0.2s, box-shadow 0.2s;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }
        .icon-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }
        .icon {
            width: 64px;
            height: 64px;
            margin: 0 auto 10px;
            display: block;
            object-fit: contain;
        }
        .icon-name {
            font-size: 14px;
            color: #333;
            margin-top: 5px;
            word-break: break-word;
        }
        .no-results {
            text-align: center;
            grid-column: 1 / -1;
            padding: 40px 0;
            color: #666;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Tech Icons Collection</h1>
        <div id="search-container">
            <input type="text" id="search" placeholder="Search ${icons.length} icons...">
            <span id="icon-count">${icons.length}</span> icons
        </div>
        <div id="icons-container"></div>
    </div>

    <script>
        const icons = ${JSON.stringify(icons, null, 2)};
        const container = document.getElementById('icons-container');
        const searchInput = document.getElementById('search');
        
        // Display all icons initially
        displayIcons(icons);
        
        // Search functionality
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const filteredIcons = icons.filter(icon => 
                icon.name.toLowerCase().includes(searchTerm) ||
                icon.filename.toLowerCase().includes(searchTerm)
            );
            displayIcons(filteredIcons);
        });
        
        // Display icons in the container
        function displayIcons(iconsToShow) {
            container.innerHTML = '';
            
            if (iconsToShow.length === 0) {
                container.innerHTML = `
                    <div class="no-results">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="12" y1="8" x2="12" y2="12"></line>
                            <line x1="12" y1="16" x2="12.01" y2="16"></line>
                        </svg>
                        <h3>No icons found</h3>
                        <p>Try a different search term</p>
                    </div>
                `;
                return;
            }
            
            iconsToShow.forEach(icon => {
                const card = document.createElement('div');
                card.className = 'icon-card';
                
                const img = document.createElement('img');
                img.src = icon.filename;
                img.alt = icon.name;
                img.className = 'icon';
                
                const name = document.createElement('div');
                name.className = 'icon-name';
                name.textContent = icon.name;
                
                card.appendChild(img);
                card.appendChild(name);
                
                // Click to copy filename
                card.addEventListener('click', () => {
                    const filename = icon.filename.split('/').pop();
                    navigator.clipboard.writeText(filename).then(() => {
                        const originalText = name.textContent;
                        name.textContent = 'Copied!';
                        setTimeout(() => {
                            name.textContent = originalText;
                        }, 2000);
                    });
                });
                
                container.appendChild(card);
            });
            
            // Update icon count
            document.getElementById('icon-count').textContent = iconsToShow.length;
        }
    </script>
</body>
</html>`;
    
    // Write the new content to the preview file
    fs.writeFileSync(previewPath, htmlTemplate, 'utf8');
    
    console.log(`Preview updated with ${icons.length} icons`);
}

// Run the update
updatePreviewFile();
