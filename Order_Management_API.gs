/**
* ============================================
* ORDER MANAGEMENT API
* Backend API for web-based Order Management UI
* ============================================
*/
/**
* Serve the Order Management web interface
* @returns {HtmlOutput} Web page
*/
function doGet() {
const htmlOutput = HtmlService.createTemplateFromFile('Display_UI_Webpage');
return htmlOutput.evaluate()
.setTitle('Order Management System')
.setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}
/**
* Include external files in HTML
* @param {string} filename - File to include
* @returns {string} File content
*/
function include(filename) {
return HtmlService.createHtmlOutputFromFile(filename).getContent();
}
// ========================================
// DATA RETRIEVAL FUNCTIONS
// ========================================
/**
 * ============================================
 * PERFORMANCE-OPTIMIZED BACKEND DATA RETRIEVAL
 * Maximum efficiency for Order Management UI
 * ============================================
 */

/**
 * CRITICAL OPTIMIZATION: Pre-process ALL data on backend
 * Frontend receives fully mapped, ready-to-use objects
 */
function getAllOrders() {
  const startTime = Date.now();
  
  try {
    console.log('📊 Getting all orders with optimized processing...');
    
    const spreadsheet = getCachedSpreadsheet();
    
    // Parallel sheet access for speed
    const amazonSheet = spreadsheet.getSheetByName('AmazonOrders');
    const targetSheet = spreadsheet.getSheetByName('TargetOrders');
    
    // Get raw data in one call
    const amazonData = amazonSheet ? amazonSheet.getDataRange().getValues() : [[]];
    const targetData = targetSheet ? targetSheet.getDataRange().getValues() : [[]];
    
    // Process on backend (not frontend!)
    const amazonOrders = processAmazonOrdersOptimized(amazonData);
    const targetOrders = processTargetOrdersOptimized(targetData);
    
    const elapsed = Date.now() - startTime;
    console.log(`✅ Retrieved ${amazonOrders.length} Amazon + ${targetOrders.length} Target orders in ${elapsed}ms`);
    
    return {
      success: true,
      amazon: amazonOrders,
      target: targetOrders,
      total: amazonOrders.length + targetOrders.length,
      message: 'Orders loaded successfully',
      loadTimeMs: elapsed
    };
    
  } catch (error) {
    console.error('❌ Error getting orders:', error);
    return {
      success: false,
      amazon: [],
      target: [],
      total: 0,
      message: `Failed to get orders: ${error.message}`
    };
  }
}

/**
 * Process Amazon orders with ALL frontend mappings done here
 */
