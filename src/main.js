const { app, dialog, ipcMain } = require('electron');
const fs = require('fs').promises;
const path = require('path');

ipcMain.handle('save-file', async (event, data) => {
    try {
        // Validate data
        if (!data) {
            return { success: false, message: 'No data provided' };
        }
        
        // Ensure data has the expected structure
        if (!data.programs || !data.clubs) {
            return { success: false, message: 'Invalid data structure' };
        }
        
        const { filePath } = await dialog.showSaveDialog({
            title: 'Save CIP File',
            defaultPath: path.join(app.getPath('documents'), 'cip-data.json'),
            filters: [
                { name: 'JSON Files', extensions: ['json'] }
            ]
        });

        if (!filePath) {
            return { success: false, message: 'Save cancelled' };
        }

        // Convert data to JSON string
        const jsonData = JSON.stringify(data, null, 2);
        
        // Write to file
        await fs.writeFile(filePath, jsonData);
        
        // Notify renderer of success
        event.sender.send('save-complete', { success: true });
        
        return { success: true };
    } catch (error) {
        console.error('Error saving file:', error);
        event.sender.send('error', { message: error.message });
        return { success: false, message: error.message };
    }
}); 