# Personal Portfolio Website Template

A modern, responsive personal portfolio website template built with clean, semantic code. This project provides a professional foundation for showcasing your development skills and projects.

## 🎯 Features

- **Responsive Design**: Mobile-first approach, works on all devices (320px+)
- **Dynamic Content**: Projects and information loaded from JSON configuration
- **Professional Dark Theme**: Modern design with multiple theme presets
- **Clean Architecture**: Well-structured, maintainable code following best practices
- **Zero Dependencies**: Pure HTML5, CSS3, and Vanilla JavaScript
- **SEO Ready**: Proper meta tags and semantic HTML structure

## 🚀 Quick Start

### Local Development

1. Clone or download the project files
2. Start a local server:
   ```bash
   python3 -m http.server 8000
   ```
3. Open browser to `http://localhost:8000`

### Customization

1. **Update content**: Edit `config.json` with your information
2. **Replace resume**: Add your `resume.pdf` to the `assets/` folder
3. **Modify styling**: Edit `styles/main.css` for design changes
4. **Test changes**: Refresh browser to see updates

## 📁 Project Structure

```text
public-version/
├── index.html              # Main website file
├── config.json            # Content configuration
├── styles/
│   └── main.css           # Professional styling with responsive design
├── scripts/
│   └── main.js            # Interactive functionality and dynamic content
└── assets/
    └── resume.pdf         # Resume file (replace with yours)
```

## 🛠️ Technology Stack

**Frontend Technologies:**
- HTML5 (Semantic markup)
- CSS3 (Flexbox, Grid, Custom Properties, Animations)
- JavaScript (ES6+, Fetch API, Intersection Observer)

**Development Tools:**
- Any modern code editor (VS Code, Sublime Text, etc.)
- Local development server (Python, Node.js, or browser extensions)
- Git for version control

## 🎨 Theme Configuration

The website includes multiple professional theme presets:

```
Default:         Standard dark professional theme
?theme=ocean     Ocean Breeze - Teal and blue ocean-inspired gradients  
?theme=sunset    Golden Sunset - Warm oranges and reds
?theme=forest    Forest Green - Natural green tones
?theme=midnight  Midnight Blue - Deep navy and dark blue
?theme=shadow    Shadow Black - Pure blacks and grays
?theme=formal    Professional Formal - Business-appropriate colors
```

## 📋 Content Management

### Updating Personal Information

Edit the `config.json` file to update:

- Personal details (name, title, location)
- About section content
- Skills and technologies
- Project information
- Contact information
- Theme preferences

### Adding Projects

```json
{
  "id": "unique-project-id",
  "title": "Project Title",
  "featured": true,
  "description": "Project description...",
  "technologies": ["Technology1", "Technology2"],
  "timeline": "Development timeline",
  "approach": "Development approach",
  "links": {
    "source": "https://github.com/user/repo",
    "demo": "https://demo-url.com"
  }
}
```

### Email Configuration

The website includes email obfuscation for protection:

1. Encode your email using Base64:
   ```bash
   echo "your.email@domain.com" | base64
   ```
2. Update both locations in `config.json`:
   - `personal.email`: `"<base64-string>"`
   - `contact.email.address`: `"<base64-string>"`
   - Set `contact.email.obfuscated`: `true`

## 🌐 Deployment

### Docker Deployment

For containerized deployment with Docker:

📋 **See [docker-deployment/DOCKER-README.md](docker-deployment/DOCKER-README.md) for complete Docker deployment instructions**

Quick start:
```bash
cd docker-deployment
docker compose up -d
```

### Recommended Hosting Options

- **Netlify**: Connect to GitHub and deploy automatically
- **Vercel**: Import project and deploy with one click
- **GitHub Pages**: Enable in repository settings

### Simple Deployment

1. Push code to GitHub repository
2. Connect your preferred hosting service
3. Deploy with default settings
4. Your site will be live!

## 🔧 Customization Tips

1. **Colors**: Modify theme presets in `config.json`
2. **Layout**: Adjust CSS Grid and Flexbox properties in `main.css`
3. **Content**: Update all text and links in `config.json`
4. **Images**: Replace `resume.pdf` and add any additional assets
5. **Analytics**: Add your Google Analytics ID in `config.json`

## 📝 License

This project is open source and available under the MIT License.

## 🤝 Usage

Feel free to:
- Use as a template for your own portfolio
- Modify and customize to fit your needs
- Learn from modern web development practices
- Share with others who might benefit

---

Built with ❤️ using modern web development practices