function processAmazonOrdersOptimized(data) {
  if (data.length <= 1) return [];
  
  const headers = data[0];
  const orders = [];
  
  // Pre-compute column indices once
  const colIndices = {
    timestamp: headers.indexOf('Timestamp'),
    submissionId: headers.indexOf('Submission_Id'),
    historicalId: headers.indexOf('Historical_Submission_Id'),
    organization: headers.indexOf('Student_Organization'),
    eventName: headers.indexOf('Event_Name'),
    eventDate: headers.indexOf('Event_Date'),
    pickupPerson: headers.indexOf('Pickup_Person_Name'),
    pickupEmail: headers.indexOf('Pickup_Person_Email'),
    pickupPhone: headers.indexOf('Pickup_Person_Phone'),
    wishlistLink: headers.indexOf('Wishlist_Link'),
    orderNumbers: headers.indexOf('Associated Order Numbers'),
    total1: headers.indexOf('Total_1'),
    total2: headers.indexOf('Total_2'),
    totalOrder: headers.indexOf('Total_Order'),
    backupItems: headers.indexOf('Backup_Items_And_Quantity'),
    formNotes: headers.indexOf('Form Submitter Notes'),
    processedBy: headers.indexOf('Processed_By'),
    timeProcessedBy: headers.indexOf('Time_Processed_By'),
    comments: headers.indexOf('Comments'),
    status: headers.indexOf('Order_Status'),
    pickedUp: headers.indexOf('Picked_Up_Status'),
    nonPO: headers.indexOf('Non_PO_Submitted'),
    confirmationNumber: headers.indexOf('Confirmation_Number')
  };
  
  // Process each row with direct column access
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    
    // Skip empty rows
    if (!row[colIndices.organization] && !row[colIndices.eventName] && !row[colIndices.submissionId]) {
      continue;
    }
    
    // Build order object with FRONTEND-READY property names
    const order = {
      // Platform
      platform: 'amazon',
      source: 'amazon',
      
      // IDs
      id: row[colIndices.submissionId] || row[colIndices.historicalId] || i,
      submissionId: row[colIndices.submissionId] || '',
      historicalId: row[colIndices.historicalId] || '',
      confirmationNumber: row[colIndices.confirmationNumber] || '',
      
      // Core info (frontend property names)
      organization: formatValue(row[colIndices.organization]),
      eventName: formatValue(row[colIndices.eventName]),
      eventDate: formatDate(row[colIndices.eventDate]),
      timestamp: formatDate(row[colIndices.timestamp]),
      
      // Pickup info (frontend names)
      pickupPerson: formatValue(row[colIndices.pickupPerson]),
      pickupEmail: formatValue(row[colIndices.pickupEmail]),
      pickupPhone: formatValue(row[colIndices.pickupPhone]),
      
      // Amazon-specific (frontend names)
      wishlistLink: formatValue(row[colIndices.wishlistLink]),
      orderNumbers: formatValue(row[colIndices.orderNumbers]),
      Total_1: parseFloat(row[colIndices.total1]) || '',
      Total_2: parseFloat(row[colIndices.total2]) || '',
      totalOrder: parseFloat(row[colIndices.totalOrder]) || '',
      backupItems: formatValue(row[colIndices.backupItems]),
      formNotes: formatValue(row[colIndices.formNotes]),
      
      // Staff fields (frontend names)
      processedBy: formatValue(row[colIndices.processedBy]),
      timeProcessedBy: formatDate(row[colIndices.timeProcessedBy]),
      comments: formatValue(row[colIndices.comments]),
      pickedUpStatus: formatValue(row[colIndices.pickedUp]),
      nonPOSubmitted: formatValue(row[colIndices.nonPO]),
      
      // Status - normalized to lowercase kebab-case for frontend
      status: normalizeStatusForFrontend(row[colIndices.status]),
      Order_Status: row[colIndices.status] || '', // Keep original too
      
      // Metadata
      rowIndex: i
    };
    
    orders.push(order);
  }
  
  return orders;
}

/**
 * Process Target orders with ALL frontend mappings done here
 */
