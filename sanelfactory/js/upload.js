// Upload page functionality

document.addEventListener('DOMContentLoaded', function() {
    initFileUpload();
    initQuoteForm();
    initPriceCalculator();
    initCustomColorToggle();
    initMaterialFilter();
    initServiceTypeToggle();
});

// File upload functionality
function initFileUpload() {
    const uploadZone = document.getElementById('upload-zone');
    const fileInput = document.getElementById('file-input');
    const fileBrowser = document.getElementById('file-browser');
    const filePreview = document.getElementById('file-preview');
    const removeFileBtn = document.getElementById('remove-file');
    
    let uploadedFile = null;
    
    // Click to browse files
    if (fileBrowser) {
        fileBrowser.addEventListener('click', function() {
            fileInput.click();
        });
    }
    
    // File input change
    if (fileInput) {
        fileInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                handleFileUpload(file);
            }
        });
    }
    
    // Drag and drop functionality
    if (uploadZone) {
        uploadZone.addEventListener('click', function() {
            fileInput.click();
        });
        
        uploadZone.addEventListener('dragover', function(e) {
            e.preventDefault();
            uploadZone.classList.add('dragover');
        });
        
        uploadZone.addEventListener('dragleave', function(e) {
            e.preventDefault();
            uploadZone.classList.remove('dragover');
        });
        
        uploadZone.addEventListener('drop', function(e) {
            e.preventDefault();
            uploadZone.classList.remove('dragover');
            
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                handleFileUpload(files[0]);
            }
        });
    }
    
    // Remove file functionality
    if (removeFileBtn) {
        removeFileBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            removeFile();
        });
    }
    
    // Handle file upload
    function handleFileUpload(file) {
        // Validate file type
        const allowedTypes = ['.stl', '.obj', '.3mf', '.step', '.stp'];
        const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
        
        if (!allowedTypes.includes(fileExtension)) {
            showNotification('Format de fișier neacceptat. Folosește: STL, OBJ, 3MF, STEP', 'error');
            return;
        }
        
        // Validate file size (max 50MB)
        const maxSize = 50 * 1024 * 1024;
        if (file.size > maxSize) {
            showNotification('Fișierul este prea mare. Dimensiunea maximă acceptată este 50MB', 'error');
            return;
        }
        
        // Show loading state
        uploadZone.classList.add('loading');
        
        // Simulate file processing
        setTimeout(() => {
            uploadedFile = file;
            displayFilePreview(file);
            analyzeModel(file);
            uploadZone.style.display = 'none';
            filePreview.style.display = 'block';
            uploadZone.classList.remove('loading');
            
            // Update price calculator
            updatePriceCalculator();
            
            showNotification('Fișier încărcat cu succes!', 'success');
        }, 2000);
    }
    
    // Display file preview
    function displayFilePreview(file) {
        const fileName = document.getElementById('file-name');
        const fileSize = document.getElementById('file-size');
        
        if (fileName) fileName.textContent = file.name;
        if (fileSize) fileSize.textContent = formatFileSize(file.size);
    }
    
    // Remove file
    function removeFile() {
        uploadedFile = null;
        fileInput.value = '';
        uploadZone.style.display = 'block';
        filePreview.style.display = 'none';
        updatePriceCalculator();
    }
    
    // Simulate model analysis
    function analyzeModel(file) {
        // This would normally be done by a server-side STL parser
        const mockData = {
            dimensions: `${Math.floor(Math.random() * 100 + 20)} × ${Math.floor(Math.random() * 80 + 15)} × ${Math.floor(Math.random() * 60 + 10)} mm`,
            volume: (Math.random() * 50 + 5).toFixed(1) + ' cm³',
            surface: (Math.random() * 200 + 50).toFixed(1) + ' cm²',
            complexity: ['Simplă', 'Medie', 'Complexă'][Math.floor(Math.random() * 3)]
        };
        
        const dimensionsEl = document.getElementById('model-dimensions');
        const volumeEl = document.getElementById('model-volume');
        const surfaceEl = document.getElementById('model-surface');
        const complexityEl = document.getElementById('model-complexity');
        
        if (dimensionsEl) dimensionsEl.textContent = mockData.dimensions;
        if (volumeEl) volumeEl.textContent = mockData.volume;
        if (surfaceEl) surfaceEl.textContent = mockData.surface;
        if (complexityEl) complexityEl.textContent = mockData.complexity;
        
        // Store analysis data for price calculation
        window.modelAnalysis = {
            volume: parseFloat(mockData.volume),
            complexity: mockData.complexity
        };
    }
}

