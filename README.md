# 🍺 Bar Stock Counter

A simple, mobile-friendly web app for counting inventory in your bar or restaurant. Perfect for staff members to quickly count products during stock checks.

## ✨ Features

- **Easy Counting**: Large, touch-friendly + and - buttons for each product
- **Mobile Optimized**: Designed specifically for mobile devices
- **Search Functionality**: Quickly find products by name or category
- **Auto-Save**: All data is automatically saved to your browser
- **Export Data**: Download your counts as a CSV file
- **No Login Required**: Simple internal use - no accounts needed
- **Responsive Design**: Works great on phones, tablets, and desktop

## 🚀 Quick Start

1. **Download the files** to your computer
2. **Open `index.html`** in any modern web browser
3. **Start counting!** Tap the + and - buttons to adjust counts

That's it! The app works completely offline and saves all data to your browser.

## 📱 Mobile Usage

- **Add to Home Screen**: For the best experience, add the app to your phone's home screen
- **Large Buttons**: All buttons are designed to be easy to tap with your thumb
- **Search**: Use the search box to quickly find products
- **Reset**: Use the "Reset All" button to start a new count

## 🛠️ Customizing Products

### Easy Method: Edit the JavaScript File

1. Open `script.js` in any text editor
2. Find the `defaultProducts` array (around line 2)
3. Edit, add, or remove products as needed:

```javascript
const defaultProducts = [
    { id: 1, name: "Your Product Name", category: "Category", count: 0 },
    { id: 2, name: "Another Product", category: "Category", count: 0 },
    // Add more products here...
];
```

### Product Structure

Each product has these properties:
- `id`: Unique number (don't duplicate)
- `name`: Product name (e.g., "Cola bottles")
- `category`: Product category (e.g., "Soft Drinks", "Alcoholic", "Food")
- `count`: Always starts at 0

### Example Categories

- **Soft Drinks**: Cola, Iced Tea, Water, Lemonade
- **Alcoholic**: Beer, Wine, Whiskey, Vodka, Gin
- **Food**: Fries, Burgers, Pizza, Nachos
- **Snacks**: Chips, Nuts, Popcorn, Pretzels
- **Desserts**: Ice cream, Cake, Cookies

## 📊 Using the App

### Basic Counting
1. Find the product you want to count
2. Tap the **+** button to increase the count
3. Tap the **-** button to decrease the count (won't go below 0)
4. The counter shows the current count

### Search
- Type in the search box to filter products
- Search works for both product names and categories
- Press **ESC** to clear the search

### Reset All
- Click "Reset All" to set all counters back to 0
- Useful when starting a new stock check

### Export Data
- Click "Export" to download your counts as a CSV file
- The file includes product name, category, and count
- Useful for importing into spreadsheets or other systems

## 💾 Data Storage

- All data is stored in your browser's localStorage
- Data persists between sessions
- No data is sent to any server
- Each browser/device has its own data

## 🎨 Customization

### Colors and Styling
Edit `styles.css` to change:
- Colors and themes
- Button sizes
- Fonts and spacing
- Mobile responsiveness

### Adding Features
The JavaScript code is well-commented and modular. You can easily add:
- Product categories
- Minimum/maximum stock levels
- Barcode scanning
- Photo uploads
- Multiple locations

## 🔧 Technical Details

- **Pure HTML/CSS/JavaScript**: No frameworks required
- **Progressive Web App**: Can be installed on mobile devices
- **Offline Capable**: Works without internet connection
- **Cross-Browser Compatible**: Works on all modern browsers

## 📋 Browser Compatibility

- ✅ Chrome (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 🚀 Deployment Options

### Simple Hosting
1. **Local Network**: Host on a computer in your bar
2. **Web Server**: Upload to any web hosting service
3. **Cloud Storage**: Use services like GitHub Pages, Netlify, or Vercel

### Self-Hosting
The app is completely self-contained and can be hosted anywhere:
- Traditional web server (Apache, Nginx)
- Cloud platforms (AWS, Google Cloud, Azure)
- Local network server

## 🤝 Contributing

Want to improve the app? Here are some ideas:
- Add barcode scanning
- Create an admin panel for product management
- Add stock level alerts
- Implement multi-location support
- Add photo uploads for products
- Create printable reports

## 📞 Support

This is a simple, self-contained app. If you need help:
1. Check the browser console for error messages
2. Make sure you're using a modern browser
3. Try clearing your browser's localStorage if data gets corrupted

## 📄 License

This project is open source and available under the MIT License. Feel free to modify and use it for your business!

---

**Happy Counting! 🍺📊** 