function processTargetOrdersOptimized(data) {
  if (data.length <= 1) return [];
  
  const headers = data[0];
  const orders = [];
  
  // Pre-compute column indices once
  const colIndices = {
    timestamp: headers.indexOf('Timestamp'),
    submissionId: headers.indexOf('Submission_Id'),
    historicalId: headers.indexOf('Historical_Submission_Id'),
    organization: headers.indexOf('Student_Organization'),
    eventName: headers.indexOf('Event_Name'),
    eventDate: headers.indexOf('Event_Date'),
    pickupPerson: headers.indexOf('Pickup_Person_Name'),
    pickupEmail: headers.indexOf('Pickup_Person_Email'),
    pickupPhone: headers.indexOf('Pickup_Person_Phone'),
    cartTotal: headers.indexOf('Cart_Total'),
    orderConfirmation: headers.indexOf('Order_Confirmation_Number'),
    backupItems: headers.indexOf('Backup_Items_And_Quantity'),
    formNotes: headers.indexOf('Form Submitter Notes'),
    processedBy: headers.indexOf('Processed_By'),
    timeProcessedBy: headers.indexOf('Time_Processed_By'),
    comments: headers.indexOf('Comments'),
    status: headers.indexOf('Order_Status'),
    pickedUp: headers.indexOf('Picked_Up_Status'),
    confirmationNumber: headers.indexOf('Confirmation_Number')
  };
  
  // Item columns
  const itemUrls = [];
  const itemQuantities = [];
  for (let n = 1; n <= 10; n++) {
    const numWord = ['First', 'Second', 'Third', 'Fourth', 'Fifth', 'Sixth', 'Seventh', 'Eighth', 'Ninth', 'Tenth'][n-1];
    itemUrls.push(headers.indexOf(`${numWord}_Item_Url`));
    itemQuantities.push(headers.indexOf(`${numWord}_Item_Quantity`));
  }
  
  // Process each row
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    
    // Skip empty rows
    if (!row[colIndices.organization] && !row[colIndices.eventName] && !row[colIndices.submissionId]) {
      continue;
    }
    
    // Parse items once
    const items = [];
    for (let n = 0; n < 10; n++) {
      const url = row[itemUrls[n]];
      if (url && String(url).trim() !== '') {
        items.push({
          url: String(url).trim(),
          quantity: row[itemQuantities[n]] || 1,
          itemNumber: n + 1
        });
      }
    }
    
    // Build order with FRONTEND-READY property names
    const order = {
      // Platform
      platform: 'target',
      source: 'target',
      
      // IDs
      id: row[colIndices.submissionId] || row[colIndices.historicalId] || i,
      submissionId: row[colIndices.submissionId] || '',
      historicalId: row[colIndices.historicalId] || '',
      confirmationNumber: row[colIndices.confirmationNumber] || '',
      
      // Core info (frontend names)
      organization: formatValue(row[colIndices.organization]),
      eventName: formatValue(row[colIndices.eventName]),
      eventDate: formatDate(row[colIndices.eventDate]),
      timestamp: formatDate(row[colIndices.timestamp]),
      
      // Pickup info (frontend names)
      pickupPerson: formatValue(row[colIndices.pickupPerson]),
      pickupEmail: formatValue(row[colIndices.pickupEmail]),
      pickupPhone: formatValue(row[colIndices.pickupPhone]),
      
      // Target-specific (frontend names)
      cartTotal: parseFloat(row[colIndices.cartTotal]) || '',
      Cart_Total: row[colIndices.cartTotal] || '', // Keep original
      orderConfirmation: formatValue(row[colIndices.orderConfirmation]),
      backupItems: formatValue(row[colIndices.backupItems]),
      formNotes: formatValue(row[colIndices.formNotes]),
      items: items, // Pre-parsed items
      
      // Staff fields (frontend names)
      processedBy: formatValue(row[colIndices.processedBy]),
      timeProcessedBy: formatDate(row[colIndices.timeProcessedBy]),
      comments: formatValue(row[colIndices.comments]),
      pickedUpStatus: formatValue(row[colIndices.pickedUp]),
      
      // Status - normalized for frontend
      status: normalizeStatusForFrontend(row[colIndices.status]),
      Order_Status: row[colIndices.status] || '',
      
      // Metadata
      rowIndex: i
    };
    
    orders.push(order);
  }
  
  return orders;
}

/**
 * Get document submissions - FULLY OPTIMIZED
 */
function getDocumentSubmissions() {
  const startTime = Date.now();
  
  try {
    const spreadsheet = getCachedSpreadsheet();
    const sheet = spreadsheet.getSheetByName('DocumentSubmissions');
    
    if (!sheet) {
      return {
        success: false,
        documents: [],
        message: 'DocumentSubmissions sheet not found'
      };
    }
    
    const data = sheet.getDataRange().getValues();
    
    if (data.length <= 1) {
      return {
        success: true,
        documents: [],
        message: 'No document submissions found'
      };
    }
    
    const headers = data[0];
    const documents = [];
    
    // Pre-compute column indices once
    const colIndices = {
      timestamp: headers.indexOf('Timestamp'),
      submissionId: headers.indexOf('Submission_Id'),
      historicalId: headers.indexOf('Historical_Submission_Id'),
      firstName: headers.indexOf('First_Name'),
      lastName: headers.indexOf('Last_Name'),
      email: headers.indexOf('Submission_Email_Address'),
      organization: headers.indexOf('Student_Organization'),
      eventName: headers.indexOf('Event_Name'),
      eventDate: headers.indexOf('Event_Date'),
      nonPOFile: headers.indexOf('nonPO_FileLink'),
      signInFile: headers.indexOf('signIn_FileLink'),
      invoiceFile: headers.indexOf('invoice_FileLink'),
      eventFlyerFile: headers.indexOf('eventFlyer_FileLink'),
      confirmationNumber: headers.indexOf('Confirmation_Number'),
      notes: headers.indexOf('Form Submitter Notes'),
      comments: headers.indexOf('Comments'),
      validDataCheck: headers.indexOf('Valid_Data_Check'),
      semesterId: headers.indexOf('Semester_Id')
    };
    
    // Process rows with direct indexed access (fastest method)
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      
      // Skip completely empty rows
      if (!row[colIndices.firstName] && !row[colIndices.lastName] && !row[colIndices.organization]) {
        continue;
      }
      
      documents.push({
        // IDs
        id: row[colIndices.submissionId] || row[colIndices.historicalId] || `doc_${i}`,
        submissionId: row[colIndices.submissionId] || '',
        historicalId: row[colIndices.historicalId] || '',
        semesterId: row[colIndices.semesterId] || '',
        
        // Timestamps
        timestamp: formatDate(row[colIndices.timestamp]),
        
        // Person info - FRONTEND-READY property names
        firstName: formatValue(row[colIndices.firstName]),
        lastName: formatValue(row[colIndices.lastName]),
        email: formatValue(row[colIndices.email]),
        
        // Event info - FRONTEND-READY property names
        organization: formatValue(row[colIndices.organization]),
        eventName: formatValue(row[colIndices.eventName]),
        eventDate: formatDate(row[colIndices.eventDate]),
        
        // Files - FRONTEND-READY property names
        nonPOFile: formatValue(row[colIndices.nonPOFile]),
        signInFile: formatValue(row[colIndices.signInFile]),
        invoiceFile: formatValue(row[colIndices.invoiceFile]),
        eventFlyerFile: formatValue(row[colIndices.eventFlyerFile]),
        
        // Metadata
        confirmationNumber: formatValue(row[colIndices.confirmationNumber]),
        notes: formatValue(row[colIndices.notes]),
        comments: formatValue(row[colIndices.comments]),
        validDataCheck: formatValue(row[colIndices.validDataCheck])
      });
    }
    
    const elapsed = Date.now() - startTime;
    console.log(`✅ Loaded ${documents.length} document submissions in ${elapsed}ms`);
    
    return {
      success: true,
      documents: documents,
      message: `Found ${documents.length} document submissions`,
      loadTimeMs: elapsed
    };
    
  } catch (error) {
    console.error('❌ Error getting documents:', error);
    return {
      success: false,
      documents: [],
      message: `Error: ${error.toString()}`
    };
  }
}