// Quote form functionality
function initQuoteForm() {
    const quoteForm = document.getElementById('quote-form');
    const successModal = document.getElementById('success-modal');
    const modalClose = document.getElementById('modal-close');
    const modalOk = document.getElementById('modal-ok');
    
    if (quoteForm) {
        quoteForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate form
            if (validateQuoteForm()) {
                // Show loading state
                const submitBtn = quoteForm.querySelector('button[type="submit"]');
                const originalText = submitBtn.innerHTML;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Se trimite...';
                submitBtn.disabled = true;
                
                // Simulate form submission
                setTimeout(() => {
                    // Reset button
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                    
                    // Show success modal
                    if (successModal) {
                        successModal.classList.add('active');
                    }
                    
                    // Clear form data from localStorage
                    clearFormData('quote-form');
                }, 3000);
            }
        });
    }
    
    // Modal close functionality
    if (modalClose) {
        modalClose.addEventListener('click', function() {
            successModal.classList.remove('active');
        });
    }
    
    if (modalOk) {
        modalOk.addEventListener('click', function() {
            successModal.classList.remove('active');
            // Optionally redirect to homepage
            // window.location.href = '../index.html';
        });
    }
    
    // Close modal on outside click
    if (successModal) {
        successModal.addEventListener('click', function(e) {
            if (e.target === successModal) {
                successModal.classList.remove('active');
            }
        });
    }
}

// Form validation
function validateQuoteForm() {
    let isValid = true;
    const errors = {};
    
    // Check if file is uploaded
    if (!window.uploadedFile && !document.getElementById('file-preview').style.display === 'block') {
        showNotification('Te rog să încarci un fișier STL înainte de a trimite cererea', 'error');
        return false;
    }
    
    // Required fields
    const requiredFields = ['material', 'layer-height', 'infill', 'supports', 'quantity', 'name', 'email', 'phone'];
    
    requiredFields.forEach(field => {
        const input = document.getElementById(field);
        if (input && (!input.value || input.value.trim() === '')) {
            errors[field] = 'Acest câmp este obligatoriu';
            isValid = false;
        }
    });
    
    // Email validation
    const email = document.getElementById('email');
    if (email && email.value && !isValidEmail(email.value)) {
        errors.email = 'Adresa de email nu este validă';
        isValid = false;
    }
    
    // Phone validation
    const phone = document.getElementById('phone');
    if (phone && phone.value && !isValidPhone(phone.value)) {
        errors.phone = 'Numărul de telefon nu este valid';
        isValid = false;
    }
    
    // Quantity validation
    const quantity = document.getElementById('quantity');
    if (quantity && quantity.value && (parseInt(quantity.value) < 1 || parseInt(quantity.value) > 100)) {
        errors.quantity = 'Cantitatea trebuie să fie între 1 și 100';
        isValid = false;
    }
    
    // Custom color validation
    const customColorRadio = document.querySelector('input[name="color"][value="custom"]');
    const customColorInput = document.getElementById('custom-color');
    if (customColorRadio && customColorRadio.checked && (!customColorInput.value || customColorInput.value.trim() === '')) {
        errors['custom-color'] = 'Te rog să specifici culoarea dorită';
        isValid = false;
    }
    
    // Display errors
    displayFormErrors(errors);
    
    return isValid;
}

// Phone validation
function isValidPhone(phone) {
    const phoneRegex = /^(\+40|0)[0-9]{9}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
}

// Price calculator functionality
function initPriceCalculator() {
    const calculator = document.getElementById('price-calculator');
    const calculatorToggle = document.getElementById('calculator-toggle');
    
    // Toggle calculator on mobile
    if (calculatorToggle) {
        calculatorToggle.addEventListener('click', function() {
            calculator.classList.toggle('collapsed');
        });
    }
    
    // Listen for form changes
    const form = document.getElementById('quote-form');
    if (form) {
        form.addEventListener('change', updatePriceCalculator);
        form.addEventListener('input', debounce(updatePriceCalculator, 500));
    }
    
    // Initial calculation
    updatePriceCalculator();
}

