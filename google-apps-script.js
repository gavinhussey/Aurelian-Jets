/**
 * Google Apps Script for Aurelian Air Form Submission
 * 
 * SETUP INSTRUCTIONS:
 * 1. Open your Google Sheet: https://docs.google.com/spreadsheets/d/1u3G0w-9x37bXEuY1xZK4zwWpudgT0WopR_-l2byeZT0/edit
 * 2. Go to Extensions > Apps Script
 * 3. Delete any existing code
 * 4. Paste this entire code
 * 5. Save the project (Ctrl+S or Cmd+S)
 * 6. Click "Deploy" > "New deployment"
 * 7. Click the gear icon next to "Select type" > "Web app"
 * 8. Set:
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 9. Click "Deploy"
 * 10. Copy the Web App URL
 * 11. Replace 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE' in index.html with this URL
 */

// Sheet configuration
const SHEET_NAME = 'Aurelian Air — Early Access';
const SPREADSHEET_ID = '1u3G0w-9x37bXEuY1xZK4zwWpudgT0WopR_-l2byeZT0';

// Column order (must match exactly)
const COLUMNS = [
  'Timestamp',
  'Full Name',
  'Email Address',
  'City',
  'State',
  'Phone Number',
  'Source',
  'Status'
];

/**
 * Handle POST request from form
 */
function doPost(e) {
  try {
    let data = {};
    
    // Handle both JSON and form-urlencoded data
    if (e.postData.type === 'application/json') {
      data = JSON.parse(e.postData.contents);
    } else if (e.postData.type === 'application/x-www-form-urlencoded') {
      // Parse form data
      const params = e.parameter;
      data = {
        timestamp: params.timestamp || new Date().toISOString(),
        name: params.name || '',
        email: params.email || '',
        city: params.city || '',
        state: params.state || '',
        phone: params.phone || '',
        source: params.source || 'AurelianJets.com',
        status: params.status || ''
      };
    } else {
      // Try to parse as JSON anyway
      try {
        data = JSON.parse(e.postData.contents);
      } catch (err) {
        // Fallback to parameters
        const params = e.parameter;
        data = {
          timestamp: params.timestamp || new Date().toISOString(),
          name: params.name || '',
          email: params.email || '',
          city: params.city || '',
          state: params.state || '',
          phone: params.phone || '',
          source: params.source || 'AurelianJets.com',
          status: params.status || ''
        };
      }
    }
    
    // Get or create sheet
    const sheet = getOrCreateSheet();
    
    // Prepare row data in exact column order
    const rowData = [
      data.timestamp || new Date(),
      data.name || '',
      data.email || '',
      data.city || '',
      data.state || '',
      data.phone || '',
      data.source || 'AurelianJets.com',
      data.status || ''
    ];
    
    // Append row to sheet
    sheet.appendRow(rowData);
    
    // Format the new row to match enhanced sheet styling
    const newRowNum = sheet.getLastRow();
    const newRowRange = sheet.getRange(newRowNum, 1, newRowNum, COLUMNS.length);
    
    // Alternate row color (matching formatSheet function)
    if (newRowNum % 2 === 0) {
      newRowRange.setBackground('#121212'); // Even rows - slightly lighter
    } else {
      newRowRange.setBackground('#0a0a0a'); // Odd rows - darker
    }
    
    newRowRange.setFontSize(11); // Larger for readability
    newRowRange.setFontColor('#e8e8e8'); // Soft off-white
    newRowRange.setVerticalAlignment('middle');
    newRowRange.setWrap(true);
    newRowRange.setBorder(true, true, true, true, true, true, '#1a1a1a', SpreadsheetApp.BorderStyle.SOLID);
    sheet.setRowHeight(newRowNum, 38); // Taller for better readability
    
    // Format timestamp - muted color
    const timestampCell = sheet.getRange(newRowNum, 1);
    timestampCell.setNumberFormat('yyyy-mm-dd hh:mm:ss');
    timestampCell.setFontColor('#b8b8b8');
    timestampCell.setFontSize(10);
    
    // Format name - brighter for visibility
    sheet.getRange(newRowNum, 2).setFontColor('#f0f0f0');
    
    // Format email - gold color, italic
    const emailCell = sheet.getRange(newRowNum, 3);
    emailCell.setFontStyle('italic');
    emailCell.setFontColor('#d4af37'); // Gold for emails
    
    // Format city, state, phone - standard color
    sheet.getRange(newRowNum, 4).setFontColor('#e8e8e8');
    sheet.getRange(newRowNum, 5).setFontColor('#e8e8e8');
    sheet.getRange(newRowNum, 6).setFontColor('#e8e8e8');
    
    // Center align status - muted
    const statusCell = sheet.getRange(newRowNum, 8);
    statusCell.setHorizontalAlignment('center');
    statusCell.setFontColor('#b8b8b8'); // Muted for empty status
    
    // Optional: Send internal notification email
    sendInternalNotification(data);
    
    // Return success response (CORS enabled)
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: 'Request received'
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    // Log error for debugging
    Logger.log('Error in doPost: ' + error.toString());
    
    // Return error response
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Handle GET request (for testing)
 */
function doGet(e) {
  return ContentService.createTextOutput('Aurelian Air Form Handler - POST requests only')
    .setMimeType(ContentService.MimeType.TEXT);
}

/**
 * Get or create the sheet with proper headers
 */
function getOrCreateSheet() {
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);
  let isNewSheet = false;
  
  // Create sheet if it doesn't exist
  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);
    isNewSheet = true;
    // Set headers
    sheet.getRange(1, 1, 1, COLUMNS.length).setValues([COLUMNS]);
  } else {
    // Verify headers exist, add if missing
    const headerRow = sheet.getRange(1, 1, 1, COLUMNS.length).getValues()[0];
    if (headerRow[0] !== COLUMNS[0]) {
      sheet.insertRowBefore(1);
      sheet.getRange(1, 1, 1, COLUMNS.length).setValues([COLUMNS]);
      isNewSheet = true;
    }
  }
  
  // Format the sheet (only if new or if formatting hasn't been applied)
  formatSheet(sheet);
  
  return sheet;
}