// ========================================
// HELPER FUNCTIONS
// ========================================

/**
 * Format value - handles nulls, dates, empty strings
 */
function formatValue(value) {
  if (value === null || value === undefined || value === '') return '';
  if (value instanceof Date) {
    return Utilities.formatDate(value, 'America/New_York', 'MM/dd/yyyy');
  }
  return String(value).trim();
}

/**
 * Format date value
 */
function formatDate(value) {
  if (!value || value === '') return '';
  if (value instanceof Date) {
    return Utilities.formatDate(value, 'America/New_York', 'MM/dd/yyyy HH:mm:ss');
  }
  return String(value).trim();
}

/**
 * Normalize status to lowercase kebab-case for frontend consistency
 */
function normalizeStatusForFrontend(status) {
  if (!status) return 'unassigned';
  
  const s = String(status).trim().toLowerCase();
  
  // Direct mapping from display values
  const mapping = {
    'new order': 'new-order',
    'ordered': 'ordered',
    'delivered to mailroom': 'delivered-to-mailroom',
    'completed': 'completed',
    'awaiting club response': 'awaiting-club-response',
    'cancelled': 'cancelled',
    'pending': 'new-order',
    'unassigned': 'unassigned'
  };
  
  return mapping[s] || s.replace(/\s+/g, '-');
}

/**
 * TEST FUNCTION - Run this to verify the fix works
 * This will log the first few documents to verify field mapping
 */