// Update price calculator
function updatePriceCalculator() {
    const serviceType = document.getElementById('service-type');
    const material = document.getElementById('material');
    const quantity = document.getElementById('quantity');
    const layerHeight = document.getElementById('layer-height');
    const infill = document.getElementById('infill');
    const laserPower = document.getElementById('laser-power');
    const laserSpeed = document.getElementById('laser-speed');
    const delivery = document.querySelector('input[name="delivery"]:checked');
    const services = document.querySelectorAll('input[name="services"]:checked');
    
    let materialPrice = 0;
    let processingPrice = 0;
    let servicesPrice = 0;
    let deliveryPrice = 0;
    
    // Get model volume/area (default if no file uploaded)
    const volume = window.modelAnalysis ? window.modelAnalysis.volume : 15;
    const area = window.modelAnalysis ? window.modelAnalysis.area : 100; // cm²
    const qty = quantity ? parseInt(quantity.value) || 1 : 1;
    const selectedService = serviceType ? serviceType.value : 'fdm';
    
    // Material cost
    if (material && material.value) {
        const selectedOption = material.options[material.selectedIndex];
        const price = parseFloat(selectedOption.dataset.price) || 2;
        
        if (selectedService === 'laser') {
            // For laser engraving, price is per cm²
            materialPrice = area * (price / 100) * qty; // Convert to per cm²
        } else {
            // For 3D printing, price is per cm³
            materialPrice = volume * price * qty;
        }
    }
    
    // Processing cost based on service type
    switch (selectedService) {
        case 'fdm':
            processingPrice = 15 * qty; // Base FDM printing cost
            if (layerHeight && layerHeight.value) {
                const layerHeightValue = parseFloat(layerHeight.value);
                if (layerHeightValue <= 0.1) processingPrice *= 1.5; // Fine quality
                else if (layerHeightValue >= 0.3) processingPrice *= 0.8; // Fast quality
            }
            // Infill modifier
            if (infill && infill.value) {
                const infillValue = parseInt(infill.value);
                processingPrice *= (1 + infillValue / 200); // More infill = more time
            }
            break;
            
        case 'sla':
            processingPrice = 25 * qty; // Base SLA printing cost (higher due to post-processing)
            break;
            
        case 'laser':
            processingPrice = 10 * qty; // Base laser engraving cost
            // Laser power and speed modifiers
            if (laserPower && laserPower.value) {
                const powerValue = parseInt(laserPower.value);
                processingPrice *= (1 + powerValue / 500); // Higher power = more cost
            }
            if (laserSpeed && laserSpeed.value) {
                const speedValue = parseInt(laserSpeed.value);
                processingPrice *= (1.5 - speedValue / 200); // Lower speed = more cost
            }
            break;
    }
    
    // Additional services
    services.forEach(service => {
        switch (service.value) {
            case 'post-processing':
                servicesPrice += selectedService === 'laser' ? 10 * qty : 20 * qty;
                break;
            case 'painting':
                servicesPrice += selectedService === 'laser' ? 25 * qty : 50 * qty;
                break;
            case 'assembly':
                servicesPrice += 30 * qty;
                break;
        }
    });
    
    // Delivery cost
    if (delivery) {
        switch (delivery.value) {
            case 'courier':
                deliveryPrice = 15;
                break;
            case 'express':
                deliveryPrice = 35;
                break;
            default:
                deliveryPrice = 0;
        }
    }
    
    // Update display
    const priceMaterial = document.getElementById('price-material');
    const priceProcessing = document.getElementById('price-processing');
    const priceServices = document.getElementById('price-services');
    const priceDelivery = document.getElementById('price-delivery');
    const priceTotal = document.getElementById('price-total');
    
    if (priceMaterial) priceMaterial.textContent = formatPrice(materialPrice);
    if (priceProcessing) priceProcessing.textContent = formatPrice(processingPrice);
    if (priceServices) priceServices.textContent = formatPrice(servicesPrice);
    if (priceDelivery) priceDelivery.textContent = formatPrice(deliveryPrice);
    
    const total = materialPrice + processingPrice + servicesPrice + deliveryPrice;
    if (priceTotal) priceTotal.textContent = formatPrice(total);
    
    // Update estimated time
    updateEstimatedTime(qty, selectedService, layerHeight ? parseFloat(layerHeight.value) : 0.2);
}

