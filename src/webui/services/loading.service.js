/**
 * Handles loading overlay
 */
class LoadingService {
    static show(message = 'Processing...') {
        const overlay = document.getElementById('loadingOverlay');
        const text = overlay.querySelector('.loading-text');
        text.textContent = message;
        overlay.style.display = 'flex';
    }

    static hide() {
        const overlay = document.getElementById('loadingOverlay');
        overlay.style.display = 'none';
    }
}