function testDocumentSubmissionsDebug() {
  console.log('🧪 Testing getDocumentSubmissions()...');
  console.log('═══════════════════════════════════════');
  
  const result = getDocumentSubmissions();
  
  console.log('\n📊 Result:');
  console.log('Success:', result.success);
  console.log('Message:', result.message);
  console.log('Document count:', result.documents.length);
  
  if (result.documents.length > 0) {
    console.log('\n📄 First document sample:');
    const firstDoc = result.documents[0];
    console.log(JSON.stringify(firstDoc, null, 2));
    
    console.log('\n✅ Field Verification:');
    console.log('- ID:', firstDoc.id ? '✓' : '✗');
    console.log('- Timestamp:', firstDoc.timestamp ? '✓' : '✗');
    console.log('- First Name:', firstDoc.firstName ? '✓' : '✗');
    console.log('- Last Name:', firstDoc.lastName ? '✓' : '✗');
    console.log('- Email:', firstDoc.email ? '✓' : '✗');
    console.log('- Organization:', firstDoc.organization ? '✓' : '✗');
    console.log('- Event Name:', firstDoc.eventName ? '✓' : '✗');
    console.log('- nonPO File:', firstDoc.nonPOFile ? '✓' : '✗');
  }
  
  console.log('\n═══════════════════════════════════════');
  console.log('🎉 Test complete!');
  
  return result;
}
/**
* Get club names and employee names from Names sheet
* @returns {Object} Names data
*/
function getNamesData() {
try {
const spreadsheet = getCachedSpreadsheet();
const namesSheet = spreadsheet.getSheetByName('Names');
if (!namesSheet) {
return {
success: false,
clubs: [],
employees: [],
message: 'Names sheet not found'
};
}
const data = namesSheet.getDataRange().getValues();
const headers = data[0];
const clubNamesIndex = headers.findIndex(h => 
h.toString().toLowerCase().includes('club')
);
const employeeNamesIndex = headers.findIndex(h => 
h.toString().toLowerCase().includes('employee')
);
const clubs = [];
const employees = [];
for (let i = 1; i < data.length; i++) {
if (clubNamesIndex !== -1 && data[i][clubNamesIndex]) {
clubs.push(data[i][clubNamesIndex].toString().trim());
}
if (employeeNamesIndex !== -1 && data[i][employeeNamesIndex]) {
employees.push(data[i][employeeNamesIndex].toString().trim());
}
}
const uniqueClubs = [...new Set(clubs)].filter(c => c).sort();
const uniqueEmployees = [...new Set(employees)].filter(e => e).sort();
return {
success: true,
clubs: uniqueClubs,
employees: uniqueEmployees,
message: `Loaded ${uniqueClubs.length} clubs and ${uniqueEmployees.length} employees`
};
} catch (error) {
console.error('Error in getNamesData:', error);
return {
success: false,
clubs: [],
employees: [],
message: error.toString()
};
}
}
/**
* Get dashboard totals and statistics
* @returns {Object} Dashboard data
*/
function getOrderTotals() {
try {
const spreadsheet = getCachedSpreadsheet();
// Amazon Orders
const amazonSheet = spreadsheet.getSheetByName('AmazonOrders');
const amazonData = amazonSheet ? amazonSheet.getDataRange().getValues() : [[]];
const amazonHeaders = amazonData[0];
const amazonRows = amazonData.slice(1).filter(r => r.join("").trim() !== "");
const amazonCounts = countStatuses(amazonRows, amazonHeaders);
const amazonSpent = calculateTotalSpent(amazonRows, amazonHeaders, 'Total_Order');
// Target Orders
const targetSheet = spreadsheet.getSheetByName('TargetOrders');
const targetData = targetSheet ? targetSheet.getDataRange().getValues() : [[]];
const targetHeaders = targetData[0];
const targetRows = targetData.slice(1).filter(r => r.join("").trim() !== "");
const targetCounts = countStatuses(targetRows, targetHeaders);
const targetSpent = calculateTotalSpent(targetRows, targetHeaders, 'Cart_Total');
// Totals
const totalOrders = amazonRows.length + targetRows.length;
const allKeys = new Set([...Object.keys(amazonCounts), ...Object.keys(targetCounts)]);
const totalCounts = {};
allKeys.forEach(k => {
totalCounts[k] = (amazonCounts[k] || 0) + (targetCounts[k] || 0);
});
return {
success: true,
amazonOrders: amazonRows.length,
targetOrders: targetRows.length,
totalOrders: totalOrders,
amazonSpent: amazonSpent,
targetSpent: targetSpent,
totalSpent: amazonSpent + targetSpent,
statuses: {
amazon: amazonCounts,
target: targetCounts,
total: totalCounts
}
};
} catch (error) {
console.error('Error getting order totals:', error);
return { success: false, message: error.message };
}
}
/**
 * Count statuses in order rows
 * Possible statuses: new-order, ordered, delivered-to-mailroom, awaiting-club-response, cancelled
 * @param {Array} rows - Data rows
 * @param {Array} headers - Header row
 * @returns {Object} Status counts
 */