// Update estimated time
function updateEstimatedTime(quantity, serviceType, layerHeight) {
    const estimatedTimeEl = document.getElementById('estimated-time');
    const deliveryTimeEl = document.getElementById('delivery-time');
    
    // Calculate processing time based on service type, quantity and parameters
    let processingHours = 0;
    
    switch (serviceType) {
        case 'fdm':
            processingHours = quantity * 8; // Base 8 hours per piece for FDM
            if (layerHeight <= 0.1) processingHours *= 2; // Fine quality takes longer
            else if (layerHeight >= 0.3) processingHours *= 0.7; // Fast quality is quicker
            break;
            
        case 'sla':
            processingHours = quantity * 6; // Base 6 hours per piece for SLA (faster printing but needs post-processing)
            processingHours += quantity * 2; // Add post-processing time
            break;
            
        case 'laser':
            processingHours = quantity * 2; // Base 2 hours per piece for laser engraving
            break;
            
        default:
            processingHours = quantity * 8;
    }
    
    let timeText = '';
    if (processingHours <= 24) {
        timeText = '24h';
    } else if (processingHours <= 48) {
        timeText = '24-48h';
    } else {
        timeText = '2-3 zile';
    }
    
    if (estimatedTimeEl) estimatedTimeEl.textContent = timeText;
    
    // Delivery time
    const delivery = document.querySelector('input[name="delivery"]:checked');
    let deliveryText = '2-3 zile';
    if (delivery) {
        switch (delivery.value) {
            case 'pickup':
                deliveryText = 'Imediat';
                break;
            case 'courier':
                deliveryText = '2-3 zile';
                break;
            case 'express':
                deliveryText = 'Aceeași zi';
                break;
        }
    }
    
    if (deliveryTimeEl) deliveryTimeEl.textContent = deliveryText;
}

// Custom color toggle
function initCustomColorToggle() {
    const customColorRadio = document.querySelector('input[name="color"][value="custom"]');
    const customColorInput = document.getElementById('custom-color-input');
    const colorRadios = document.querySelectorAll('input[name="color"]');
    
    colorRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.value === 'custom') {
                customColorInput.style.display = 'block';
            } else {
                customColorInput.style.display = 'none';
            }
        });
    });
}

// Material filter based on technology
function initMaterialFilter() {
    const technologyRadios = document.querySelectorAll('input[name="technology"]');
    const materialSelect = document.getElementById('material');
    
    technologyRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            filterMaterials(this.value);
            updatePriceCalculator();
        });
    });
    
    // Initial filter
    const selectedTech = document.querySelector('input[name="technology"]:checked');
    if (selectedTech) {
        filterMaterials(selectedTech.value);
    }
}

// Filter materials based on technology
function filterMaterials(technology) {
    const materialSelect = document.getElementById('material');
    if (!materialSelect) return;
    
    const options = materialSelect.querySelectorAll('option');
    const optgroups = materialSelect.querySelectorAll('optgroup');
    
    // Hide all optgroups first
    optgroups.forEach(group => {
        group.style.display = 'none';
    });
    
    // Show relevant optgroup
    if (technology === 'fdm') {
        const fdmGroup = materialSelect.querySelector('optgroup[label="FDM Materials"]');
        if (fdmGroup) fdmGroup.style.display = 'block';
    } else if (technology === 'sla') {
        const slaGroup = materialSelect.querySelector('optgroup[label="SLA Materials"]');
        if (slaGroup) slaGroup.style.display = 'block';
    }
    
    // Reset selection if current selection is not valid for new technology
    const currentValue = materialSelect.value;
    const currentOption = materialSelect.querySelector(`option[value="${currentValue}"]`);
    if (currentOption && currentOption.closest('optgroup').style.display === 'none') {
        materialSelect.value = '';
    }
}

