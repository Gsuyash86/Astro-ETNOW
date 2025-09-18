// popup-manager.js - Place this in your head or as external script
(function() {
    'use strict';
    
    // Global Popup Manager
    window.PopupManager = {
      instances: new Map(),
      
      // Initialize a popup instance
      init: function(instanceId, options = {}) {
        // Prevent double initialization
        if (this.instances.has(instanceId)) {
          console.warn(`Popup instance "${instanceId}" already initialized`);
          return this.instances.get(instanceId);
        }
        
        const popup = document.querySelector(`[data-instance="${instanceId}"]`);
        if (!popup) {
          console.error(`Popup with instance ID "${instanceId}" not found`);
          return null;
        }
        
        const closeBtn = document.getElementById(`popupClose_${instanceId}`);
        const popupContent = document.getElementById(`popupContent_${instanceId}`);
        
        // Save original position for restoration
        const originalParent = popup.parentNode;
        const nextSibling = popup.nextSibling;
        
        // Escape key handler (unique per instance)
        const handleEscape = (event) => {
          if (event.key === "Escape" && popup.getAttribute("data-open") === "true") {
            this.close(instanceId);
          }
        };
        
        // Click outside handler
        const handleClickOutside = (event) => {
          if (
            popup.getAttribute("data-open") === "true" &&
            popupContent &&
            !popupContent.contains(event.target)
          ) {
            this.close(instanceId);
          }
        };
        
        // Set popup open/close state
        const setOpen = (open) => {
          popup.setAttribute("data-open", open ? "true" : "false");
          popup.setAttribute("aria-hidden", open ? "false" : "true");
          popup.style.display = open ? "block" : "none";
          
          if (open) {
            // Move to body for proper z-index
            document.body.appendChild(popup);
            document.body.style.overflow = "hidden";
            document.addEventListener("keydown", handleEscape);
            
            // Emit custom event
            popup.dispatchEvent(new CustomEvent('popup:opened', { 
              detail: { instanceId } 
            }));
          } else {
            // Restore original position
            if (nextSibling) {
              originalParent.insertBefore(popup, nextSibling);
            } else {
              originalParent.appendChild(popup);
            }
            document.body.style.overflow = "auto";
            document.removeEventListener("keydown", handleEscape);
            
            // Emit custom event
            popup.dispatchEvent(new CustomEvent('popup:closed', { 
              detail: { instanceId } 
            }));
          }
        };
        
        // Close button event listener
        if (closeBtn) {
          closeBtn.addEventListener("click", () => this.close(instanceId));
        }
        
        // Click outside to close
        popup.addEventListener("click", handleClickOutside);
        
        // Create instance object
        const instance = {
          id: instanceId,
          element: popup,
          content: popupContent,
          closeButton: closeBtn,
          setOpen: setOpen,
          isOpen: () => popup.getAttribute("data-open") === "true",
          
          // Cleanup method
          destroy: () => {
            document.removeEventListener("keydown", handleEscape);
            popup.removeEventListener("click", handleClickOutside);
            if (closeBtn) {
              closeBtn.removeEventListener("click", () => this.close(instanceId));
            }
            this.instances.delete(instanceId);
            
            // Remove global methods
            delete window[`openPopup_${instanceId}`];
            delete window[`closePopup_${instanceId}`];
          }
        };
        
        // Store instance
        this.instances.set(instanceId, instance);
        
        // Create global convenience methods
        window[`openPopup_${instanceId}`] = () => this.open(instanceId);
        window[`closePopup_${instanceId}`] = () => this.close(instanceId);
        
        // Mark as initialized
        popup.setAttribute("data-initialized", "true");
        
        // Initialize as closed
        setOpen(false);
        
        return instance;
      },
      
      // Open popup by instance ID
      open: function(instanceId) {
        const instance = this.instances.get(instanceId);
        if (instance) {
          instance.setOpen(true);
          return true;
        }
        console.warn(`Popup instance "${instanceId}" not found`);
        return false;
      },
      
      // Close popup by instance ID
      close: function(instanceId) {
        const instance = this.instances.get(instanceId);
        if (instance) {
          instance.setOpen(false);
          return true;
        }
        console.warn(`Popup instance "${instanceId}" not found`);
        return false;
      },
      
      // Close all popups
      closeAll: function() {
        this.instances.forEach((instance, instanceId) => {
          this.close(instanceId);
        });
      },
      
      // Get instance by ID
      getInstance: function(instanceId) {
        return this.instances.get(instanceId);
      },
      
      // Check if instance exists and is initialized
      exists: function(instanceId) {
        return this.instances.has(instanceId);
      },
      
      // Destroy instance (cleanup)
      destroy: function(instanceId) {
        const instance = this.instances.get(instanceId);
        if (instance) {
          instance.destroy();
          return true;
        }
        return false;
      },
      
      // Destroy all instances
      destroyAll: function() {
        this.instances.forEach((instance) => {
          instance.destroy();
        });
      }
    };
    
    // Auto-initialize on DOM ready if needed
    document.addEventListener('DOMContentLoaded', function() {
      // You can optionally auto-initialize all popups found on page
      // const popups = document.querySelectorAll('[data-instance]:not([data-initialized="true"])');
      // popups.forEach(popup => {
      //   const instanceId = popup.getAttribute('data-instance');
      //   if (instanceId) {
      //     window.PopupManager.init(instanceId);
      //   }
      // });
    });
    
    // Cleanup on page unload
    window.addEventListener('beforeunload', function() {
      window.PopupManager.destroyAll();
    });
    
  })();