/**
 * Format the sheet with professional styling
 * Run this function manually in Apps Script to reformat existing sheets
 */
function formatSheet(sheet) {
  const numRows = sheet.getLastRow();
  const numCols = COLUMNS.length;
  
  // Format header row (Row 1) - Enhanced styling
  const headerRange = sheet.getRange(1, 1, 1, numCols);
  headerRange.setFontWeight('bold');
  headerRange.setFontSize(12); // Slightly larger
  headerRange.setBackground('#0d0d0d'); // Darker, more premium
  headerRange.setFontColor('#d4af37'); // Gold
  headerRange.setHorizontalAlignment('left');
  headerRange.setVerticalAlignment('middle');
  headerRange.setWrap(true);
  // Add subtle border to header for definition (gold top border)
  headerRange.setBorder(true, true, true, true, false, false, '#d4af37', SpreadsheetApp.BorderStyle.SOLID);
  headerRange.setBorder(false, false, false, false, true, true, '#2a2a2a', SpreadsheetApp.BorderStyle.SOLID);
  
  // Set header row height - more spacious
  sheet.setRowHeight(1, 45);
  
  // Freeze header row
  sheet.setFrozenRows(1);
  
  // Set column widths (optimized for content) - improved spacing
  sheet.setColumnWidth(1, 200); // Timestamp - wider for readability
  sheet.setColumnWidth(2, 220); // Full Name
  sheet.setColumnWidth(3, 280); // Email Address - wider for full emails
  sheet.setColumnWidth(4, 160); // City
  sheet.setColumnWidth(5, 120); // State
  sheet.setColumnWidth(6, 180); // Phone Number
  sheet.setColumnWidth(7, 160); // Source
  sheet.setColumnWidth(8, 140); // Status
  
  // Format data rows (if any exist)
  if (numRows > 1) {
    const dataRange = sheet.getRange(2, 1, numRows - 1, numCols);
    dataRange.setFontSize(11); // Slightly larger for readability
    dataRange.setFontColor('#e8e8e8'); // Soft off-white
    dataRange.setVerticalAlignment('middle');
    dataRange.setWrap(true);
    
    // Alternate row colors for readability (more refined)
    for (let i = 2; i <= numRows; i++) {
      if (i % 2 === 0) {
        sheet.getRange(i, 1, 1, numCols).setBackground('#121212'); // Slightly lighter for even rows
      } else {
        sheet.getRange(i, 1, 1, numCols).setBackground('#0a0a0a'); // Darker for odd rows
      }
    }
    
    // Add subtle borders to data rows
    dataRange.setBorder(true, true, true, true, true, true, '#1a1a1a', SpreadsheetApp.BorderStyle.SOLID);
    
    // Format timestamp column (Column 1) - improved formatting
    const timestampRange = sheet.getRange(2, 1, numRows - 1, 1);
    timestampRange.setNumberFormat('yyyy-mm-dd hh:mm:ss');
    timestampRange.setFontColor('#b8b8b8'); // Slightly muted for timestamps
    timestampRange.setFontSize(10); // Slightly smaller for timestamps
    
    // Format email column (Column 3) - enhanced styling
    const emailRange = sheet.getRange(2, 3, numRows, 3);
    emailRange.setFontStyle('italic');
    emailRange.setFontColor('#d4af37'); // Gold color for emails (clickable feel)
    
    // Format name column (Column 2) - make it stand out
    const nameRange = sheet.getRange(2, 2, numRows, 2);
    nameRange.setFontWeight('normal');
    nameRange.setFontColor('#f0f0f0'); // Brighter for names
    
    // Format city/state/phone columns (4, 5, 6)
    sheet.getRange(2, 4, numRows, 6).setFontColor('#e8e8e8');
    
    // Center align Status column (Column 8)
    const statusRange = sheet.getRange(2, 8, numRows, 8);
    statusRange.setHorizontalAlignment('center');
    statusRange.setFontColor('#b8b8b8'); // Muted for status (empty initially)
  }
  
  // Set default row height for data rows - more comfortable
  if (numRows > 1) {
    sheet.setRowHeights(2, numRows - 1, 38); // Taller for better readability
  }
  
  // Format the entire sheet background - consistent dark theme
  sheet.getRange(1, 1, sheet.getMaxRows(), sheet.getMaxColumns())
    .setBackground('#0a0a0a');
}

