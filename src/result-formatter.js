/**
 * Result Formatter
 * Formats and injects AI responses based on add-on settings
 */

export class ResultFormatter {
    constructor(context) {
        this.context = context;
        // Performance: Cache DOM queries
        this.cachedAIMessageElement = null;
        this.lastMessageCount = 0;
        this.cacheInvalidationTime = 0;
    }

    /**
     * Format result based on add-on settings
     * @param {Object} addon - The add-on configuration
     * @param {string} aiResponse - The raw AI response
     * @param {Object} originalMessage - Original message object
     * @param {boolean} forDropdown - Whether this is for dropdown injection (no extra wrapping needed)
     */
    formatResult(addon, aiResponse, originalMessage = null, forDropdown = false) {
        // CRITICAL: Sanitize AI response before any processing
        let sanitized = this.sanitizeContent(aiResponse);
        let formatted = sanitized;

        // If injecting into dropdown, we already have the structure, so don't wrap
        if (forDropdown) {
            // Clean up any existing wrapper tags that might conflict
            formatted = this.cleanResponseForDropdown(sanitized);
            return formatted;
        }

        // Apply result format for chat history injection
        switch (addon.resultFormat) {
            case 'append':
                formatted = this.formatAppend(sanitized);
                break;

            case 'separate':
                formatted = this.formatSeparate(sanitized, addon);
                break;

            case 'collapsible':
            default:
                formatted = this.formatCollapsible(sanitized, addon);
                break;
        }

        return formatted;
    }

    /**
     * Clean response for dropdown injection - remove conflicting wrapper tags
     */
    cleanResponseForDropdown(response) {
        if (!response || typeof response !== 'string') {
            return response;
        }

        // Remove outer <details> tags if present (we already have our own)
        let cleaned = response.trim();

        // Match <details>...</details> at the start/end
        const detailsMatch = cleaned.match(/^<details[^>]*>(.*?)<\/details>$/is);
        if (detailsMatch) {
            cleaned = detailsMatch[1].trim();
        }

        // Also handle cases where there might be nested details - extract inner content
        // But preserve the structure if it's intentional (like the user's example)
        return cleaned;
    }

