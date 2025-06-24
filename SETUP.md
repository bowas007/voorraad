# 🚀 Quick Setup Guide

## Immediate Use

1. **Open the app**: Double-click `index.html` to open in your browser
2. **Start counting**: Tap the + and - buttons to count your inventory
3. **Search products**: Use the search box to find items quickly
4. **Export data**: Click "Export" to download your counts as CSV

## Mobile Installation

### Android (Chrome)
1. Open `index.html` in Chrome
2. Tap the menu (⋮) → "Add to Home screen"
3. The app will now work like a native app!

### iPhone (Safari)
1. Open `index.html` in Safari
2. Tap the share button (□↑) → "Add to Home Screen"
3. The app will now work like a native app!

## Customizing Products

### Option 1: Use the Admin Page (Recommended)
1. Click "Manage Products" in the main app
2. Add, edit, or remove products through the web interface
3. Changes are saved automatically

### Option 2: Edit the Code
1. Open `script.js` in any text editor
2. Find the `defaultProducts` array (around line 2)
3. Edit the product list as needed
4. Save and refresh the browser

## File Structure

```
📁 Bar Stock Counter/
├── 📄 index.html          # Main counting app
├── 📄 admin.html          # Product management
├── 📄 styles.css          # App styling
├── 📄 script.js           # Main functionality
├── 📄 sw.js              # Offline support
├── 📄 manifest.json      # PWA configuration
├── 📄 README.md          # Full documentation
└── 📄 SETUP.md           # This quick guide
```

## Features Included

✅ **Mobile-friendly design** with large touch buttons  
✅ **Search functionality** to find products quickly  
✅ **Auto-save** - all data saved to browser  
✅ **Export to CSV** for spreadsheet import  
✅ **Product management** through admin page  
✅ **Offline support** - works without internet  
✅ **PWA ready** - can be installed on mobile devices  
✅ **No server required** - runs entirely in the browser  

## Troubleshooting

**App doesn't load?**
- Make sure you're using a modern browser (Chrome, Firefox, Safari, Edge)
- Try opening `index.html` directly in the browser

**Data lost?**
- Check if you cleared your browser data
- Data is stored in your browser's localStorage

**Can't find a product?**
- Use the search box to filter products
- Go to "Manage Products" to add new items

**Mobile buttons too small?**
- The app is designed for mobile - try rotating your phone
- Add to home screen for the best experience

---

**That's it! Your bar stock counter is ready to use! 🍺📊** 