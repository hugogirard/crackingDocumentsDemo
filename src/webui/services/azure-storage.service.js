/**
 * Handles file uploads to Azure Blob Storage
 */
class AzureStorageService {
    constructor() {
        this.config = CONFIG.storage;
        this.apiBaseUrl = CONFIG.valetApiBaseUrl;
        this.timeout = CONFIG.app.uploadTimeout;
    }

    /**
     * Get SAS URL from backend API
     * @param {string} fileName - The file name
     * @returns {Promise<Object>} Response with SAS URL
     */
    async getSasUrl(fileName) {
        try {
            const response = await fetch(`${this.apiBaseUrl}/sas?blob_name=${fileName}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`Failed to get SAS URL: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error getting SAS URL:', error);
            throw error;
        }
    }

    /**
     * Upload file to Azure Blob Storage using SAS URL
     * @param {File} file - The file to upload
     * @returns {Promise<Object>} Upload result with URL
     */
    async uploadFile(file) {
        console.log('Uploading file to Azure Storage:', file.name);
        
        try {
            // Step 1: Get SAS URL from backend
            const sasUrl = await this.getSasUrl(file.name);
            const blobUrl = sasUrl.split('?')[0]; // Remove SAS token to get clean blob URL
            const blobName = file.name;

            // Store SAS URL in state service for later use
            stateService.setSasUrl(sasUrl, blobName);
            stateService.setCurrentFileName(file.name);

            // Step 2: Upload file to Azure Blob Storage using native browser fetch
            const uploadResponse = await fetch(sasUrl, {
                method: 'PUT',
                headers: {
                    'x-ms-blob-type': 'BlockBlob',
                    'Content-Type': file.type || 'application/octet-stream'
                },
                body: file
            });

            if (!uploadResponse.ok) {
                throw new Error(`Upload failed: ${uploadResponse.statusText}`);
            }

            console.log('File uploaded successfully:', file.name);

            return {
                success: true,
                url: blobUrl,
                sasUrl: sasUrl,
                blobName: blobName || file.name,
                uploadedAt: new Date().toISOString()
            };
        } catch (error) {
            console.error('Upload error:', error);
            throw error;
        }
    }

    /**
     * Upload file with progress tracking
     * @param {File} file - The file to upload
     * @param {Function} onProgress - Progress callback (percentage)
     * @returns {Promise<Object>} Upload result with URL
     */
    async uploadFileWithProgress(file, onProgress) {
        console.log('Uploading file with progress tracking:', file.name);
        
        try {
            // Step 1: Get SAS URL from backend
            const sasUrl = await this.getSasUrl(file.name);
            const blobUrl = sasUrl.split('?')[0]; // Remove SAS token to get clean blob URL
            const blobName = file.name;

            // Step 2: Upload file using XMLHttpRequest for progress tracking
            return new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();

                // Progress tracking
                xhr.upload.addEventListener('progress', (event) => {
                    if (event.lengthComputable) {
                        const percentComplete = (event.loaded / event.total) * 100;
                        if (onProgress) {
                            onProgress(percentComplete);
                        }
                    }
                });

                // Upload complete
                xhr.addEventListener('load', () => {
                    if (xhr.status === 200 || xhr.status === 201) {
                        resolve({
                            success: true,
                            url: blobUrl,
                            blobName: blobName || file.name,
                            uploadedAt: new Date().toISOString()
                        });
                    } else {
                        reject(new Error(`Upload failed: ${xhr.statusText}`));
                    }
                });

                // Upload error
                xhr.addEventListener('error', () => {
                    reject(new Error('Upload failed due to network error'));
                });

                // Upload timeout
                xhr.timeout = this.timeout;
                xhr.addEventListener('timeout', () => {
                    reject(new Error('Upload timed out'));
                });

                // Open and send request
                xhr.open('PUT', sasUrl);
                xhr.setRequestHeader('x-ms-blob-type', 'BlockBlob');
                xhr.setRequestHeader('Content-Type', file.type || 'application/octet-stream');
                xhr.send(file);
            });
        } catch (error) {
            console.error('Upload error:', error);
            throw error;
        }
    }

    /**
     * Delete file from Azure Blob Storage
     * @param {string} blobName - Name of the blob to delete
     * @returns {Promise<boolean>} Success status
     */
    async deleteFile(blobName) {
        console.log('Deleting file from Azure Storage:', blobName);
        
        try {
            const response = await fetch(`${this.apiBaseUrl}/storage/delete`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    blobName: blobName,
                    containerName: this.config.containerName
                })
            });

            if (!response.ok) {
                throw new Error(`Delete failed: ${response.statusText}`);
            }

            return true;
        } catch (error) {
            console.error('Delete error:', error);
            throw error;
        }
    }
}
