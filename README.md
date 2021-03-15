# SquarespaceShipstationFixer
Shipstation's Squarespace integration doesn't import orders that are missing postal codes. This Google Apps Script resends those orders with a 00000 postal code.


To use:
1. Copy the .gs files into an AppsScript project.
2. In the runForFirstRun function, replace "YOUR_KEYS" with your keys for Shipstation and Squarespace. For Squarespace, use read-only Orders API permissions when creating the key. 
3. In the debugger, run the runForFirstRun function.
4. Set up a time-based trigger for the script that calls the mainWrapper function.
