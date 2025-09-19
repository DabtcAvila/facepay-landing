/**
 * COMPREHENSIVE COMPONENT LIBRARY
 * Tailwind UI Style Interactive Components
 * 
 * Features:
 * - Modal System
 * - Toast Notifications
 * - Tooltip System
 * - Form Validation
 * - Navigation Components
 * - Loading States
 * - Keyboard Navigation
 * - Accessibility Support
 * - RTL Support
 * - Animation System
 */

class ComponentLibrary {
  constructor() {
    this.toasts = new Map();
    this.modals = new Map();
    this.tooltips = new Map();
    this.dropdowns = new Map();
    this.tabs = new Map();
    this.forms = new Map();
    this.init();
  }

  init() {
    this.initializeToastContainer();
    this.bindEventListeners();
    this.initializeComponents();
    this.setupKeyboardNavigation();
    this.setupAccessibility();
    console.log('🚀 Component Library initialized successfully');
  }

  // ==========================================================================
  // MODAL SYSTEM
  // ==========================================================================

  createModal(options = {}) {
    const {
      id = 'modal-' + Date.now(),
      title = 'Modal',
      content = '',
      size = 'md',
      closable = true,
      backdrop = true,
      animation = true,
      onOpen = null,
      onClose = null,
      onConfirm = null,
      onCancel = null,
      buttons = null
    } = options;

    // Create modal HTML
    const modalHTML = `
      <div class="modal-overlay ${animation ? 'animate' : ''}" id="${id}" role="dialog" aria-modal="true" aria-labelledby="${id}-title">
        <div class="modal modal-${size}" role="document">
          <div class="modal-header">
            <h2 class="modal-title" id="${id}-title">${title}</h2>
            ${closable ? '<button class="modal-close" type="button" aria-label="Close modal">&times;</button>' : ''}
          </div>
          <div class="modal-body">
            ${content}
          </div>
          ${buttons ? `<div class="modal-footer">${buttons}</div>` : ''}
        </div>
      </div>
    `;

    // Insert modal into DOM
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    const modalElement = document.getElementById(id);

    // Store modal instance
    const modal = {
      id,
      element: modalElement,
      options,
      isOpen: false,
      
      open() {
        this.isOpen = true;
        document.body.style.overflow = 'hidden';
        this.element.classList.add('active');
        this.element.setAttribute('aria-hidden', 'false');
        
        // Focus management
        const firstFocusable = this.element.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (firstFocusable) firstFocusable.focus();
        
        if (onOpen) onOpen(this);
        this.element.dispatchEvent(new CustomEvent('modal:open', { detail: this }));
      },
      
      close() {
        if (!this.isOpen) return;
        this.isOpen = false;
        document.body.style.overflow = '';
        this.element.classList.remove('active');
        this.element.setAttribute('aria-hidden', 'true');
        
        setTimeout(() => {
          if (this.element.parentNode) {
            this.element.remove();
          }
        }, animation ? 300 : 0);
        
        if (onClose) onClose(this);
        this.element.dispatchEvent(new CustomEvent('modal:close', { detail: this }));
      },
      
      confirm() {
        if (onConfirm) onConfirm(this);
        this.element.dispatchEvent(new CustomEvent('modal:confirm', { detail: this }));
      },
      
      cancel() {
        if (onCancel) onCancel(this);
        this.element.dispatchEvent(new CustomEvent('modal:cancel', { detail: this }));
        this.close();
      }
    };

    // Bind events
    if (closable) {
      modalElement.querySelector('.modal-close')?.addEventListener('click', () => modal.close());
    }
    
    if (backdrop) {
      modalElement.addEventListener('click', (e) => {
        if (e.target === modalElement) modal.close();
      });
    }

    // Keyboard events
    modalElement.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && closable) modal.close();
      this.handleModalTabbing(e, modalElement);
    });

    this.modals.set(id, modal);
    return modal;
  }

  handleModalTabbing(e, modal) {
    if (e.key !== 'Tab') return;
    
    const focusableElements = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        lastElement.focus();
        e.preventDefault();
      }
    } else {
      if (document.activeElement === lastElement) {
        firstElement.focus();
        e.preventDefault();
      }
    }
  }

  // ==========================================================================
  // TOAST NOTIFICATION SYSTEM
  // ==========================================================================

  initializeToastContainer() {
    if (!document.querySelector('.toast-container')) {
      document.body.insertAdjacentHTML('beforeend', '<div class="toast-container" role="region" aria-label="Notifications"></div>');
    }
  }

  showToast(options = {}) {
    const {
      id = 'toast-' + Date.now(),
      title = '',
      message = '',
      type = 'info',
      duration = 5000,
      closable = true,
      persistent = false,
      position = 'top-right',
      animation = true,
      onShow = null,
      onHide = null,
      onClick = null
    } = options;

    const icons = {
      success: '✅',
      error: '❌',
      warning: '⚠️',
      info: 'ℹ️'
    };

    const toastHTML = `
      <div class="toast toast-${type} ${animation ? 'animate' : ''}" id="${id}" role="alert" aria-live="polite">
        <div class="toast-icon">${icons[type] || icons.info}</div>
        <div class="toast-content">
          ${title ? `<div class="toast-title">${title}</div>` : ''}
          <div class="toast-description">${message}</div>
        </div>
        ${closable ? '<button class="toast-close" type="button" aria-label="Close notification">&times;</button>' : ''}
      </div>
    `;

    const container = document.querySelector('.toast-container');
    container.insertAdjacentHTML('beforeend', toastHTML);
    
    const toastElement = document.getElementById(id);
    
    // Show animation
    requestAnimationFrame(() => {
      toastElement.classList.add('show');
    });

    const toast = {
      id,
      element: toastElement,
      options,
      
      hide() {
        this.element.classList.remove('show');
        setTimeout(() => {
          if (this.element.parentNode) {
            this.element.remove();
          }
        }, animation ? 300 : 0);
        
        if (onHide) onHide(this);
        this.element.dispatchEvent(new CustomEvent('toast:hide', { detail: this }));
      }
    };

    // Bind events
    if (closable) {
      toastElement.querySelector('.toast-close')?.addEventListener('click', () => toast.hide());
    }
    
    if (onClick) {
      toastElement.addEventListener('click', (e) => onClick(e, toast));
    }

    // Auto hide
    if (!persistent && duration > 0) {
      setTimeout(() => toast.hide(), duration);
    }

    if (onShow) onShow(toast);
    toastElement.dispatchEvent(new CustomEvent('toast:show', { detail: toast }));

    this.toasts.set(id, toast);
    return toast;
  }

  // ==========================================================================
  // TOOLTIP SYSTEM
  // ==========================================================================

  initializeTooltips() {
    document.querySelectorAll('[data-tooltip]').forEach(element => {
      this.createTooltip(element);
    });
  }

  createTooltip(trigger, options = {}) {
    const content = options.content || trigger.getAttribute('data-tooltip');
    const position = options.position || trigger.getAttribute('data-tooltip-position') || 'top';
    const delay = parseInt(options.delay || trigger.getAttribute('data-tooltip-delay') || '500');
    
    if (!content) return;

    const tooltipId = 'tooltip-' + Date.now();
    const tooltipHTML = `<div class="tooltip tooltip-${position}" id="${tooltipId}" role="tooltip">${content}</div>`;
    
    trigger.style.position = 'relative';
    trigger.insertAdjacentHTML('beforeend', tooltipHTML);
    
    const tooltip = trigger.querySelector(`#${tooltipId}`);
    let showTimeout, hideTimeout;

    const show = () => {
      clearTimeout(hideTimeout);
      showTimeout = setTimeout(() => {
        tooltip.style.opacity = '1';
        tooltip.style.visibility = 'visible';
        trigger.setAttribute('aria-describedby', tooltipId);
      }, delay);
    };

    const hide = () => {
      clearTimeout(showTimeout);
      hideTimeout = setTimeout(() => {
        tooltip.style.opacity = '0';
        tooltip.style.visibility = 'hidden';
        trigger.removeAttribute('aria-describedby');
      }, 100);
    };

    // Event listeners
    trigger.addEventListener('mouseenter', show);
    trigger.addEventListener('mouseleave', hide);
    trigger.addEventListener('focus', show);
    trigger.addEventListener('blur', hide);

    // Touch support
    trigger.addEventListener('touchstart', show);
    document.addEventListener('touchstart', (e) => {
      if (!trigger.contains(e.target)) hide();
    });

    this.tooltips.set(tooltipId, { trigger, tooltip, show, hide });
  }

  // ==========================================================================
  // FORM VALIDATION
  // ==========================================================================

  initializeFormValidation() {
    document.querySelectorAll('form[data-validate]').forEach(form => {
      this.createFormValidator(form);
    });
  }

  createFormValidator(form) {
    const validator = {
      form,
      fields: new Map(),
      
      validate(field) {
        const rules = this.getValidationRules(field);
        const errors = [];
        
        for (const rule of rules) {
          const isValid = this.validateRule(field.value, rule);
          if (!isValid) {
            errors.push(rule.message);
            break; // Stop at first error
          }
        }
        
        this.displayFieldErrors(field, errors);
        return errors.length === 0;
      },
      
      validateAll() {
        let isValid = true;
        const formData = new FormData(this.form);
        
        this.form.querySelectorAll('[data-rules]').forEach(field => {
          if (!this.validate(field)) {
            isValid = false;
          }
        });
        
        return isValid;
      },
      
      getValidationRules(field) {
        const rulesString = field.getAttribute('data-rules');
        if (!rulesString) return [];
        
        return rulesString.split('|').map(rule => {
          const [name, ...params] = rule.split(':');
          return { name, params: params.join(':'), message: this.getErrorMessage(field, name) };
        });
      },
      
      validateRule(value, rule) {
        switch (rule.name) {
          case 'required':
            return value.trim().length > 0;
          case 'email':
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
          case 'min':
            return value.length >= parseInt(rule.params);
          case 'max':
            return value.length <= parseInt(rule.params);
          case 'pattern':
            return new RegExp(rule.params).test(value);
          case 'confirmed':
            const confirmField = this.form.querySelector(`[name="${rule.params}"]`);
            return confirmField ? value === confirmField.value : false;
          default:
            return true;
        }
      },
      
      getErrorMessage(field, ruleName) {
        const fieldName = field.getAttribute('data-name') || field.name || 'Field';
        const customMessage = field.getAttribute(`data-${ruleName}-message`);
        
        if (customMessage) return customMessage;
        
        const messages = {
          required: `${fieldName} is required`,
          email: `${fieldName} must be a valid email`,
          min: `${fieldName} must be at least ${field.getAttribute('data-min')} characters`,
          max: `${fieldName} must be less than ${field.getAttribute('data-max')} characters`,
          pattern: `${fieldName} format is invalid`,
          confirmed: `${fieldName} confirmation does not match`
        };
        
        return messages[ruleName] || `${fieldName} is invalid`;
      },
      
      displayFieldErrors(field, errors) {
        // Remove existing error
        const existingError = field.parentNode.querySelector('.form-error-text');
        if (existingError) existingError.remove();
        
        field.classList.remove('form-error', 'form-success');
        
        if (errors.length > 0) {
          field.classList.add('form-error');
          const errorElement = document.createElement('div');
          errorElement.className = 'form-error-text';
          errorElement.textContent = errors[0];
          field.parentNode.appendChild(errorElement);
        } else if (field.value.trim()) {
          field.classList.add('form-success');
        }
      }
    };

    // Bind events
    form.addEventListener('submit', (e) => {
      if (!validator.validateAll()) {
        e.preventDefault();
        e.stopPropagation();
      }
    });

    // Real-time validation
    form.querySelectorAll('[data-rules]').forEach(field => {
      field.addEventListener('blur', () => validator.validate(field));
      field.addEventListener('input', () => {
        // Clear errors on input
        if (field.classList.contains('form-error')) {
          field.classList.remove('form-error');
          const errorElement = field.parentNode.querySelector('.form-error-text');
          if (errorElement) errorElement.remove();
        }
      });
    });

    this.forms.set(form, validator);
    return validator;
  }

  // ==========================================================================
  // NAVIGATION COMPONENTS
  // ==========================================================================

  initializeTabs() {
    document.querySelectorAll('[data-tabs]').forEach(tabContainer => {
      this.createTabs(tabContainer);
    });
  }

  createTabs(container) {
    const triggers = container.querySelectorAll('[data-tab-trigger]');
    const contents = container.querySelectorAll('[data-tab-content]');
    
    const tabs = {
      container,
      triggers: Array.from(triggers),
      contents: Array.from(contents),
      activeIndex: 0,
      
      setActive(index) {
        // Update triggers
        this.triggers.forEach((trigger, i) => {
          trigger.setAttribute('aria-selected', i === index ? 'true' : 'false');
          trigger.classList.toggle('active', i === index);
        });
        
        // Update contents
        this.contents.forEach((content, i) => {
          content.setAttribute('aria-hidden', i === index ? 'false' : 'true');
          content.style.display = i === index ? 'block' : 'none';
        });
        
        this.activeIndex = index;
        this.container.dispatchEvent(new CustomEvent('tab:change', { 
          detail: { index, trigger: this.triggers[index], content: this.contents[index] }
        }));
      },
      
      next() {
        const nextIndex = (this.activeIndex + 1) % this.triggers.length;
        this.setActive(nextIndex);
      },
      
      previous() {
        const prevIndex = (this.activeIndex - 1 + this.triggers.length) % this.triggers.length;
        this.setActive(prevIndex);
      }
    };

    // Initialize first tab
    tabs.setActive(0);

    // Bind events
    triggers.forEach((trigger, index) => {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        tabs.setActive(index);
      });
      
      trigger.addEventListener('keydown', (e) => {
        switch (e.key) {
          case 'ArrowRight':
            e.preventDefault();
            tabs.next();
            tabs.triggers[tabs.activeIndex].focus();
            break;
          case 'ArrowLeft':
            e.preventDefault();
            tabs.previous();
            tabs.triggers[tabs.activeIndex].focus();
            break;
          case 'Home':
            e.preventDefault();
            tabs.setActive(0);
            tabs.triggers[0].focus();
            break;
          case 'End':
            e.preventDefault();
            tabs.setActive(tabs.triggers.length - 1);
            tabs.triggers[tabs.triggers.length - 1].focus();
            break;
        }
      });
    });

    this.tabs.set(container, tabs);
    return tabs;
  }

  // ==========================================================================
  // DROPDOWN SYSTEM
  // ==========================================================================

  initializeDropdowns() {
    document.querySelectorAll('[data-dropdown]').forEach(dropdown => {
      this.createDropdown(dropdown);
    });
  }

  createDropdown(trigger) {
    const targetId = trigger.getAttribute('data-dropdown');
    const content = document.querySelector(`#${targetId}`);
    
    if (!content) return;

    const dropdown = {
      trigger,
      content,
      isOpen: false,
      
      open() {
        this.isOpen = true;
        this.content.style.display = 'block';
        this.content.classList.add('show');
        this.trigger.setAttribute('aria-expanded', 'true');
        this.content.setAttribute('aria-hidden', 'false');
        
        // Focus first item
        const firstItem = this.content.querySelector('[role="menuitem"], a, button');
        if (firstItem) firstItem.focus();
        
        this.trigger.dispatchEvent(new CustomEvent('dropdown:open'));
      },
      
      close() {
        if (!this.isOpen) return;
        this.isOpen = false;
        this.content.classList.remove('show');
        this.trigger.setAttribute('aria-expanded', 'false');
        this.content.setAttribute('aria-hidden', 'true');
        
        setTimeout(() => {
          this.content.style.display = 'none';
        }, 150);
        
        this.trigger.focus();
        this.trigger.dispatchEvent(new CustomEvent('dropdown:close'));
      },
      
      toggle() {
        this.isOpen ? this.close() : this.open();
      }
    };

    // Setup ARIA
    trigger.setAttribute('aria-haspopup', 'true');
    trigger.setAttribute('aria-expanded', 'false');
    content.setAttribute('role', 'menu');
    content.setAttribute('aria-hidden', 'true');
    content.style.display = 'none';

    // Bind events
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      dropdown.toggle();
    });

    trigger.addEventListener('keydown', (e) => {
      switch (e.key) {
        case 'Enter':
        case ' ':
        case 'ArrowDown':
          e.preventDefault();
          dropdown.open();
          break;
        case 'Escape':
          dropdown.close();
          break;
      }
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!trigger.contains(e.target) && !content.contains(e.target)) {
        dropdown.close();
      }
    });

    // Keyboard navigation in dropdown
    content.addEventListener('keydown', (e) => {
      const items = content.querySelectorAll('[role="menuitem"], a, button');
      const currentIndex = Array.from(items).indexOf(document.activeElement);
      
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          const nextIndex = (currentIndex + 1) % items.length;
          items[nextIndex]?.focus();
          break;
        case 'ArrowUp':
          e.preventDefault();
          const prevIndex = (currentIndex - 1 + items.length) % items.length;
          items[prevIndex]?.focus();
          break;
        case 'Home':
          e.preventDefault();
          items[0]?.focus();
          break;
        case 'End':
          e.preventDefault();
          items[items.length - 1]?.focus();
          break;
        case 'Escape':
          e.preventDefault();
          dropdown.close();
          break;
      }
    });

    this.dropdowns.set(trigger, dropdown);
    return dropdown;
  }

  // ==========================================================================
  // LOADING STATES
  // ==========================================================================

  showLoading(element, options = {}) {
    const { text = 'Loading...', spinner = true } = options;
    
    element.classList.add('loading');
    element.setAttribute('aria-busy', 'true');
    
    if (element.tagName === 'BUTTON') {
      element.disabled = true;
      element.classList.add('btn-loading');
    } else {
      const loadingOverlay = document.createElement('div');
      loadingOverlay.className = 'loading-overlay';
      loadingOverlay.innerHTML = `
        <div class="loading-content">
          ${spinner ? '<div class="spinner"></div>' : ''}
          ${text ? `<div class="loading-text">${text}</div>` : ''}
        </div>
      `;
      element.appendChild(loadingOverlay);
    }
  }

  hideLoading(element) {
    element.classList.remove('loading');
    element.removeAttribute('aria-busy');
    
    if (element.tagName === 'BUTTON') {
      element.disabled = false;
      element.classList.remove('btn-loading');
    } else {
      const overlay = element.querySelector('.loading-overlay');
      if (overlay) overlay.remove();
    }
  }

  // ==========================================================================
  // ACCESSIBILITY HELPERS
  // ==========================================================================

  setupAccessibility() {
    // Skip links
    this.createSkipLinks();
    
    // Focus management
    this.setupFocusManagement();
    
    // ARIA live regions
    this.createLiveRegions();
  }

  createSkipLinks() {
    if (document.querySelector('.skip-links')) return;
    
    const skipLinks = `
      <div class="skip-links">
        <a href="#main-content" class="skip-link">Skip to main content</a>
        <a href="#navigation" class="skip-link">Skip to navigation</a>
      </div>
    `;
    document.body.insertAdjacentHTML('afterbegin', skipLinks);
  }

  setupFocusManagement() {
    // Focus visible class for keyboard users
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        document.body.classList.add('using-keyboard');
      }
    });

    document.addEventListener('mousedown', () => {
      document.body.classList.remove('using-keyboard');
    });
  }

  createLiveRegions() {
    if (!document.querySelector('#announcements')) {
      document.body.insertAdjacentHTML('beforeend', 
        '<div id="announcements" aria-live="polite" aria-atomic="true" class="sr-only"></div>'
      );
    }
  }

  announce(message) {
    const announcements = document.querySelector('#announcements');
    if (announcements) {
      announcements.textContent = message;
    }
  }

  // ==========================================================================
  // KEYBOARD NAVIGATION
  // ==========================================================================

  setupKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
      // Global keyboard shortcuts
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'm':
            e.preventDefault();
            this.toggleMainMenu();
            break;
          case '/':
            e.preventDefault();
            this.focusSearch();
            break;
        }
      }
      
      // Escape key handling
      if (e.key === 'Escape') {
        this.handleEscape();
      }
    });
  }

  handleEscape() {
    // Close open modals
    const openModal = document.querySelector('.modal-overlay.active');
    if (openModal) {
      const modalId = openModal.id;
      const modal = this.modals.get(modalId);
      if (modal) modal.close();
      return;
    }
    
    // Close open dropdowns
    this.dropdowns.forEach(dropdown => {
      if (dropdown.isOpen) dropdown.close();
    });
    
    // Clear focus from active element
    if (document.activeElement !== document.body) {
      document.activeElement.blur();
    }
  }

  // ==========================================================================
  // COMPONENT INITIALIZATION
  // ==========================================================================

  initializeComponents() {
    this.initializeTooltips();
    this.initializeFormValidation();
    this.initializeTabs();
    this.initializeDropdowns();
    this.initializeButtonLoading();
    this.initializeToggleSwitches();
  }

  initializeButtonLoading() {
    document.querySelectorAll('[data-loading]').forEach(button => {
      button.addEventListener('click', (e) => {
        const loadingTime = parseInt(button.getAttribute('data-loading')) || 2000;
        this.showLoading(button);
        
        setTimeout(() => {
          this.hideLoading(button);
        }, loadingTime);
      });
    });
  }

  initializeToggleSwitches() {
    document.querySelectorAll('.form-toggle input[type="checkbox"]').forEach(toggle => {
      toggle.addEventListener('change', (e) => {
        const label = e.target.closest('label') || e.target.nextElementSibling;
        if (label) {
          label.setAttribute('aria-checked', e.target.checked);
        }
        
        // Custom change event
        e.target.dispatchEvent(new CustomEvent('toggle:change', {
          detail: { checked: e.target.checked, value: e.target.value }
        }));
      });
    });
  }

  bindEventListeners() {
    // Delegation for dynamic components
    document.addEventListener('click', (e) => {
      // Modal triggers
      if (e.target.matches('[data-modal]')) {
        e.preventDefault();
        const options = JSON.parse(e.target.getAttribute('data-modal') || '{}');
        this.createModal(options).open();
      }
      
      // Toast triggers
      if (e.target.matches('[data-toast]')) {
        e.preventDefault();
        const options = JSON.parse(e.target.getAttribute('data-toast') || '{}');
        this.showToast(options);
      }
    });
  }

  // ==========================================================================
  // UTILITY METHODS
  // ==========================================================================

  // Get component instance
  getComponent(type, id) {
    const collections = {
      modal: this.modals,
      toast: this.toasts,
      tooltip: this.tooltips,
      dropdown: this.dropdowns,
      tab: this.tabs,
      form: this.forms
    };
    
    return collections[type]?.get(id);
  }

  // Remove component
  destroyComponent(type, id) {
    const component = this.getComponent(type, id);
    if (!component) return false;
    
    // Cleanup based on type
    switch (type) {
      case 'modal':
        component.close();
        break;
      case 'toast':
        component.hide();
        break;
      case 'dropdown':
        component.close();
        break;
    }
    
    const collections = {
      modal: this.modals,
      toast: this.toasts,
      tooltip: this.tooltips,
      dropdown: this.dropdowns,
      tab: this.tabs,
      form: this.forms
    };
    
    collections[type]?.delete(id);
    return true;
  }

  // Theme management
  setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('preferred-theme', theme);
    this.announce(`Theme changed to ${theme}`);
  }

  getTheme() {
    return localStorage.getItem('preferred-theme') || 'light';
  }

  toggleTheme() {
    const current = this.getTheme();
    const newTheme = current === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
    return newTheme;
  }
}

