# Tech Icons Collection

A comprehensive collection of high-quality SVG icons for various software technologies, frameworks, and tools. Perfect for developers, designers, and content creators who need clean, consistent icons for their projects.

## 🌟 Features

- **420+ SVG Icons** - Extensive collection covering popular technologies
- **High Quality** - Clean, consistent design across all icons
- **Fully Scalable** - Vector format looks perfect at any size
- **Lightweight** - Small file sizes for better performance
- **Easy to Use** - Simple integration in any project
- **Open Source** - Free for personal and commercial use
- **Regular Updates** - New icons added frequently

## 🚀 Quick Start

### Browser
Simply download the SVG file you need and include it in your HTML:

```html
<img src="path/to/icon.svg" alt="Technology Name" width="32" height="32">
```

### React Component
```jsx
import React from 'react';
import { ReactComponent as ReactIcon } from './react.svg';

function App() {
  return <ReactIcon style={{ width: '32px', height: '32px' }} />;
}
```

### CSS Background
```css
.icon {
  background-image: url('path/to/icon.svg');
  width: 32px;
  height: 32px;
  display: inline-block;
  background-size: contain;
}
```

## 🛠️ Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/tech-icons.git
   cd tech-icons
   ```

2. **Install dependencies**
   ```bash
   # Using npm
   npm install
   
   # Or using Yarn
   yarn
   ```

3. **Start the development server**
   ```bash
   # Generate the preview
   node generate-preview.js
   
   # Then open preview.html in your browser
   open preview.html  # On macOS
   start preview.html # On Windows
   ```

4. **Build for production**
   ```bash
   # Optimize SVGs (requires svgo)
   npx svgo -f . -r --multipass
   ```

## Usage

1. Download the SVG file you need
2. Include it in your project:
   ```html
   <img src="path/to/icon.svg" alt="Technology Name" width="32" height="32">
   ```
   Or use it as a background image in CSS:
   ```css
   .icon {
       background-image: url('path/to/icon.svg');
       width: 32px;
       height: 32px;
   }
   ```

## Contributing

Contributions are welcome! Please read our [contribution guidelines](CONTRIBUTING.md) for details.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