    /**
     * Sanitize AI-generated content to prevent container escape
     * 
     * SillyTavern handles Markdown/HTML/XML/CSS natively, but we need to
     * sanitize dangerous patterns that could break out of our isolated containers.
     * 
     * Security measures:
     * - Strip position: fixed/absolute (prevents escaping container bounds)
     * - Remove z-index (prevents stacking context issues)
     * - Block iframe/embed/object (prevents external content injection)
     * - Remove script tags (prevents JS execution)
     * - Strip style blocks (prevents global CSS injection)
     * - Remove event handlers (prevents inline JS)
     * - Neutralize javascript: protocols
     */
    sanitizeContent(response) {
        if (typeof response !== 'string') {
            return response;
        }

        let sanitized = response;

        // Remove dangerous position styles that could escape container
        sanitized = sanitized.replace(/position\s*:\s*(fixed|absolute)/gi, 'position: relative');

        // Remove z-index that could create stacking issues
        sanitized = sanitized.replace(/z-index\s*:\s*[^;]+;?/gi, '');

        // Remove viewport units that could cause overflow
        sanitized = sanitized.replace(/\b\d+v[wh]\b/gi, '100%');

        // Block iframe/embed/object tags
        sanitized = sanitized.replace(/<(iframe|embed|object)[^>]*>.*?<\/\1>/gis, '');
        sanitized = sanitized.replace(/<(iframe|embed|object)[^>]*\/>/gi, '');

        // Remove script tags (should never happen but just in case)
        sanitized = sanitized.replace(/<script[^>]*>.*?<\/script>/gis, '');
        sanitized = sanitized.replace(/<script[^>]*\/>/gi, '');

        // Remove style tags that could affect global styles
        // Keep inline styles but remove style blocks
        sanitized = sanitized.replace(/<style[^>]*>.*?<\/style>/gis, '');

        // Remove link tags that could load external stylesheets
        sanitized = sanitized.replace(/<link[^>]*rel\s*=\s*["']stylesheet["'][^>]*>/gi, '');

        // Remove event handlers
        sanitized = sanitized.replace(/\son\w+\s*=\s*["'][^"']*["']/gi, '');

        // Remove javascript: protocol in links
        sanitized = sanitized.replace(/href\s*=\s*["']javascript:/gi, 'href="#');

        return sanitized;
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
     * Show loading indicator for an add-on (inside chat, after message)
     * CRITICAL: Only attaches to AI messages, not user messages
     */
    showLoadingIndicator(messageId, addon) {
        try {
            // Always find the latest AI message element, not just any message
            const messageElement = this.findAIMessageElement();

            if (!messageElement) {
                console.warn(`[Sidecar AI] AI message element not found for loading indicator. Waiting...`);
                // Retry after a short delay in case the AI message is still rendering
                setTimeout(() => {
                    const retryElement = this.findAIMessageElement();
                    if (retryElement) {
                        this.attachLoadingToElement(retryElement, addon);
                    } else {
                        console.error(`[Sidecar AI] Failed to find AI message element after retry`);
                    }
                }, 500);
                return;
            }

            // Verify it's actually an AI message
            if (!this.isAIMessageElement(messageElement)) {
                console.warn(`[Sidecar AI] Found element is not an AI message, searching for latest AI message...`);
                const aiElement = this.findAIMessageElement();
                if (aiElement) {
                    this.attachLoadingToElement(aiElement, addon);
                }
                return;
            }

            this.attachLoadingToElement(messageElement, addon);
        } catch (error) {
            console.error(`[Sidecar AI] Error showing loading indicator:`, error);
        }
    }

    /**
     * Attach loading indicator to a specific message element
     */
    attachLoadingToElement(messageElement, addon) {
        // Get message ID from the element
        const elementId = messageElement.id || messageElement.getAttribute('data-message-id') || `msg_${Date.now()}`;

        // Get or create Sidecar container for this message - check for ANY existing container first
        let sidecarContainer = messageElement.querySelector('.sidecar-container');

        if (!sidecarContainer) {
            sidecarContainer = document.createElement('div');
            sidecarContainer.className = `sidecar-container sidecar-container-${elementId}`;

            // Insert after message content (inside the AI message container)
            const messageContent = messageElement.querySelector('.mes_text') ||
                messageElement.querySelector('.message') ||
                messageElement;
            if (messageContent.nextSibling) {
                messageContent.parentElement.insertBefore(sidecarContainer, messageContent.nextSibling);
            } else {
                messageElement.appendChild(sidecarContainer);
            }
        }

        // Check if loading indicator already exists for this addon - avoid duplicates
        let loadingDiv = sidecarContainer.querySelector(`.sidecar-loading-${addon.id}`);
        if (!loadingDiv) {
            loadingDiv = document.createElement('div');
            loadingDiv.className = `sidecar-loading sidecar-loading-${addon.id}`;
            loadingDiv.innerHTML = `
                <i class="fa-solid fa-spinner fa-spin"></i>
                <span>Processing ${addon.name}...</span>
            `;
            sidecarContainer.appendChild(loadingDiv);
        }

        console.log(`[Sidecar AI] Showing loading indicator for ${addon.name} on AI message`);
    }

    /**
     * Find the latest AI message element in the DOM
     * Performance: Uses caching to avoid repeated DOM queries
     */
    findAIMessageElement() {
        // Get current message count
        const messageElements = document.querySelectorAll('.mes, .message');
        const currentCount = messageElements.length;

        // Return cached element if message count unchanged and cache is recent (< 2 seconds)
        const now = Date.now();
        if (this.cachedAIMessageElement &&
            currentCount === this.lastMessageCount &&
            (now - this.cacheInvalidationTime) < 2000) {
            // Verify cached element is still in DOM
            if (document.contains(this.cachedAIMessageElement)) {
                return this.cachedAIMessageElement;
            }
        }

        // Update cache
        this.lastMessageCount = currentCount;
        this.cacheInvalidationTime = now;

        // Search backwards to find the latest AI message
        for (let i = messageElements.length - 1; i >= 0; i--) {
            const element = messageElements[i];
            if (this.isAIMessageElement(element)) {
                this.cachedAIMessageElement = element;
                return element;
            }
        }

        this.cachedAIMessageElement = null;
        return null;
    }

    /**
     * Invalidate the cached AI message element
     * Call this when a new message is added
     */
    invalidateCache() {
        this.cachedAIMessageElement = null;
        this.lastMessageCount = 0;
        this.cacheInvalidationTime = Date.now();
    }

    /**
     * Hide loading indicator for an add-on
     */
    hideLoadingIndicator(messageId, addon) {
        try {
            // Find loading indicator by addon ID (more reliable than messageId)
            const loadingDiv = document.querySelector(`.sidecar-loading-${addon.id}`);
            if (loadingDiv) {
                console.log(`[Sidecar AI] Removing loading indicator for ${addon.name}`);
                loadingDiv.remove();
            } else {
                // Fallback: try to find in the latest AI message
                const messageElement = this.findAIMessageElement();
                if (messageElement) {
                    const sidecarContainer = messageElement.querySelector(`.sidecar-container`);
                    if (sidecarContainer) {
                        const loadingDiv = sidecarContainer.querySelector(`.sidecar-loading-${addon.id}`);
                        if (loadingDiv) {
                            console.log(`[Sidecar AI] Removing loading indicator for ${addon.name} from AI message`);
                            loadingDiv.remove();
                        }
                    }
                }
            }
        } catch (error) {
            console.error(`[Sidecar AI] Error hiding loading indicator:`, error);
        }
    }

    /**
     * Show error indicator
     * CRITICAL: Only attaches to AI messages, not user messages
     */
    showErrorIndicator(messageId, addon, error) {
        try {
            // Always find the latest AI message element
            const messageElement = this.findAIMessageElement();
            if (!messageElement) {
                console.warn(`[Sidecar AI] AI message element not found for error indicator`);
                return;
            }

            // Verify it's actually an AI message
            if (!this.isAIMessageElement(messageElement)) {
                console.warn(`[Sidecar AI] Found element is not an AI message for error indicator`);
                return;
            }

            const elementId = messageElement.id || messageElement.getAttribute('data-message-id') || `msg_${Date.now()}`;

            // Get or create container - check for ANY existing container first
            let sidecarContainer = messageElement.querySelector('.sidecar-container');
            if (!sidecarContainer) {
                sidecarContainer = document.createElement('div');
                sidecarContainer.className = `sidecar-container sidecar-container-${elementId}`;

                const messageContent = messageElement.querySelector('.mes_text') || messageElement;
                if (messageContent.nextSibling) {
                    messageContent.parentElement.insertBefore(sidecarContainer, messageContent.nextSibling);
                } else {
                    messageElement.appendChild(sidecarContainer);
                }
            }

            // Check if error indicator already exists for this addon - remove old one
            const existingError = sidecarContainer.querySelector(`.sidecar-error-${addon.id}`);
            if (existingError) {
                existingError.remove();
            }

            const errorDiv = document.createElement('div');
            errorDiv.className = `sidecar-error sidecar-error-${addon.id}`;

            const errorMsg = document.createElement('div');
            // Escape error message to prevent HTML injection
            const safeErrorMsg = String(error.message || error)
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#039;');
            const safeAddonName = String(addon.name)
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#039;');
            errorMsg.innerHTML = `<i class="fa-solid fa-exclamation-triangle"></i> Error processing ${safeAddonName}: ${safeErrorMsg}`;
            errorDiv.appendChild(errorMsg);

            const retryBtn = document.createElement('button');
            retryBtn.className = 'menu_button';
            retryBtn.innerHTML = '<i class="fa-solid fa-redo"></i> Retry';

            retryBtn.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                // Call global retry handler
                if (window.addOnsExtension && window.addOnsExtension.retryAddon) {
                    // Remove error first
                    errorDiv.remove();
                    // Trigger retry
                    window.addOnsExtension.retryAddon(addon.id, elementId);
                }
            };

            errorDiv.appendChild(retryBtn);

            sidecarContainer.appendChild(errorDiv);
        } catch (err) {
            console.error(`[Sidecar AI] Error showing error indicator:`, err);
        }
    }

    /**
     * Inject result into dropdown UI (inside chat, after message)
     */
    injectIntoDropdown(addon, formattedResult, messageId = null, existingElement = null) {
        try {
            // Use provided messageId or get from latest message
            if (!messageId) {
                messageId = this.getMessageId(null);
            }

            // Use provided element or find it
            const messageElement = existingElement || this.findMessageElement(messageId);

            if (!messageElement) {
                console.warn(`[Sidecar AI] Message element not found for dropdown injection (ID: ${messageId})`);
                return false;
            }

            // Get or create Sidecar container for this message - check BOTH class patterns
            let sidecarContainer = messageElement.querySelector(`.sidecar-container-${messageId}`) ||
                messageElement.querySelector('.sidecar-container');

            if (!sidecarContainer) {
                sidecarContainer = document.createElement('div');
                sidecarContainer.className = `sidecar-container sidecar-container-${messageId}`;

                // Insert after message content
                const messageContent = messageElement.querySelector('.mes_text') ||
                    messageElement.querySelector('.message') ||
                    messageElement;
                if (messageContent.nextSibling) {
                    messageContent.parentElement.insertBefore(sidecarContainer, messageContent.nextSibling);
                } else {
                    messageElement.appendChild(sidecarContainer);
                }
            }

            // Check if addon section already exists - if so, just update it
            let addonSection = sidecarContainer.querySelector(`.addon_section-${addon.id}`);

            if (!addonSection) {
                addonSection = document.createElement('details');
                addonSection.className = `addon_result_section addon_section-${addon.id}`;
                addonSection.open = true;

                const summary = document.createElement('summary');
                summary.className = 'addon_result_summary';

                // Add title
                const titleSpan = document.createElement('span');
                titleSpan.textContent = addon.name;
                summary.appendChild(titleSpan);

                // Add actions container to summary
                const actionsDiv = document.createElement('div');
                actionsDiv.className = 'addon_result_actions';

                // Edit button
                const editBtn = document.createElement('button');
                editBtn.innerHTML = '<i class="fa-solid fa-edit"></i>';
                editBtn.className = 'menu_button';
                editBtn.title = 'Edit Result';

                editBtn.onclick = (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.toggleEditMode(addon, messageId);
                };

                // Copy button
                const copyBtn = document.createElement('button');
                copyBtn.innerHTML = '<i class="fa-solid fa-copy"></i>';
                copyBtn.className = 'menu_button';
                copyBtn.title = 'Copy Result';

                copyBtn.onclick = (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    // Get raw content (not HTML)
                    // We need to retrieve it from metadata or extract text
                    const content = document.getElementById(`addon-content-${addon.id}`).innerText;
                    navigator.clipboard.writeText(content).then(() => {
                        copyBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
                        setTimeout(() => copyBtn.innerHTML = '<i class="fa-solid fa-copy"></i>', 1000);
                    });
                };

                actionsDiv.appendChild(editBtn);
                actionsDiv.appendChild(copyBtn);
                summary.appendChild(actionsDiv);

                const content = document.createElement('div');
                content.className = 'addon_result_content';
                content.id = `addon-content-${addon.id}`;

                addonSection.appendChild(summary);
                addonSection.appendChild(content);
                sidecarContainer.appendChild(addonSection);
            }

            // Update content
            const content = addonSection.querySelector('.addon_result_content');
            if (content) {
                // Clear existing content and add new result
                content.innerHTML = '';

                // Append new result
                const resultDiv = document.createElement('div');
                resultDiv.className = 'addon_result_item';
                resultDiv.innerHTML = formattedResult;

                // Store raw content for editing
                resultDiv.setAttribute('data-raw-content', formattedResult); // Note: this stores formatted HTML, we might want raw markdown

                const timestamp = document.createElement('div');
                timestamp.className = 'addon_result_timestamp';
                timestamp.textContent = `Generated at ${new Date().toLocaleTimeString()}`;

                resultDiv.appendChild(timestamp);
                content.appendChild(resultDiv);

                // Auto-expand
                addonSection.open = true;
            }

            console.log(`[Sidecar AI] Injected result into dropdown for: ${addon.name}`);
            return true;
        } catch (error) {
            console.error(`[Sidecar AI] Error injecting into dropdown:`, error);
            return false;
        }
    }

    /**
     * Toggle edit mode for a result in dropdown
     */
    toggleEditMode(addon, messageId) {
        const messageElement = this.findMessageElement(messageId);
        if (!messageElement) return;

        const contentDiv = messageElement.querySelector(`#addon-content-${addon.id}`);
        if (!contentDiv) return;

        const resultItem = contentDiv.querySelector('.addon_result_item');
        if (!resultItem) return;

        // Retrieve content - try to get raw content if we stored it, or decode from metadata
        let currentContent = '';

        // Try getting from metadata first (most reliable source of truth)
        const message = this.findMessageObject(messageId);
        if (message && message.mes) {
            const pattern = new RegExp(`<!-- sidecar-storage:${addon.id}:(.+?) -->`);
            const match = message.mes.match(pattern);
            if (match && match[1]) {
                try {
                    currentContent = decodeURIComponent(escape(atob(match[1])));
                } catch (e) { console.warn('Decode failed', e); }
            }
        }

        // Fallback to text content if no metadata
        if (!currentContent) {
            currentContent = resultItem.innerText;
        }

        // Create edit interface
        const editContainer = document.createElement('div');
        editContainer.className = 'addon-edit-container';
        editContainer.style.display = 'flex';
        editContainer.style.flexDirection = 'column';
        editContainer.style.gap = '8px';

        const textarea = document.createElement('textarea');
        textarea.className = 'text_pole';
        textarea.value = currentContent;
        textarea.style.width = '100%';
        textarea.style.minHeight = '150px';
        textarea.style.resize = 'vertical';

        const controls = document.createElement('div');
        controls.style.display = 'flex';
        controls.style.gap = '10px';
        controls.style.justifyContent = 'flex-end';

        const saveBtn = document.createElement('button');
        saveBtn.className = 'menu_button';
        saveBtn.innerHTML = '<i class="fa-solid fa-save"></i> Save';

        const cancelBtn = document.createElement('button');
        cancelBtn.className = 'menu_button';
        cancelBtn.innerHTML = '<i class="fa-solid fa-times"></i> Cancel';

        controls.appendChild(cancelBtn);
        controls.appendChild(saveBtn);

        editContainer.appendChild(textarea);
        editContainer.appendChild(controls);

        // Swap content
        const originalDisplay = contentDiv.innerHTML;
        contentDiv.innerHTML = '';
        contentDiv.appendChild(editContainer);

        // Handlers
        cancelBtn.onclick = () => {
            contentDiv.innerHTML = originalDisplay;
        };

        saveBtn.onclick = () => {
            const newContent = textarea.value;

            // Show loading
            saveBtn.disabled = true;
            saveBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Saving...';

            // Update metadata
            if (message) {
                this.updateResultInMetadata(message, addon.id, newContent, addon);

                // Save chat
                if (this.context.saveChat) {
                    this.context.saveChat();
                } else if (this.context.saveSettingsDebounced) {
                    this.context.saveSettingsDebounced();
                }
            }

            // Update UI
            // Format the new content
            const formatted = this.formatResult(addon, newContent, message, true);

            // Re-render
            contentDiv.innerHTML = '';
            const newResultItem = document.createElement('div');
            newResultItem.className = 'addon_result_item';
            newResultItem.innerHTML = formatted;

            const timestamp = document.createElement('div');
            timestamp.className = 'addon_result_timestamp';
            timestamp.textContent = `Edited at ${new Date().toLocaleTimeString()}`;

            newResultItem.appendChild(timestamp);
            contentDiv.appendChild(newResultItem);
        };
    }

    /**
     * Find message object from chat log
     */
    findMessageObject(messageId) {
        if (!messageId) return null;

        const chatLog = this.context.chat || this.context.chatLog || this.context.currentChat || [];
        if (!Array.isArray(chatLog)) return null;

        // Try find by UID/ID/mesId with loose equality to handle string/number differences
        let message = chatLog.find(msg =>
            (msg.uid == messageId) ||
            (msg.id == messageId) ||
            (msg.mesId == messageId)
        );

        return message;
    }

    /**
     * Save result to message metadata (hidden comment) for history retrieval
     * This ensures state persistence regardless of display mode
     * Includes error recovery and verification
     */
    saveResultToMetadata(message, addon, result) {
        if (!message || !addon || !result) {
            console.warn('[Sidecar AI] Cannot save metadata: missing required parameters');
            return false;
        }

        try {
            // Encode result to Base64 to avoid HTML comment syntax conflicts
            // Use utf-8 safe encoding
            const encoded = btoa(unescape(encodeURIComponent(result)));

            // Verify encoding worked correctly
            try {
                const testDecode = decodeURIComponent(escape(atob(encoded)));
                if (testDecode !== result) {
                    console.warn('[Sidecar AI] Encoding verification failed, but continuing...');
                }
            } catch (verifyError) {
                console.error('[Sidecar AI] Encoding verification error:', verifyError);
                // Continue anyway - might still work
            }

            const storageTag = `<!-- sidecar-storage:${addon.id}:${encoded} -->`;

            // Ensure message.mes exists
            if (!message.mes) {
                message.mes = '';
            }

            // Append to message content if not already present (avoid duplicates)
            // We append to the 'mes' property which acts as the source of truth
            if (!message.mes.includes(`sidecar-storage:${addon.id}:`)) {
                message.mes += '\n' + storageTag;
                console.log(`[Sidecar AI] Saved result metadata for ${addon.name} (${result.length} chars)`);
                return true;
            } else {
                // Update existing storage tag
                const pattern = new RegExp(`<!-- sidecar-storage:${addon.id}:[^>]+ -->`, 'g');
                message.mes = message.mes.replace(pattern, storageTag);
                console.log(`[Sidecar AI] Updated result metadata for ${addon.name}`);
                return true;
            }
        } catch (error) {
            console.error(`[Sidecar AI] Error saving result metadata:`, error);
            console.error(`[Sidecar AI] Error details:`, {
                addonId: addon?.id,
                addonName: addon?.name,
                resultLength: result?.length,
                messageId: message?.uid || message?.id,
                errorMessage: error.message
            });

            // Try fallback: save to a simpler format
            try {
                if (message.mes) {
                    const fallbackTag = `<!-- sidecar-fallback:${addon.id}:${Date.now()} -->`;
                    message.mes += '\n' + fallbackTag;
                    console.warn(`[Sidecar AI] Saved fallback metadata tag for ${addon.name}`);
                }
            } catch (fallbackError) {
                console.error(`[Sidecar AI] Fallback save also failed:`, fallbackError);
            }

            return false;
        }
    }

    /**
     * Get all results for a specific add-on from chat history
     */
    getAllResultsForAddon(addonId) {
        const results = [];
        const chatLog = this.context.chat || this.context.chatLog || this.context.currentChat || [];

        if (!Array.isArray(chatLog)) {
            return results;
        }

        // Iterate through chat log to find saved results
        chatLog.forEach((msg, index) => {
            if (msg && msg.mes) {
                // Check for storage tag
                const pattern = new RegExp(`<!-- sidecar-storage:${addonId}:(.+?) -->`);
                const match = msg.mes.match(pattern);

                if (match && match[1]) {
                    try {
                        const decoded = decodeURIComponent(escape(atob(match[1])));

                        // Check if edited
                        const isEdited = msg.mes.includes(`<!-- sidecar-edited:${addonId} -->`);

                        if (decoded) {
                            results.push({
                                content: decoded,
                                timestamp: msg.send_date || Date.now(), // Fallback if send_date missing
                                messageId: this.getMessageId(msg),
                                messageIndex: index,
                                messagePreview: (msg.mes || '').substring(0, 50) + '...',
                                edited: isEdited,
                                addonId: addonId
                            });
                        }
                    } catch (e) {
                        console.warn(`[Sidecar AI] Failed to decode result for history:`, e);
                    }
                }
            }
        });

        // Sort by timestamp (newest first)
        return results.sort((a, b) => b.timestamp - a.timestamp);
    }

    /**
     * Delete result from metadata and content
     */
    deleteResultFromMetadata(message, addonId) {
        if (!message || !message.mes || !addonId) {
            return false;
        }

        let modified = false;

        // Remove storage tag
        const storagePattern = new RegExp(`\\n?<!-- sidecar-storage:${addonId}:.+? -->`, 'g');
        if (message.mes.match(storagePattern)) {
            message.mes = message.mes.replace(storagePattern, '');
            modified = true;
        }

        // Remove result comment (for chatHistory mode)
        const resultPattern = new RegExp(`<!-- addon-result:${addonId} -->[\\s\\S]*?<!-- /addon-result:${addonId} -->`, 'g');
        if (message.mes.match(resultPattern)) {
            message.mes = message.mes.replace(resultPattern, '');
            modified = true;
        }

        // Remove edited tag if present
        const editedPattern = new RegExp(`\\n?<!-- sidecar-edited:${addonId} -->`, 'g');
        if (message.mes.match(editedPattern)) {
            message.mes = message.mes.replace(editedPattern, '');
            modified = true;
        }

        // If we modified the message, we should also update the DOM if possible
        if (modified) {
            const messageId = this.getMessageId(message);

            // Remove from dropdown if present
            const messageElement = this.findMessageElement(messageId);
            if (messageElement) {
                const section = messageElement.querySelector(`.addon-section-${addonId}`);
                if (section) {
                    section.remove();
                }

                // For chatHistory, we might need to refresh the message content in DOM
                // But usually SillyTavern handles this when we save/reload chat
                // For immediate feedback, we can try to update the DOM content
                const contentArea = messageElement.querySelector('.mes_text') ||
                    messageElement.querySelector('.message') ||
                    messageElement;

                if (contentArea && contentArea.innerHTML) {
                    contentArea.innerHTML = contentArea.innerHTML.replace(resultPattern, '');
                }
            }
        }

        return modified;
    }

    /**
     * Update result in metadata and content
     */
    updateResultInMetadata(message, addonId, newContent, addon) {
        if (!message || !message.mes || !addonId || !newContent) {
            return false;
        }

        // 1. Update storage tag
        try {
            const encoded = btoa(unescape(encodeURIComponent(newContent)));
            const storageTag = `<!-- sidecar-storage:${addonId}:${encoded} -->`;
            const storagePattern = new RegExp(`<!-- sidecar-storage:${addonId}:.+? -->`);

            if (message.mes.match(storagePattern)) {
                message.mes = message.mes.replace(storagePattern, storageTag);
            } else {
                message.mes += '\n' + storageTag;
            }

            // Add edited tag
            const editedTag = `<!-- sidecar-edited:${addonId} -->`;
            if (!message.mes.includes(editedTag)) {
                message.mes += '\n' + editedTag;
            }
        } catch (e) {
            console.error('[Sidecar AI] Error encoding updated content:', e);
            return false;
        }

        // 2. Update visible result (if chatHistory mode)
        // If outsideChatlog, the DOM update is handled by the UI, but we ensure metadata matches
        if (addon && addon.responseLocation === 'chatHistory') {
            const formatted = this.formatResult(addon, newContent, message, false);
            const resultTagStart = `<!-- addon-result:${addonId} -->`;
            const resultTagEnd = `<!-- /addon-result:${addonId} -->`;
            const resultPattern = new RegExp(`${resultTagStart}[\\s\\S]*?${resultTagEnd}`);

            const newResultBlock = `${resultTagStart}${formatted}${resultTagEnd}`;

            if (message.mes.match(resultPattern)) {
                message.mes = message.mes.replace(resultPattern, newResultBlock);
            } else {
                message.mes += newResultBlock;
            }
        }

        return true;
    }

    /**
     * Find message element by ID or other identifier
     * Specifically finds AI messages (not user messages)
     */
    findMessageElement(messageId) {
        // Try direct ID lookup
        let element = document.getElementById(messageId);
        if (element) {
            // Verify it's an AI message
            if (this.isAIMessageElement(element)) {
                return element;
            }
        }

        // Try data attribute
        element = document.querySelector(`[data-message-id="${messageId}"]`);
        if (element && this.isAIMessageElement(element)) {
            return element;
        }

        // Try finding by message index in chat
        if (this.context.chat && Array.isArray(this.context.chat)) {
            const messageIndex = this.context.chat.findIndex(msg =>
                (msg.uid === messageId || msg.id === messageId) && !msg.is_user
            );

            if (messageIndex !== -1) {
                // Try to find corresponding DOM element - specifically AI messages
                const messageElements = document.querySelectorAll('.mes, .message');
                for (let i = messageElements.length - 1; i >= 0; i--) {
                    if (this.isAIMessageElement(messageElements[i])) {
                        return messageElements[i];
                    }
                }
            }
        }

        // Fallback: get last AI message element (not user message)
        const messageElements = document.querySelectorAll('.mes, .message');
        for (let i = messageElements.length - 1; i >= 0; i--) {
            if (this.isAIMessageElement(messageElements[i])) {
                return messageElements[i];
            }
        }

        return null;
    }

    /**
     * Check if a DOM element is an AI message (not user message)
     */
    isAIMessageElement(element) {
        if (!element) return false;

        // Check for AI message classes (vanilla JS)
        if (element.classList.contains('assistant') ||
            element.classList.contains('mes_assistant') ||
            element.querySelector('.mes_assistant')) {
            return true;
        }

        // Check if it's NOT a user message
        if (element.classList.contains('user') ||
            element.classList.contains('mes_user') ||
            element.querySelector('.mes_user')) {
            return false;
        }

        // Check data attributes
        const isUser = element.getAttribute('data-is-user');
        if (isUser === 'true') {
            return false;
        }
        if (isUser === 'false') {
            return true;
        }

        // Check for role attribute
        const role = element.getAttribute('data-role');
        if (role === 'user' || role === 'assistant') {
            return role === 'assistant';
        }

        // Default: if we can't determine, assume it's AI (better to attach than miss)
        // But prefer elements that don't have user indicators
        return true;
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

    /**
     * Restore all blocks from saved metadata when chat loads
     * Scans chat log and restores UI blocks for all saved results
     */
    async restoreBlocksFromMetadata(addonManager) {
        try {
            console.log('[Sidecar AI] Restoring blocks from metadata...');

            const chatLog = this.context.chat || this.context.chatLog || this.context.currentChat || [];
            if (!Array.isArray(chatLog) || chatLog.length === 0) {
                console.log('[Sidecar AI] No chat log found, skipping restoration');
                return 0;
            }

            const allAddons = addonManager.getAllAddons();
            let restoredCount = 0;

            // Wait a bit for DOM to be ready
            await new Promise(resolve => setTimeout(resolve, 300));

            // Iterate through all messages in chat log (only AI messages)
            for (let i = 0; i < chatLog.length; i++) {
                const message = chatLog[i];
                if (!message || !message.mes || message.is_user) {
                    continue; // Skip user messages and empty messages
                }

                const messageId = this.getMessageId(message);

                // Check each add-on for saved results in this message
                for (const addon of allAddons) {
                    if (!addon.enabled) {
                        continue; // Skip disabled add-ons
                    }

                    // Look for storage tag for this add-on
                    const pattern = new RegExp(`<!-- sidecar-storage:${addon.id}:(.+?) -->`);
                    const match = message.mes.match(pattern);

                    if (match && match[1]) {
                        try {
                            // Decode the stored result
                            const decoded = decodeURIComponent(escape(atob(match[1])));

                            if (decoded && decoded.length > 0 && decoded.length < 100000) {
                                // Restore the block based on response location
                                if (addon.responseLocation === 'chatHistory') {
                                    // For chatHistory, check if result is already in the message content
                                    // The result might be embedded directly or as a comment
                                    const messageElement = this.findMessageElement(messageId) || this.findMessageElementByIndex(i);
                                    if (messageElement) {
                                        const contentArea = messageElement.querySelector('.mes_text') ||
                                            messageElement.querySelector('.message') ||
                                            messageElement;

                                        if (contentArea) {
                                            // Check if result is already displayed
                                            const resultTag = `<!-- addon-result:${addon.id} -->`;
                                            const hasResult = contentArea.innerHTML &&
                                                (contentArea.innerHTML.includes(resultTag) ||
                                                    contentArea.innerHTML.includes(decoded.substring(0, 50)));

                                            if (!hasResult) {
                                                // Restore the formatted result
                                                const formatted = this.formatResult(addon, decoded, message, false);
                                                this.injectIntoChatHistory(messageId, addon, formatted);
                                                restoredCount++;
                                                console.log(`[Sidecar AI] Restored chatHistory block for ${addon.name} in message ${messageId}`);
                                            }
                                        }
                                    }
                                } else {
                                    // For outsideChatlog, restore dropdown UI
                                    const messageElement = this.findMessageElement(messageId) || this.findMessageElementByIndex(i);
                                    if (messageElement) {
                                        // Check if block already exists
                                        const existingBlock = messageElement.querySelector(`.addon-section-${addon.id}`);
                                        if (!existingBlock) {
                                            // Restore the dropdown block
                                            const formatted = this.formatResult(addon, decoded, message, true);
                                            // Pass the found messageElement to avoid re-lookup failure
                                            const success = this.injectIntoDropdown(addon, formatted, messageId, messageElement);
                                            if (success) {
                                                restoredCount++;
                                                console.log(`[Sidecar AI] Restored dropdown block for ${addon.name} in message ${messageId}`);
                                            }
                                        }
                                    }
                                }
                            }
                        } catch (error) {
                            console.warn(`[Sidecar AI] Failed to restore block for ${addon.name} in message ${messageId}:`, error);
                        }
                    }
                }
            }

            console.log(`[Sidecar AI] Restored ${restoredCount} block(s) from metadata`);
            return restoredCount;
        } catch (error) {
            console.error('[Sidecar AI] Error restoring blocks from metadata:', error);
            return 0;
        }
    }

    /**
     * Find message element by index in chat log
     * Matches AI messages in DOM to AI messages in chat log by position
     */
    findMessageElementByIndex(chatLogIndex) {
        const chatLog = this.context.chat || this.context.chatLog || this.context.currentChat || [];
        if (chatLogIndex < 0 || chatLogIndex >= chatLog.length) {
            return null;
        }

        // Count AI messages up to this index
        let aiMessageCount = 0;
        for (let i = 0; i <= chatLogIndex; i++) {
            const msg = chatLog[i];
            if (msg && !msg.is_user && msg.mes) {
                if (i === chatLogIndex) {
                    // This is the message we're looking for
                    // Now find the corresponding DOM element
                    const messageElements = document.querySelectorAll('.mes, .message');
                    let currentAiIndex = 0;
                    for (let j = 0; j < messageElements.length; j++) {
                        if (this.isAIMessageElement(messageElements[j])) {
                            if (currentAiIndex === aiMessageCount) {
                                return messageElements[j];
                            }
                            currentAiIndex++;
                        }
                    }
                    break;
                }
                aiMessageCount++;
            }
        }

        return null;
    }
}