function countStatuses(rows, headers) {
  const statusIndex = headers.indexOf("Order_Status");
  const counts = {};

  rows.forEach(row => {
    let raw = (statusIndex !== -1) ? row[statusIndex] : null;
    const status = normalizeStatus(raw);
    counts[status] = (counts[status] || 0) + 1;
  });

  return counts;
}
/**
* Calculate total spent from rows
* @param {Array} rows - Data rows
* @param {Array} headers - Header row
* @param {string} columnName - Column to sum
* @returns {number} Total
*/
function calculateTotalSpent(rows, headers, columnName) {
const columnIndex = headers.indexOf(columnName);
if (columnIndex === -1) return 0;
return rows.reduce((sum, row) => {
const value = parseMoneyValue(row[columnIndex]);
return sum + value;
}, 0);
}
// ========================================
// DATA UPDATE FUNCTIONS
// ========================================
/**
* Update order status
* @param {string} orderId - Order ID (Historical_Submission_Id or Submission_Id)
* @param {string} platform - Platform (amazon/target/document)
* @param {string} newStatus - New status value (kebab-case format from frontend)
* @returns {Object} Update result
*/
function updateOrderStatus(orderId, platform, newStatus) {
  try {
    console.log(`Updating order: ID=${orderId}, Platform=${platform}, Status=${newStatus}`);

    // Validate and convert status
    const statusMap = {
      'new-order': 'New Order',
      'ordered': 'Ordered',
      'delivered-to-mailroom': 'Delivered to Mailroom',
      'completed': 'Completed',
      'awaiting-club-response': 'Awaiting Club Response',
      'cancelled': 'Cancelled'
    };
    
    const normalizedStatus = newStatus.toLowerCase().replace(/\s+/g, '-');
    
    if (!statusMap[normalizedStatus]) {
      throw new Error(`Invalid status: ${newStatus}. Must be one of: ${Object.keys(statusMap).join(', ')}`);
    }
    
    const displayStatus = statusMap[normalizedStatus];
    console.log(`Status validated and converted: "${newStatus}" → "${displayStatus}"`);
const sheetMap = {
'amazon': 'AmazonOrders',
'target': 'TargetOrders',
'document': 'DocumentSubmissions'
};
const sheetName = sheetMap[platform];
if (!sheetName) {
throw new Error(`Invalid platform: ${platform}`);
}
const sheet = getCachedSheet(sheetName);
const data = sheet.getDataRange().getValues();
const headers = data[0];
// Find row by Historical_Submission_Id first, then Submission_Id
const historicalIdIndex = findColumnIndex(headers, 'Historical_Submission_Id');
const submissionIdIndex = findColumnIndex(headers, 'Submission_Id');
let foundRow = -1;
for (let i = 1; i < data.length; i++) {
const historicalId = historicalIdIndex !== -1 ? data[i][historicalIdIndex] : null;
const submissionId = submissionIdIndex !== -1 ? data[i][submissionIdIndex] : null;
if (historicalId == orderId || submissionId == orderId) {
foundRow = i;
break;
}
}
if (foundRow === -1) {
throw new Error(`Order with ID ${orderId} not found in ${sheetName}`);
}
// Find or create status column
let statusColumnIndex = findColumnIndex(headers, 'Order_Status');
if (statusColumnIndex === -1) {
statusColumnIndex = headers.length;
sheet.getRange(1, statusColumnIndex + 1).setValue('Order_Status');
console.log(`Created Order_Status column at index ${statusColumnIndex}`);
}
// Update the status with the display-friendly format
sheet.getRange(foundRow + 1, statusColumnIndex + 1).setValue(displayStatus);
console.log(`Updated status for row ${foundRow + 1} to: ${displayStatus}`);
return {
success: true,
message: `Order status updated successfully to: ${displayStatus}`
};
} catch (error) {
console.error('Error updating order status:', error);
return { success: false, message: error.message };
}
}
/**
* Update order details
* @param {string} orderId - Order ID
* @param {string} platform - Platform
* @param {Object} updatedData - Data to update
* @returns {Object} Update result
*/
function updateOrderDetails(orderId, platform, updatedData) {
try {
console.log(`Updating ${platform} order ${orderId}:`, Object.keys(updatedData));
const sheetMap = {
'amazon': 'AmazonOrders',
'target': 'TargetOrders'
};
const sheetName = sheetMap[platform];
const sheet = getCachedSheet(sheetName);
const data = sheet.getDataRange().getValues();
const headers = data[0];
// ✨ FIX: Find row by Historical_Submission_Id FIRST, then Submission_Id
const historicalIdIndex = findColumnIndex(headers, 'Historical_Submission_Id');
const submissionIdIndex = findColumnIndex(headers, 'Submission_Id');
let foundRow = -1;
// Try Historical_Submission_Id first
if (historicalIdIndex !== -1) {
for (let i = 1; i < data.length; i++) {
if (data[i][historicalIdIndex] == orderId) {
foundRow = i;
console.log(`✅ Found order by Historical_Submission_Id at row ${foundRow + 1}`);
break;
}
}
}
// If not found, try Submission_Id
if (foundRow === -1 && submissionIdIndex !== -1) {
for (let i = 1; i < data.length; i++) {
if (data[i][submissionIdIndex] == orderId) {
foundRow = i;
console.log(`✅ Found order by Submission_Id at row ${foundRow + 1}`);
break;
}
}
}
if (foundRow === -1) {
throw new Error(`Order with ID ${orderId} not found`);
}
// Check if we're updating Total fields (for Amazon auto-calculation)
let totalFieldsUpdated = false;
if (platform === 'amazon' && (updatedData.Total_1 || updatedData.Total_2)) {
totalFieldsUpdated = true;
}
// Update each field
Object.keys(updatedData).forEach(key => {
let columnIndex = findColumnIndex(headers, key);
// If column doesn't exist, create it
if (columnIndex === -1) {
columnIndex = headers.length;
sheet.getRange(1, columnIndex + 1).setValue(key);
console.log(`➕ Created new column: ${key}`);
}
sheet.getRange(foundRow + 1, columnIndex + 1).setValue(updatedData[key]);
console.log(`✅ Updated ${key} in row ${foundRow + 1}`);
});
/**
* Create new order from backend UI
* @param {Object} orderData - Order data
* @param {string} platform - Platform (amazon/target)
* @returns {Object} Creation result
*/
function createNewOrder(orderData, platform) {
try {
console.log(`Creating new ${platform} order from backend UI`);
const sheetMap = {
'amazon': 'AmazonOrders',
'target': 'TargetOrders'
};
const sheetName = sheetMap[platform];
if (!sheetName) {
throw new Error(`Invalid platform: ${platform}`);
}
const sheet = getCachedSheet(sheetName);
const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
// Prepare row data in correct order
const rowData = [];
// In createNewOrder function
headers.forEach(header => {
  if (orderData.hasOwnProperty(header)) {
    rowData.push(orderData[header]);
  } else {
    switch (header) {
      case 'Timestamp':
        rowData.push(getFormattedTimestamp());
        break;
      case 'Historical_Submission_Id':
      case 'Semester_Id':
      case 'Submission_Id':
      case 'Confirmation_Number':
        rowData.push('');
        break;
      case 'Order_Status':
        rowData.push('New Order'); // Changed from 'Pending'
        break;
      default:
        rowData.push('');
    }
  }
});
// Add the new row
const nextRow = sheet.getLastRow() + 1;
sheet.getRange(nextRow, 1, 1, rowData.length).setValues([rowData]);
console.log(`✅ New ${platform} order created at row ${nextRow}`);
// Assign IDs immediately
const idResult = assignIDsToRow(sheet, nextRow);
if (idResult.success) {
console.log('✅ IDs assigned:', idResult.assignedIds);
} else {
console.log('⚠️ ID assignment warning:', idResult.error);
}
// Generate and add confirmation number
const orgName = orderData.Student_Organization || 'Unknown';
const confirmationNumber = generateConfirmationNumber(orgName);
addConfirmationNumberToSheet(sheet, nextRow, confirmationNumber);
console.log(`✅ Confirmation number added: ${confirmationNumber}`);
return {
success: true,
message: 'Order created successfully',
rowIndex: nextRow,
submissionId: idResult.assignedIds?.Submission_Id || nextRow,
confirmationNumber: confirmationNumber
};
} catch (error) {
console.error('❌ Error creating order:', error);
return {
success: false,
message: `Failed to create order: ${error.message}`
};
}
}
/**
* Generate confirmation number
* @param {string} clubName - Organization name
* @param {Date} submissionDate - Optional submission date
* @returns {string} Confirmation number
*/
function generateConfirmationNumber(clubName, submissionDate) {
const date = submissionDate || new Date();
const month = String(date.getMonth() + 1).padStart(2, '0');
const day = String(date.getDate()).padStart(2, '0');
const year = date.getFullYear();
const sanitizedClubName = sanitizeFileName(clubName, 15).toUpperCase();
return `CD-${month}${day}${year}-${sanitizedClubName}`;
}
/**
* Add confirmation number to sheet row
* @param {Sheet} sheet - Google Sheets sheet
* @param {number} row - Row number
* @param {string} confirmationNumber - Confirmation number to add
*/
function addConfirmationNumberToSheet(sheet, row, confirmationNumber) {
try {
const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
const confirmationCol = findColumnIndex(headers, 'Confirmation_Number');
if (confirmationCol !== -1) {
sheet.getRange(row, confirmationCol + 1).setValue(confirmationNumber);
console.log(`✅ Added confirmation number to row ${row}: ${confirmationNumber}`);
} else {
console.log('⚠️ Confirmation_Number column not found');
}
} catch (error) {
console.error('❌ Failed to add confirmation number:', error);
}
}
// Auto-calculate Total_Order for Amazon if Total_1 or Total_2 was updated
if (totalFieldsUpdated) {
console.log('🧮 Auto-calculating Total_Order...');
const total1Index = findColumnIndex(headers, 'Total_1');
const total2Index = findColumnIndex(headers, 'Total_2');
const total1 = total1Index !== -1 ? parseMoneyValue(sheet.getRange(foundRow + 1, total1Index + 1).getValue()) : 0;
const total2 = total2Index !== -1 ? parseMoneyValue(sheet.getRange(foundRow + 1, total2Index + 1).getValue()) : 0;
const totalOrder = total1 + total2;
let totalOrderIndex = findColumnIndex(headers, 'Total_Order');
if (totalOrderIndex === -1) {
totalOrderIndex = headers.length;
sheet.getRange(1, totalOrderIndex + 1).setValue('Total_Order');
}
sheet.getRange(foundRow + 1, totalOrderIndex + 1).setValue(totalOrder);
console.log(`✅ Auto-calculated Total_Order: ${totalOrder}`);
}
console.log(`✅ Updated order ${orderId}`);
return {
success: true,
message: 'Order details updated successfully'
};
} catch (error) {
console.error('Error updating order details:', error);
return {
success: false,
message: `Failed to update order: ${error.message}`
};
}
}
/**
 * Update document submission
 * @param {string} docId - Document submission ID
 * @param {Object} updatedData - Object with column names and new values
 * @returns {Object} Update result
 */
