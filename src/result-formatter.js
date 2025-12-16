/**
 * Result Formatter
 * Formats and injects AI responses based on add-on settings
 */

export class ResultFormatter {
    constructor(context) {
        this.context = context;
    }

    /**
     * Format result based on add-on settings
     */
    formatResult(addon, aiResponse, originalMessage = null) {
        let formatted = aiResponse;

        // Apply result format
        switch (addon.resultFormat) {
            case 'append':
                formatted = this.formatAppend(aiResponse);
                break;

            case 'separate':
                formatted = this.formatSeparate(aiResponse, addon);
                break;

            case 'collapsible':
            default:
                formatted = this.formatCollapsible(aiResponse, addon);
                break;
        }

        return formatted;
    }

    /**
     * Format as inline append
     */
    formatAppend(response) {
        return `\n\n${response}`;
    }

    /**
     * Format as separate block
     */
    formatSeparate(response, addon) {
        return `\n\n--- ${addon.name} ---\n${response}\n---\n`;
    }

    /**
     * Format as collapsible details block
     */
    formatCollapsible(response, addon) {
        return `\n\n<details>\n<summary><strong>${addon.name}</strong></summary>\n<div>\n${response}\n</div>\n</details>`;
    }

    /**
     * Inject result into chat history as HTML comment
     */
    injectIntoChatHistory(messageId, addon, formattedResult) {
        try {
            // Find the message element
            const messageElement = this.findMessageElement(messageId);
            if (!messageElement) {
                console.warn(`[Add-Ons Extension] Message element not found: ${messageId}`);
                return false;
            }

            // Find message content area
            const contentArea = messageElement.querySelector('.mes_text') ||
                messageElement.querySelector('.message') ||
                messageElement;

            // Create HTML comment
            const comment = `<!-- addon-result:${addon.id} -->${formattedResult}<!-- /addon-result:${addon.id} -->`;

            // Append to message content
            if (contentArea.innerHTML) {
                contentArea.innerHTML += comment;
            } else if (contentArea.textContent !== undefined) {
                contentArea.textContent += formattedResult;
            }

            console.log(`[Add-Ons Extension] Injected result into chat history for: ${addon.name}`);
            return true;
        } catch (error) {
            console.error(`[Add-Ons Extension] Error injecting into chat history:`, error);
            return false;
        }
    }

    /**
     * Inject result into dropdown UI
     */
    injectIntoDropdown(addon, formattedResult) {
        try {
            let container = document.getElementById('add-ons-dropdown-container');

            if (!container) {
                // Create container if it doesn't exist
                container = document.createElement('div');
                container.id = 'add-ons-dropdown-container';
                container.className = 'add-ons-dropdown-container';

                // Try to insert after chat container
                const chatContainer = document.querySelector('#chat_container') ||
                    document.querySelector('.chat_container');
                if (chatContainer && chatContainer.parentElement) {
                    chatContainer.parentElement.appendChild(container);
                } else {
                    document.body.appendChild(container);
                }
            }

            // Create or update add-on section
            let addonSection = document.getElementById(`addon-section-${addon.id}`);

            if (!addonSection) {
                addonSection = document.createElement('details');
                addonSection.id = `addon-section-${addon.id}`;
                addonSection.className = 'addon-result-section';

                const summary = document.createElement('summary');
                summary.className = 'addon-result-summary';
                summary.textContent = `${addon.name} (${new Date().toLocaleTimeString()})`;

                const content = document.createElement('div');
                content.className = 'addon-result-content';
                content.id = `addon-content-${addon.id}`;

                addonSection.appendChild(summary);
                addonSection.appendChild(content);
                container.appendChild(addonSection);
            }

            // Update content
            const content = document.getElementById(`addon-content-${addon.id}`);
            if (content) {
                // Clear existing content and add new result
                content.innerHTML = '';
                
                // Append new result with timestamp
                const resultDiv = document.createElement('div');
                resultDiv.className = 'addon-result-item';
                resultDiv.style.cssText = 'background: var(--SmartThemeBodyColor, #1e1e1e) !important; color: var(--SmartThemeBodyColor, #eee) !important;';
                resultDiv.innerHTML = formattedResult;

                const timestamp = document.createElement('div');
                timestamp.className = 'addon-result-timestamp';
                timestamp.textContent = `Generated at ${new Date().toLocaleTimeString()}`;
                timestamp.style.cssText = 'color: var(--SmartThemeBodyColor, rgba(255, 255, 255, 0.5)) !important;';

                resultDiv.appendChild(timestamp);
                content.appendChild(resultDiv);

                // Auto-expand if collapsed
                addonSection.open = true;
                
                // Scroll into view
                addonSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }

            console.log(`[Add-Ons Extension] Injected result into dropdown for: ${addon.name}`);
            return true;
        } catch (error) {
            console.error(`[Add-Ons Extension] Error injecting into dropdown:`, error);
            return false;
        }
    }

    /**
     * Find message element by ID or other identifier
     */
    findMessageElement(messageId) {
        // Try direct ID lookup
        let element = document.getElementById(messageId);
        if (element) {
            return element;
        }

        // Try data attribute
        element = document.querySelector(`[data-message-id="${messageId}"]`);
        if (element) {
            return element;
        }

        // Try finding by message index in chat
        if (this.context.chat && Array.isArray(this.context.chat)) {
            const messageIndex = this.context.chat.findIndex(msg =>
                msg.uid === messageId || msg.id === messageId
            );

            if (messageIndex !== -1) {
                // Try to find corresponding DOM element
                const messageElements = document.querySelectorAll('.mes, .message');
                if (messageElements[messageIndex]) {
                    return messageElements[messageIndex];
                }
            }
        }

        // Fallback: get last message element
        const messageElements = document.querySelectorAll('.mes, .message');
        return messageElements[messageElements.length - 1] || null;
    }

    /**
     * Get message ID from message object
     */
    getMessageId(message) {
        if (!message) {
            return null;
        }

        return message.uid ||
            message.id ||
            message.mesId ||
            `msg_${Date.now()}`;
    }
}