// ==========================================================================
// HELPER FUNCTIONS
// ==========================================================================

// Animation utilities
function animateIn(element, animation = 'fadeIn') {
  element.style.animation = `${animation} 0.3s ease-out forwards`;
}

function animateOut(element, animation = 'fadeOut') {
  element.style.animation = `${animation} 0.3s ease-in forwards`;
  return new Promise(resolve => {
    setTimeout(resolve, 300);
  });
}

// Debounce utility
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Throttle utility
function throttle(func, limit) {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Format validation
const validators = {
  email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
  phone: (value) => /^[\+]?[1-9][\d]{0,15}$/.test(value),
  url: (value) => {
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  },
  strongPassword: (value) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(value)
};

// ==========================================================================
// INITIALIZATION
// ==========================================================================

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.ComponentLibrary = new ComponentLibrary();
  });
} else {
  window.ComponentLibrary = new ComponentLibrary();
}

// Global helpers
window.showModal = (options) => window.ComponentLibrary?.createModal(options)?.open();
window.showToast = (options) => window.ComponentLibrary?.showToast(options);
window.hideLoading = (element) => window.ComponentLibrary?.hideLoading(element);
window.showLoading = (element, options) => window.ComponentLibrary?.showLoading(element, options);

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ComponentLibrary;
}

console.log('🎨 Component Library loaded successfully!');