function updateDocumentSubmission(docId, updatedData) {
  try {
    console.log(`Updating document submission: ID=${docId}`);
    
    const spreadsheet = getCachedSpreadsheet();
    const sheet = spreadsheet.getSheetByName('DocumentSubmissions');
    
    if (!sheet) {
      throw new Error('DocumentSubmissions sheet not found');
    }
    
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    
    // Find row by Submission_Id or Historical_Submission_Id
    const idIndex = headers.indexOf('Submission_Id');
    const historicalIdIndex = headers.indexOf('Historical_Submission_Id');
    
    let foundRow = -1;
    for (let i = 1; i < data.length; i++) {
      const submissionId = data[i][idIndex];
      const historicalId = historicalIdIndex !== -1 ? data[i][historicalIdIndex] : null;
      
      if (submissionId == docId || historicalId == docId) {
        foundRow = i;
        break;
      }
    }
    
    if (foundRow === -1) {
      throw new Error(`Document submission with ID ${docId} not found`);
    }
    
    // Update the row with new data
    Object.keys(updatedData).forEach(columnName => {
      const colIndex = headers.indexOf(columnName);
      if (colIndex !== -1) {
        sheet.getRange(foundRow + 1, colIndex + 1).setValue(updatedData[columnName]);
        console.log(`  Updated ${columnName} = ${updatedData[columnName]}`);
      } else {
        console.warn(`  Column ${columnName} not found in sheet`);
      }
    });
    
    console.log(`✅ Document submission ${docId} updated successfully`);
    
    return {
      success: true,
      message: 'Document submission updated successfully'
    };
    
  } catch (error) {
    console.error('Error updating document:', error);
    return {
      success: false,
      message: error.message
    };
  }
}
// ========================================
// TEST/UTILITY FUNCTIONS
// ========================================
/**
* Test spreadsheet connection
* @returns {Object} Connection test result
*/
function testSpreadsheetConnection() {
try {
const spreadsheet = getCachedSpreadsheet();
const sheets = spreadsheet.getSheets().map(sheet => sheet.getName());
return {
success: true,
message: 'Connection successful',
spreadsheetName: spreadsheet.getName(),
availableSheets: sheets,
url: spreadsheet.getUrl()
};
} catch (error) {
console.error('Connection test failed:', error);
return {
success: false,
message: `Connection failed: ${error.message}`
};
}
}
