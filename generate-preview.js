const fs = require('fs');
const path = require('path');

// Function to get all SVG files in the current directory
function getSvgFiles() {
    const files = fs.readdirSync(__dirname);
    return files.filter(file => file.endsWith('.svg'));
}

// Function to convert filename to a display name
function formatName(filename) {
    // Remove .svg extension
    let name = filename.replace(/\.svg$/i, '');
    
    // Replace hyphens and underscores with spaces
    name = name.replace(/[-_]/g, ' ');
    
    // Handle special cases
    name = name.replace(/\(CSharp\)/i, '(C#)');
    name = name.replace(/\(CPlusPlus\)/i, '(C++)');
    name = name.replace(/dotnet/gi, '.NET');
    name = name.replace(/jsx?/gi, match => match.toUpperCase());
    
    // Capitalize first letter of each word
    name = name.split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
    
    return name;
}

// Generate the icons data
function generateIconsData() {
    const svgFiles = getSvgFiles();
    
    const icons = svgFiles.map(filename => ({
        name: formatName(filename),
        filename: filename
    }));
    
    return icons;
}

// Update the preview.html file with the icons data
function updatePreviewFile() {
    const icons = generateIconsData();
    const previewPath = path.join(__dirname, 'preview.html');
    
    let content = fs.readFileSync(previewPath, 'utf8');
    
    // Format the icons array as a string
    const iconsArrayString = JSON.stringify(icons, null, 4)
        .replace(/"name"/g, 'name')
        .replace(/"filename"/g, 'filename');
    
    // Replace the placeholder in the preview.html file
    content = content.replace(
        /const icons = \[\s*\/\/ This will be populated by the build script\s*\];/, 
        `const icons = ${iconsArrayString};`
    );
    
    fs.writeFileSync(previewPath, content, 'utf8');
    
    console.log(`Preview updated with ${icons.length} icons`);
}

// Run the update
updatePreviewFile();