// Enhanced file upload with progress
function uploadFileWithProgress(file, onProgress, onComplete, onError) {
    const formData = new FormData();
    formData.append('file', file);
    
    const xhr = new XMLHttpRequest();
    
    // Progress handler
    xhr.upload.addEventListener('progress', function(e) {
        if (e.lengthComputable) {
            const percentComplete = (e.loaded / e.total) * 100;
            if (onProgress) onProgress(percentComplete);
        }
    });
    
    // Success handler
    xhr.addEventListener('load', function() {
        if (xhr.status === 200) {
            try {
                const response = JSON.parse(xhr.responseText);
                if (onComplete) onComplete(response);
            } catch (e) {
                if (onError) onError('Invalid server response');
            }
        } else {
            if (onError) onError(`Upload failed with status: ${xhr.status}`);
        }
    });
    
    // Error handler
    xhr.addEventListener('error', function() {
        if (onError) onError('Upload failed due to network error');
    });
    
    // Send request
    xhr.open('POST', '/api/upload', true);
    xhr.send(formData);
}

// Create progress bar
function createProgressBar() {
    const progressContainer = document.createElement('div');
    progressContainer.className = 'upload-progress';
    
    const progressBar = document.createElement('div');
    progressBar.className = 'upload-progress-bar';
    
    progressContainer.appendChild(progressBar);
    return { container: progressContainer, bar: progressBar };
}

// STL file analyzer (basic client-side analysis)
function analyzeSTLFile(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            try {
                const buffer = e.target.result;
                const analysis = parseSTLBuffer(buffer);
                resolve(analysis);
            } catch (error) {
                reject(error);
            }
        };
        
        reader.onerror = function() {
            reject(new Error('Failed to read file'));
        };
        
        reader.readAsArrayBuffer(file);
    });
}

// Basic STL parser (simplified)
function parseSTLBuffer(buffer) {
    const view = new DataView(buffer);
    
    // Check if it's binary STL (first 80 bytes are header)
    if (buffer.byteLength < 84) {
        throw new Error('File too small to be a valid STL');
    }
    
    // Read triangle count (bytes 80-83)
    const triangleCount = view.getUint32(80, true);
    
    // Basic validation
    const expectedSize = 80 + 4 + (triangleCount * 50);
    if (buffer.byteLength !== expectedSize) {
        throw new Error('Invalid STL file format');
    }
    
    // Calculate approximate volume and surface area
    let volume = 0;
    let surfaceArea = 0;
    let minX = Infinity, maxX = -Infinity;
    let minY = Infinity, maxY = -Infinity;
    let minZ = Infinity, maxZ = -Infinity;
    
    for (let i = 0; i < triangleCount; i++) {
        const offset = 84 + i * 50;
        
        // Skip normal vector (12 bytes)
        // Read vertices (3 vertices * 3 coordinates * 4 bytes)
        for (let j = 0; j < 3; j++) {
            const vertexOffset = offset + 12 + j * 12;
            const x = view.getFloat32(vertexOffset, true);
            const y = view.getFloat32(vertexOffset + 4, true);
            const z = view.getFloat32(vertexOffset + 8, true);
            
            minX = Math.min(minX, x);
            maxX = Math.max(maxX, x);
            minY = Math.min(minY, y);
            maxY = Math.max(maxY, y);
            minZ = Math.min(minZ, z);
            maxZ = Math.max(maxZ, z);
        }
        
        // Approximate surface area (triangle area)
        surfaceArea += calculateTriangleArea(view, offset + 12);
    }
    
    // Calculate bounding box dimensions
    const width = maxX - minX;
    const height = maxY - minY;
    const depth = maxZ - minZ;
    
    // Approximate volume (very rough estimation)
    volume = (width * height * depth) * 0.3; // Assume 30% fill for rough estimate
    
    return {
        triangleCount,
        dimensions: {
            width: width.toFixed(1),
            height: height.toFixed(1),
            depth: depth.toFixed(1)
        },
        volume: (volume / 1000).toFixed(1), // Convert to cm³
        surfaceArea: (surfaceArea / 100).toFixed(1), // Convert to cm²
        complexity: triangleCount > 10000 ? 'Complexă' : triangleCount > 5000 ? 'Medie' : 'Simplă'
    };
}

