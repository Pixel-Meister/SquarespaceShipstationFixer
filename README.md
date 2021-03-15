# SquarespaceShipstationFixer
Shipstation's Squarespace integration doesn't import orders that are missing postal codes. This Google Apps Script resends those orders with a 00000 postal code.

To use:
Copy the .gs files into an AppsScript project.
In the runForFirstRun function, replace "YOUR_KEYS" with your keys for Shipstation and Squarespace. For Squarespace, use read-only Orders API permissions when creating the key. 
In the debugger, run the runForFirstRun function.
Set up a time-based trigger for the script that calls the mainWrapper function.