/**
 * Send internal notification email (optional)
 * Replace 'your-email@example.com' with your actual email
 */
function sendInternalNotification(data) {
  try {
    var recipientEmail = 'your-email@example.com'; // CHANGE THIS TO YOUR EMAIL
    
    if (!recipientEmail || recipientEmail === 'your-email@example.com') {
      return; // Skip if email not configured
    }
    
    var subject = 'New Aurelian Jets Access Request';
    var name = data.name || 'N/A';
    var email = data.email || 'N/A';
    var city = data.city || '';
    var state = data.state || '';
    var phone = data.phone || '';
    var source = data.source || 'AurelianJets.com';
    
    var body = 'New access request received:\n\n';
    body += 'Full Name: ' + name + '\n';
    body += 'Email: ' + email + '\n';
    body += 'City: ' + (city || '—') + '\n';
    body += 'State: ' + (state || '—') + '\n';
    body += 'Phone: ' + (phone || '—') + '\n';
    body += 'Source: ' + source + '\n\n';
    body += '---\n';
    body += 'This is an automated notification from Aurelian Jets form submission.';
    
    MailApp.sendEmail({
      to: recipientEmail,
      subject: subject,
      body: body
    });
  } catch (error) {
    // Fail silently if email fails
    Logger.log('Email notification error: ' + error.toString());
  }
}