// Calculate triangle area
function calculateTriangleArea(view, offset) {
    // Read three vertices
    const v1 = {
        x: view.getFloat32(offset, true),
        y: view.getFloat32(offset + 4, true),
        z: view.getFloat32(offset + 8, true)
    };
    const v2 = {
        x: view.getFloat32(offset + 12, true),
        y: view.getFloat32(offset + 16, true),
        z: view.getFloat32(offset + 20, true)
    };
    const v3 = {
        x: view.getFloat32(offset + 24, true),
        y: view.getFloat32(offset + 28, true),
        z: view.getFloat32(offset + 32, true)
    };
    
    // Calculate area using cross product
    const a = { x: v2.x - v1.x, y: v2.y - v1.y, z: v2.z - v1.z };
    const b = { x: v3.x - v1.x, y: v3.y - v1.y, z: v3.z - v1.z };
    
    const cross = {
        x: a.y * b.z - a.z * b.y,
        y: a.z * b.x - a.x * b.z,
        z: a.x * b.y - a.y * b.x
    };
    
    const magnitude = Math.sqrt(cross.x * cross.x + cross.y * cross.y + cross.z * cross.z);
    return magnitude / 2;
}

// Service type toggle functionality
function initServiceTypeToggle() {
    const serviceTypeSelect = document.getElementById('service-type');
    
    if (serviceTypeSelect) {
        serviceTypeSelect.addEventListener('change', function() {
            updateFormBasedOnService(this.value);
        });
        
        // Initialize with default value
        updateFormBasedOnService(serviceTypeSelect.value);
    }
}

function updateFormBasedOnService(serviceType) {
    // Hide all service-specific elements
    const serviceElements = document.querySelectorAll('[class*="service-"]');
    serviceElements.forEach(element => {
        element.style.display = 'none';
    });
    
    // Show relevant elements based on service type
    switch (serviceType) {
        case 'fdm':
            // Show FDM materials and settings
            showServiceElements('.service-fdm');
            showServiceElements('.service-3d');
            updateMaterialOptionsForService('fdm');
            break;
            
        case 'sla':
            // Show SLA materials and settings
            showServiceElements('.service-sla');
            showServiceElements('.service-3d');
            updateMaterialOptionsForService('sla');
            break;
            
        case 'laser':
            // Show laser materials and settings
            showServiceElements('.service-laser');
            updateMaterialOptionsForService('laser');
            break;
    }
    
    // Update required fields
    updateRequiredFields(serviceType);
    
    // Update price calculator
    updatePriceCalculator();
}

function showServiceElements(selector) {
    const elements = document.querySelectorAll(selector);
    elements.forEach(element => {
        element.style.display = 'block';
    });
}

function updateMaterialOptionsForService(serviceType) {
    const materialSelect = document.getElementById('material');
    if (!materialSelect) return;
    
    // Hide all optgroups
    const optgroups = materialSelect.querySelectorAll('optgroup');
    optgroups.forEach(group => {
        group.style.display = 'none';
    });
    
    // Show relevant optgroup
    const relevantGroup = materialSelect.querySelector(`.service-${serviceType}`);
    if (relevantGroup) {
        relevantGroup.style.display = 'block';
    }
    
    // Reset selection
    materialSelect.value = '';
}

function updateRequiredFields(serviceType) {
    // Remove required from all service-specific fields
    const allServiceFields = document.querySelectorAll('[class*="service-"] select, [class*="service-"] input');
    allServiceFields.forEach(field => {
        field.removeAttribute('required');
    });
    
    // Add required to active service fields
    const activeFields = document.querySelectorAll(`.service-${serviceType} select, .service-${serviceType} input`);
    activeFields.forEach(field => {
        if (field.type !== 'checkbox') {
            field.setAttribute('required', 'required');
        }
    });
    
    // Special handling for 3D printing services
    if (serviceType === 'fdm' || serviceType === 'sla') {
        const layerHeightField = document.getElementById('layer-height');
        if (layerHeightField) {
            layerHeightField.setAttribute('required', 'required');
        }
    }
}

// Export functions for potential use in other modules
window.uploadFunctions = {
    analyzeSTLFile,
    uploadFileWithProgress,
    updatePriceCalculator,
    validateQuoteForm
};