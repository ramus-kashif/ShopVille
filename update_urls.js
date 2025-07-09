const fs = require('fs');
const path = require('path');

function updateUrlsInFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;
    
    // Replace all instances of localhost:8080 with localhost:5000
    content = content.replace(/localhost:8080/g, 'localhost:5000');
    
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated: ${filePath}`);
      return true;
    }
    return false;
  } catch (error) {
    console.error(`Error updating ${filePath}:`, error.message);
    return false;
  }
}

// List of files to update
const filesToUpdate = [
  'frontend/src/Pages/Success.jsx',
  'frontend/src/Pages/Shop.jsx',
  'frontend/src/Pages/RegisterPage.jsx',
  'frontend/src/Pages/Profile.jsx',
  'frontend/src/Pages/LoginPage.jsx',
  'frontend/src/Pages/GoogleCallback.jsx',
  'frontend/src/Pages/GoogleAuthCallback.jsx',
  'frontend/src/Pages/CheckoutPage.jsx',
  'frontend/src/Pages/Admin/Orders.jsx',
  'frontend/src/Pages/Admin/Dashboard.jsx',
  'frontend/src/Pages/Admin/Carousel.jsx',
  'frontend/src/components/ReviewSection.jsx'
];

let updatedCount = 0;
filesToUpdate.forEach(file => {
  if (updateUrlsInFile(file)) {
    updatedCount++;
  }
});

console.log(`\nUpdated ${updatedCount} files successfully!`); 