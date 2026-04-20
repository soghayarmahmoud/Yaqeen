# 🔧 Troubleshooting Guide

This guide helps you resolve common issues and problems you might encounter while using or developing Yaqeen.

## 📋 Table of Contents

- [Quick Start Issues](#quick-start-issues)
- [Development Issues](#development-issues)
- [Build and Deployment Issues](#build-and-deployment-issues)
- [Performance Issues](#performance-issues)
- [Browser Compatibility](#browser-compatibility)
- [API and Data Issues](#api-and-data-issues)
- [Security Issues](#security-issues)
- [Getting Help](#getting-help)

---

## 🚀 Quick Start Issues

### "npm install" fails

**Symptoms:**
- Installation fails with permission errors
- Network timeout errors
- Package not found errors

**Solutions:**

1. **Clear npm cache:**
   ```bash
   npm cache clean --force
   ```

2. **Delete node_modules and reinstall:**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **Use different registry:**
   ```bash
   npm config set registry https://registry.npmjs.org/
   ```

4. **Check Node.js version:**
   ```bash
   node --version  # Should be 18.17 or later
   npm --version   # Should be compatible version
   ```

### Development server won't start

**Symptoms:**
- Port already in use error
- Module not found errors
- Environment variable issues

**Solutions:**

1. **Kill process on port:**
   ```bash
   # Find process using port 3000
   lsof -ti:3000 | xargs kill -9
   # Or on Windows
   netstat -ano | findstr :3000
   taskkill /PID <PID> /F
   ```

2. **Check environment variables:**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with correct values
   ```

3. **Clear Next.js cache:**
   ```bash
   rm -rf .next
   npm run dev
   ```

---

## 💻 Development Issues

### Hot reload not working

**Symptoms:**
- Changes not reflected in browser
- Manual refresh required

**Solutions:**

1. **Check file watching limits:**
   ```bash
   # Linux/Mac
   echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
   sudo sysctl -p

   # Windows - increase file watcher limit
   ```

2. **Disable safe write in your editor:**
   - VS Code: `"files.useExperimentalFileWatcher": true`
   - Other editors: Disable atomic saves

3. **Check for syntax errors:**
   ```bash
   npm run lint
   ```

### Component not rendering

**Symptoms:**
- Blank page or missing content
- Console errors about components

**Solutions:**

1. **Check component exports:**
   ```javascript
   // Correct
   export default function Component() { ... }

   // Incorrect
   function Component() { ... }
   ```

2. **Verify imports:**
   ```javascript
   // Correct
   import Component from './Component'

   // Incorrect
   import { Component } from './Component'
   ```

3. **Check for prop validation:**
   ```javascript
   // Add prop types or default props
   Component.defaultProps = {
     title: 'Default Title'
   }
   ```

### Styling issues

**Symptoms:**
- CSS not applying
- Tailwind classes not working
- Layout breaking

**Solutions:**

1. **Rebuild CSS:**
   ```bash
   npm run build
   # or
   npx tailwindcss -i ./input.css -o ./output.css --watch
   ```

2. **Check Tailwind configuration:**
   ```javascript
   // tailwind.config.js
   module.exports = {
     content: [
       './pages/**/*.{js,ts,jsx,tsx}',
       './components/**/*.{js,ts,jsx,tsx}',
       './app/**/*.{js,ts,jsx,tsx}',
     ],
     theme: {
       extend: {},
     },
     plugins: [],
   }
   ```

3. **Verify class names:**
   ```html
   <!-- Correct -->
   <div className="bg-blue-500 text-white">

   <!-- Incorrect -->
   <div className="bg-blue text-white">
   ```

---

## 🏗️ Build and Deployment Issues

### Build fails

**Symptoms:**
- Build process stops with errors
- TypeScript compilation errors
- Missing dependencies

**Solutions:**

1. **Check for TypeScript errors:**
   ```bash
   npx tsc --noEmit
   ```

2. **Verify all dependencies:**
   ```bash
   npm ls --depth=0
   ```

3. **Clean and rebuild:**
   ```bash
   rm -rf .next node_modules/.cache
   npm run build
   ```

4. **Check environment variables:**
   ```bash
   # Ensure all required env vars are set
   printenv | grep NEXT_PUBLIC
   ```

### Deployment fails

**Symptoms:**
- Vercel/Netlify deployment errors
- Runtime errors in production

**Solutions:**

1. **Check build logs:**
   - Vercel: Check deployment logs in dashboard
   - Netlify: Check build logs in deployment details

2. **Verify environment variables:**
   ```bash
   # Set production environment variables
   NEXT_PUBLIC_API_URL=https://api.yaqeen.dev
   ```

3. **Check for client-side only code:**
   ```javascript
   // Correct - Use dynamic imports
   const Component = dynamic(() => import('../components/Component'), {
     ssr: false
   })

   // Incorrect - Direct import of client-only code
   import Component from '../components/Component'
   ```

---

## ⚡ Performance Issues

### Slow page loads

**Symptoms:**
- Pages take long to load
- Large bundle sizes
- Slow initial page load

**Solutions:**

1. **Analyze bundle size:**
   ```bash
   npm install --save-dev @next/bundle-analyzer
   npm run build:analyze
   ```

2. **Implement code splitting:**
   ```javascript
   // Dynamic imports for large components
   const HeavyComponent = dynamic(() => import('../components/HeavyComponent'))
   ```

3. **Optimize images:**
   ```javascript
   import Image from 'next/image'

   <Image
     src="/image.jpg"
     alt="Description"
     width={800}
     height={600}
     loading="lazy"
   />
   ```

4. **Use React.memo for expensive components:**
   ```javascript
   const MemoizedComponent = React.memo(function Component({ prop }) {
     return <div>{prop}</div>
   })
   ```

### Memory leaks

**Symptoms:**
- Increasing memory usage
- Browser becoming slow
- Components not unmounting properly

**Solutions:**

1. **Clean up event listeners:**
   ```javascript
   useEffect(() => {
     const handleResize = () => { ... }
     window.addEventListener('resize', handleResize)

     return () => {
       window.removeEventListener('resize', handleResize)
     }
   }, [])
   ```

2. **Cancel async operations:**
   ```javascript
   useEffect(() => {
     let isMounted = true

     fetchData().then(data => {
       if (isMounted) setData(data)
     })

     return () => {
       isMounted = false
     }
   }, [])
   ```

---

## 🌐 Browser Compatibility

### Issues in specific browsers

**Chrome:**
- Clear cache and cookies
- Disable extensions temporarily
- Check for Chrome updates

**Firefox:**
- Disable tracking protection for localhost
- Clear site data
- Check Firefox version

**Safari:**
- Enable developer menu
- Clear website data
- Check Safari version

**Edge:**
- Clear browsing data
- Disable tracking prevention
- Update to latest version

### Mobile browsers

**iOS Safari:**
- Clear website data
- Disable content blockers
- Check iOS version

**Chrome Mobile:**
- Clear app cache
- Update Chrome app
- Check Android version

---

## 🔌 API and Data Issues

### API calls failing

**Symptoms:**
- Network errors
- 404/500 status codes
- CORS errors

**Solutions:**

1. **Check API endpoints:**
   ```javascript
   // Verify API URL
   const API_URL = process.env.NEXT_PUBLIC_API_URL
   console.log('API URL:', API_URL)
   ```

2. **Handle CORS issues:**
   ```javascript
   // Add CORS headers in API routes
   export default function handler(req, res) {
     res.setHeader('Access-Control-Allow-Origin', '*')
     res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE')
     res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
   }
   ```

3. **Implement error boundaries:**
   ```javascript
   class ErrorBoundary extends React.Component {
     constructor(props) {
       super(props)
       this.state = { hasError: false }
     }

     static getDerivedStateFromError(error) {
       return { hasError: true }
     }

     render() {
       if (this.state.hasError) {
         return <h1>Something went wrong.</h1>
       }
       return this.props.children
     }
   }
   ```

### Data not loading

**Symptoms:**
- Empty states
- Loading indicators stuck
- No data displayed

**Solutions:**

1. **Check data fetching:**
   ```javascript
   // Add loading states
   const [loading, setLoading] = useState(true)
   const [error, setError] = useState(null)

   useEffect(() => {
     fetchData()
       .then(data => setData(data))
       .catch(err => setError(err))
       .finally(() => setLoading(false))
   }, [])
   ```

2. **Verify data structure:**
   ```javascript
   // Add data validation
   if (!data || !Array.isArray(data)) {
     console.error('Invalid data structure')
     return
   }
   ```

---

## 🔒 Security Issues

### Common security problems

**XSS Prevention:**
```javascript
// Use dangerouslySetInnerHTML carefully
<div dangerouslySetInnerHTML={{ __html: sanitizedHTML }} />

// Or use libraries like DOMPurify
import DOMPurify from 'dompurify'
const cleanHTML = DOMPurify.sanitize(dirtyHTML)
```

**CSRF Protection:**
```javascript
// Include CSRF tokens in forms
<input type="hidden" name="_csrf" value={csrfToken} />
```

**Secure Headers:**
```javascript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
        ],
      },
    ]
  },
}
```

---

## 🆘 Getting Help

### Before asking for help

1. **Check this troubleshooting guide**
2. **Search existing issues** on GitHub
3. **Check the documentation** in README.md
4. **Try the latest version**

### How to ask for help

**For Bug Reports:**
- Use the [BUG_REPORT.md](BUG_REPORT.MD) template
- Include all relevant information
- Provide steps to reproduce

**For Questions:**
- Use [GitHub Discussions](https://github.com/yourusername/yaqeen/discussions)
- Check [FAQ.md](FAQ.md) first
- Be specific about your problem

**For Feature Requests:**
- Use the [FEATURE_REQUEST.md](FEATURE_REQUEST.MD) template
- Describe the problem and solution clearly

### Support Channels

- **🐛 Bug Reports**: [GitHub Issues](https://github.com/yourusername/yaqeen/issues)
- **💡 Feature Requests**: [GitHub Issues](https://github.com/yourusername/yaqeen/issues)
- **💬 General Discussion**: [GitHub Discussions](https://github.com/yourusername/yaqeen/discussions)
- **📧 Email Support**: support@yaqeen.dev

### Response Times

- **Bug Fixes**: Within 24-48 hours for critical issues
- **Feature Requests**: Within 1 week for initial response
- **General Questions**: Within 24 hours during business days

---

## 📝 Contributing Fixes

Found a solution to a problem? Help improve this guide!

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b fix/troubleshooting-guide`
3. **Add your solution** to the relevant section
4. **Test your changes**
5. **Submit a pull request**

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

---

*This guide is continuously updated. If you encounter an issue not covered here, please [report it](BUG_REPORT.MD) so we can add it to the guide.*
