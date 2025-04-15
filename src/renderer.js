// CIP categories are now defined directly in this file since we can't use require in the renderer
const EAB_CIP_CATEGORIES = [
    "Agricultural, Animal, Plant, Veterinary Science, and Related Fields",
    "Architecture and Related Services",
    "Area, Ethnic, Cultural, Gender, and Group Studies",
    "Basic Skills and Developmental or Remedial Education",
    "Biological and Biomedical Sciences",
    "Business, Management, Marketing, and Related Support Services",
    "Citizenship Activities",
    "Communication, Journalism, and Related Programs",
    "Communications Technologies, Technicians, and Support Services",
    "Computer and Information Sciences and Support Services",
    "Construction Trades",
    "Culinary, Entertainment, and Personal Services",
    "Education",
    "Engineering",
    "Engineering, Engineering-Related Technologies, and Technicians",
    "English Language, Literature, and Letters",
    "Family and Consumer Sciences, Human Sciences",
    "Foreign Languages, Literatures, and Linguistics",
    "Health Professions and Related Programs",
    "Health Professions Residency and Fellowship Programs",
    "Health-Related Knowledge and Skills",
    "High School and Secondary Diplomas and Certificates",
    "History",
    "Homeland Security, Law Enforcement, Firefighting, and Related Protective Services",
    "Interpersonal and Social Skills",
    "Legal Professions and Studies",
    "Leisure and Recreational Activities",
    "Liberal Arts and Sciences, General Studies, and Humanities",
    "Library Science",
    "Mathematics and Statistics",
    "Mechanic and Repair Technologies and Technicians",
    "Medical Residency and Fellowship Programs",
    "Military Science, Leadership, and Operational Art",
    "Military Technologies and Applied Sciences",
    "Multi and Interdisciplinary Studies",
    "Natural Resources and Conservation",
    "Parks, Recreation, Leisure, Fitness, and Kinesiology",
    "Personal Awareness and Self-Improvement",
    "Philosophy and Religious Studies",
    "Physical Sciences",
    "Precision Production",
    "Psychology",
    "Public Administration and Social Service Professions",
    "Science Technologies and Technicians",
    "Social Sciences",
    "Theology and Religious Vocations",
    "Transportation and Materials Moving",
    "Visual and Performing Arts"
];

// DOM Elements
const cipList = document.getElementById('cip-list');
const programsContainer = document.getElementById('programs-container');
const clubsContainer = document.getElementById('clubs-container');
const eduButton = document.getElementById('edu-button');
const instaButton = document.getElementById('insta-button');
const searchInput = document.getElementById('search-input');
const dataStatus = document.getElementById('data-status');
const schemaModal = document.getElementById('schema-modal');
const closeButton = document.querySelector('.close-button');
const saveSchemaButton = document.getElementById('save-schema');

// Schema configuration elements
const programNameField = document.getElementById('program-name');
const programDescriptionField = document.getElementById('program-description');
const programLinkField = document.getElementById('program-link');
const programExtraField = document.getElementById('program-extra');
const programCategoryField = document.getElementById('program-category');
const clubNameField = document.getElementById('club-name');
const clubDescriptionField = document.getElementById('club-description');
const clubLinkField = document.getElementById('club-link');
const clubExtraField = document.getElementById('club-extra');
const clubCategoryField = document.getElementById('club-category');

// Global variable for the save button (declared here, added to DOM later)
let saveButton = null;

// Application state
let appState = {
    programs: [],
    clubs: [],
    dataByCategory: {},
    selectedCategory: null,
    schema: {
        programs: {
            name: 'name',
            description: 'description',
            link: 'link',
            extraLabel: 'degree',
            categoryField: 'eab_cip_code'
        },
        clubs: {
            name: 'name',
            description: 'description',
            link: 'website',
            extraLabel: '',
            categoryField: 'eab_cip_code'
        }
    },
    eduUrl: 'https://www.du.edu/',
    instaUrl: 'https://www.instagram.com/uofdenver/'
};

// Track unsaved changes - MOVED HERE
let hasUnsavedChanges = false;

// Initialize application only after DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

async function init() {
    // Add save button to the DOM now that it's ready
    const headerContainer = document.querySelector('.toolbar');
    if (headerContainer) {
        saveButton = document.createElement('button');
        saveButton.id = 'save-button';
        saveButton.textContent = 'Save Changes';
        saveButton.style.display = 'none'; // Initially hidden
        headerContainer.insertBefore(saveButton, headerContainer.firstChild);
        
        // Add save button functionality
        saveButton.addEventListener('click', async () => {
            try {
                // Make sure appState.programs and appState.clubs are defined
                if (!appState.programs) appState.programs = [];
                if (!appState.clubs) appState.clubs = [];
                
                const data = {
                    programs: appState.programs,
                    clubs: appState.clubs
                };
                
                console.log('Saving data:', data); // Debug log
                
                const result = await window.api.saveToFile(data);
                
                if (result.success) {
                    hasUnsavedChanges = false;
                    hideSaveButton();
                    window.api.markChangesSaved();
                } else {
                    console.error('Save failed:', result.message);
                }
            } catch (error) {
                console.error('Error saving data:', error);
            }
        });
    } else {
        console.error("Header container not found! Cannot add save button.");
    }

    // Load schema config
    await loadSchemaConfig();

    // Load custom URLs
    await loadCustomUrls();

    // Load default data from Downloads folder
    await loadDefaultData();

    // Populate the CIP categories
    populateCIPList();

    // Set up event listeners
    setupEventListeners();
}

// Load custom URLs from electron-store
async function loadCustomUrls() {
    try {
        const urls = await window.api.loadCustomUrls();
        if (urls) {
            if (urls.eduUrl) appState.eduUrl = urls.eduUrl;
            if (urls.instaUrl) appState.instaUrl = urls.instaUrl;
        }
    } catch (error) {
        console.error('Error loading custom URLs:', error);
    }
}

// Save custom URLs to electron-store
async function saveCustomUrls() {
    try {
        await window.api.saveCustomUrls({
            eduUrl: appState.eduUrl,
            instaUrl: appState.instaUrl
        });
    } catch (error) {
        console.error('Error saving custom URLs:', error);
    }
}

// Load schema configuration from electron-store
async function loadSchemaConfig() {
    try {
        const config = await window.api.loadSchemaConfig();
        if (config) {
            appState.schema = config;
            updateSchemaInputFields();
        }
    } catch (error) {
        console.error('Error loading schema config:', error);
    }
}

// Update schema input fields with current configuration
function updateSchemaInputFields() {
    const { programs, clubs } = appState.schema;
    
    programNameField.value = programs.name;
    programDescriptionField.value = programs.description;
    programLinkField.value = programs.link;
    programExtraField.value = programs.extraLabel;
    programCategoryField.value = programs.categoryField;
    
    clubNameField.value = clubs.name;
    clubDescriptionField.value = clubs.description;
    clubLinkField.value = clubs.link;
    clubExtraField.value = clubs.extraLabel;
    clubCategoryField.value = clubs.categoryField;
}

// Save schema configuration
async function saveSchemaConfig() {
    const newSchema = {
        programs: {
            name: programNameField.value.trim() || 'name',
            description: programDescriptionField.value.trim() || 'description',
            link: programLinkField.value.trim() || 'link',
            extraLabel: programExtraField.value.trim(),
            categoryField: programCategoryField.value.trim() || 'eab_cip_code'
        },
        clubs: {
            name: clubNameField.value.trim() || 'name',
            description: clubDescriptionField.value.trim() || 'description',
            link: clubLinkField.value.trim() || 'website',
            extraLabel: clubExtraField.value.trim(),
            categoryField: clubCategoryField.value.trim() || 'eab_cip_code'
        }
    };
    
    try {
        await window.api.saveSchemaConfig(newSchema);
        appState.schema = newSchema;
        
        // Reorganize data with new schema
        if (appState.programs.length > 0 || appState.clubs.length > 0) {
            organizeDataByCategory();
            if (appState.selectedCategory) {
                displayCategory(appState.selectedCategory);
            }
        }
        
        schemaModal.style.display = 'none';
    } catch (error) {
        console.error('Error saving schema config:', error);
        alert('Failed to save schema configuration');
    }
}

// Load default data from Downloads folder
async function loadDefaultData() {
    try {
        const result = await window.api.loadDefaultData();
        
        if (result.programs) {
            appState.programs = result.programs;
        }
        
        if (result.clubs) {
            appState.clubs = result.clubs;
        }
        
        if (result.errors.length > 0) {
            dataStatus.textContent = `Loaded with ${result.errors.length} error(s)`;
            console.warn('Data loading errors:', result.errors);
        } else if (appState.programs.length > 0 || appState.clubs.length > 0) {
            dataStatus.textContent = `Programs: ${appState.programs.length}, Clubs: ${appState.clubs.length}`;
        }
        
        // Organize data by category
        if (appState.programs.length > 0 || appState.clubs.length > 0) {
            organizeDataByCategory();
            populateCIPList(); // Refresh the list to show active/inactive states
        }
    } catch (error) {
        console.error('Error loading default data:', error);
        dataStatus.textContent = 'Error loading data';
    }
}

// Load a JSON file
async function loadJSONFile(filePath, type) {
    try {
        const data = await window.api.loadJsonFile(filePath);
        
        if (data) {
            if (type === 'programs') {
                appState.programs = data;
                dataStatus.textContent = `Programs: ${data.length}, Clubs: ${appState.clubs.length}`;
            } else if (type === 'clubs') {
                appState.clubs = data;
                dataStatus.textContent = `Programs: ${appState.programs.length}, Clubs: ${data.length}`;
            }
            
            // Reorganize data
            organizeDataByCategory();
            
            // Refresh the CIP list to show active/inactive states
            populateCIPList();
            
            // If a category is selected, refresh the display
            if (appState.selectedCategory) {
                displayCategory(appState.selectedCategory);
            }
        }
    } catch (error) {
        console.error(`Error loading ${type} data:`, error);
        dataStatus.textContent = `Error loading ${type} data`;
    }
}

// Organize data by CIP category
function organizeDataByCategory() {
    const dataByCategory = {};
    
    // Initialize each category with empty arrays
    EAB_CIP_CATEGORIES.forEach(category => {
        dataByCategory[category] = {
            programs: [],
            clubs: []
        };
    });
    
    // Add programs to their categories
    appState.programs.forEach(program => {
        const categoryField = appState.schema.programs.categoryField;
        const category = program[categoryField];
        
        if (category && dataByCategory[category]) {
            dataByCategory[category].programs.push(program);
        }
    });
    
    // Add clubs to their categories
    appState.clubs.forEach(club => {
        const categoryField = appState.schema.clubs.categoryField;
        const category = club[categoryField];
        
        if (category && dataByCategory[category]) {
            dataByCategory[category].clubs.push(club);
        }
    });
    
    // Sort programs and clubs by name
    for (const category in dataByCategory) {
        const nameFieldPrograms = appState.schema.programs.name;
        const nameFieldClubs = appState.schema.clubs.name;
        
        dataByCategory[category].programs.sort((a, b) => {
            return (a[nameFieldPrograms] || '').localeCompare(b[nameFieldPrograms] || '');
        });
        
        dataByCategory[category].clubs.sort((a, b) => {
            return (a[nameFieldClubs] || '').localeCompare(b[nameFieldClubs] || '');
        });
    }
    
    appState.dataByCategory = dataByCategory;
}

// Populate the CIP list in the sidebar
function populateCIPList() {
    // Clear current list
    cipList.innerHTML = '';
    
    // Sort categories alphabetically
    const sortedCategories = [...EAB_CIP_CATEGORIES].sort();
    
    // Create a list item for each category
    sortedCategories.forEach(category => {
        const listItem = document.createElement('li');
        listItem.textContent = category;
        listItem.classList.add('category-item');
        
        // Check if the category has any data
        const hasData = appState.dataByCategory[category] && 
            (appState.dataByCategory[category].programs.length > 0 || 
             appState.dataByCategory[category].clubs.length > 0);
        
        if (!hasData) {
            listItem.classList.add('inactive');
        } else {
            listItem.addEventListener('click', () => selectCategory(category));
        }
        
        cipList.appendChild(listItem);
    });
}

// Filter CIP list based on search input
function filterCIPList(searchTerm) {
    const items = cipList.querySelectorAll('.category-item');
    const term = searchTerm.toLowerCase();
    
    items.forEach(item => {
        const text = item.textContent.toLowerCase();
        if (text.includes(term)) {
            item.style.display = '';
        } else {
            item.style.display = 'none';
        }
    });
}

// Select a category and display its content
function selectCategory(category) {
    // Update selected state in UI
    const items = cipList.querySelectorAll('.category-item');
    items.forEach(item => {
        if (item.textContent === category) {
            item.classList.add('selected');
        } else {
            item.classList.remove('selected');
        }
    });
    
    // Update app state
    appState.selectedCategory = category;
    
    // Display the category content
    displayCategory(category);
}

// Display category content (programs and clubs)
function displayCategory(category) {
    // Clear containers
    programsContainer.innerHTML = '';
    clubsContainer.innerHTML = '';
    
    const categoryData = appState.dataByCategory[category];
    
    // Display programs
    if (categoryData.programs.length === 0) {
        const noPrograms = document.createElement('div');
        noPrograms.textContent = 'No Programs Available';
        noPrograms.classList.add('no-data-message');
        programsContainer.appendChild(noPrograms);
    } else {
        // Add a count label
        const countLabel = document.createElement('div');
        countLabel.textContent = `${categoryData.programs.length} program${categoryData.programs.length !== 1 ? 's' : ''}`;
        countLabel.classList.add('count-label');
        programsContainer.appendChild(countLabel);
        
        // Add the program cards
        categoryData.programs.forEach(program => {
            const card = createCard(
                program[appState.schema.programs.name] || 'N/A',
                program[appState.schema.programs.description] || 'No description available',
                program[appState.schema.programs.link] || '',
                program[appState.schema.programs.extraLabel] || '',
                'programs',
                appState.programs.indexOf(program)
            );
            programsContainer.appendChild(card);
        });
    }
    
    // Display clubs
    if (categoryData.clubs.length === 0) {
        const noClubs = document.createElement('div');
        noClubs.textContent = 'No Clubs Available';
        noClubs.classList.add('no-data-message');
        clubsContainer.appendChild(noClubs);
    } else {
        // Add a count label
        const countLabel = document.createElement('div');
        countLabel.textContent = `${categoryData.clubs.length} club${categoryData.clubs.length !== 1 ? 's' : ''}`;
        countLabel.classList.add('count-label');
        clubsContainer.appendChild(countLabel);
        
        // Add the club cards
        categoryData.clubs.forEach(club => {
            const card = createCard(
                club[appState.schema.clubs.name] || 'N/A',
                club[appState.schema.clubs.description] || 'No description available',
                club[appState.schema.clubs.link] || '',
                club[appState.schema.clubs.extraLabel] || '',
                'clubs',
                appState.clubs.indexOf(club)
            );
            clubsContainer.appendChild(card);
        });
    }
}

// Function to make a field editable
function makeFieldEditable(element, type, index, field) {
    // Prevent starting a new edit if one is already active in this element
    if (element.querySelector('.edit-input')) {
        return;
    }

    const originalContent = element.textContent;
    const originalHTML = element.innerHTML; // Store original HTML for descriptions
    
    // Use textarea for description fields and input for others
    const isDescription = element.classList.contains('card-description');
    const input = document.createElement(isDescription ? 'textarea' : 'input');
    input.type = 'text';
    input.value = originalContent;
    input.className = 'edit-input';
    
    // Set specific styles for textarea
    if (isDescription) {
        const computedStyle = window.getComputedStyle(element);
        input.style.minHeight = computedStyle.height;
        input.style.width = '100%'; // Ensure it takes full width
        input.style.lineHeight = computedStyle.lineHeight;
        input.style.fontFamily = computedStyle.fontFamily;
        input.style.fontSize = computedStyle.fontSize;
        
        // Auto-adjust height as user types
        input.addEventListener('input', () => {
            input.style.height = 'auto';
            input.style.height = input.scrollHeight + 'px';
        });
    }
    
    // Create controls container
    const controls = document.createElement('div');
    controls.className = 'edit-controls';

    const acceptButton = document.createElement('button');
    acceptButton.textContent = 'Accept';
    acceptButton.className = 'edit-accept';

    const cancelButton = document.createElement('button');
    cancelButton.textContent = 'Cancel';
    cancelButton.className = 'edit-cancel';

    controls.appendChild(acceptButton);
    controls.appendChild(cancelButton);

    // Clear element and add input and controls
    element.innerHTML = ''; // Use innerHTML to clear completely
    element.appendChild(input);
    element.appendChild(controls);
    input.focus();
    
    // Trigger auto-height adjustment for textarea
    if (isDescription) {
        input.dispatchEvent(new Event('input'));
    }

    // --- Cleanup function --- 
    const cleanup = () => {
        if (element.contains(input)) element.removeChild(input);
        if (element.contains(controls)) element.removeChild(controls);
        // Restore original content based on type
        if (isDescription) {
            element.innerHTML = originalHTML;
        } else {
            element.textContent = originalContent;
        }
    };

    // --- Save function --- 
    const save = () => {
        const newValue = input.value.trim();
        let changed = false;
        if (newValue !== originalContent) {
            if (type === 'programs') {
                appState.programs[index][field] = newValue;
            } else {
                appState.clubs[index][field] = newValue;
            }
            hasUnsavedChanges = true;
            showSaveButton();
            window.api.markUnsavedChanges(); // Mark changes in main process
            changed = true;
        }
        
        // Remove input and controls
        if (element.contains(input)) {
            element.removeChild(input);
        }
        if (element.contains(controls)) {
            element.removeChild(controls);
        }
        
        // Update display with new value (preserving line breaks for descriptions)
        if (isDescription) {
            element.innerHTML = newValue.replace(/\n/g, '<br>');
        } else {
            element.textContent = newValue;
        }
        return changed;
    };

    // --- Event Listeners --- 
    acceptButton.addEventListener('click', (e) => {
        e.stopPropagation();
        save();
    });

    cancelButton.addEventListener('click', (e) => {
        e.stopPropagation();
        cleanup();
    });

    input.addEventListener('keydown', (e) => {
        e.stopPropagation(); // Prevent card toggling etc.
        if (e.key === 'Escape') {
            cleanup();
        } else if (e.key === 'Enter') {
            if (!isDescription) {
                // Accept on Enter for single-line inputs
                e.preventDefault();
                save();
            } else if (e.metaKey || e.ctrlKey) {
                // Accept on Cmd/Ctrl+Enter for textareas
                e.preventDefault();
                save();
            }
            // Allow normal Enter for newlines in textarea otherwise
        }
    });

    // Prevent card click/toggle when interacting with controls
    controls.addEventListener('click', e => e.stopPropagation());
}

// Function to create a card with editable fields
function createCard(title, description, link, extraLabel, type, index) {
    const card = document.createElement('div');
    card.className = 'card';
    
    // Card header with toggle and title
    const header = document.createElement('div');
    header.className = 'card-header';
    
    // Make the whole header toggle the card expansion
    header.addEventListener('click', (e) => {
        // Stop propagation to prevent conflicts with link clicks
        e.stopPropagation();
        toggleCard(card);
    });
    
    // Toggle arrow
    const toggle = document.createElement('span');
    toggle.className = 'card-toggle';
    toggle.textContent = '›';
    
    // Title with link functionality
    const titleElem = document.createElement('span');
    titleElem.className = 'card-title';
    titleElem.textContent = title;
    titleElem.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        e.stopPropagation();
        makeFieldEditable(titleElem, type, index, appState.schema[type].name);
    });
    
    // Subtitle (extra label)
    const subtitle = document.createElement('span');
    subtitle.className = 'card-subtitle';
    subtitle.textContent = extraLabel ? `(${extraLabel})` : '';
    if (extraLabel) {
        subtitle.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            e.stopPropagation();
            makeFieldEditable(subtitle, type, index, appState.schema[type].extraLabel);
        });
    }
    
    // Assemble header
    header.appendChild(toggle);
    header.appendChild(titleElem);
    header.appendChild(subtitle);
    
    // Add link button if there's a link
    if (link) {
        const linkButton = document.createElement('button');
        linkButton.className = 'card-link-button';
        linkButton.title = 'Open in browser';
        linkButton.innerHTML = '🔗'; // Link icon
        linkButton.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent card toggle when clicking link
            e.preventDefault(); // Prevent any default action
            openLink(link);
            return false; // Ensure no navigation happens
        });
        linkButton.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            e.stopPropagation();
            makeFieldEditable(linkButton, type, index, appState.schema[type].link);
        });
        header.appendChild(linkButton);
    }
    
    // Card body with description
    const body = document.createElement('div');
    body.className = 'card-body';
    
    const descElem = document.createElement('div');
    descElem.className = 'card-description selectable';
    
    // Use innerHTML for line breaks but escape any HTML in the description
    const escapedDesc = description
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    
    descElem.innerHTML = escapedDesc;
    descElem.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        e.stopPropagation();
        makeFieldEditable(descElem, type, index, appState.schema[type].description);
    });
    
    body.appendChild(descElem);
    
    // Make card also clickable (for areas outside the header)
    card.addEventListener('click', (e) => {
        // Only toggle if click is on the card itself, not on child elements
        if (e.target === card) {
            toggleCard(card);
        }
    });
    
    // Assemble card
    card.appendChild(header);
    card.appendChild(body);
    
    return card;
}

// Toggle card expansion
function toggleCard(card) {
    const toggle = card.querySelector('.card-toggle');
    const body = card.querySelector('.card-body');
    
    // Toggle expanded class for rotation and visibility
    toggle.classList.toggle('expanded');
    
    // If we're expanding
    if (!body.classList.contains('expanded')) {
        // First add the class to trigger the transition
        body.classList.add('expanded');
        
        // Scroll the card into view if it's expanding and not fully visible
        setTimeout(() => {
            // Check if any part of the card is out of view
            const rect = card.getBoundingClientRect();
            const isFullyVisible = (
                rect.top >= 0 &&
                rect.bottom <= window.innerHeight
            );
            
            if (!isFullyVisible) {
                card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        }, 50); // Small delay to let the expansion start
    } else {
        // We're collapsing
        body.classList.remove('expanded');
    }
}

// Open a link in the default browser
function openLink(url) {
    if (url) {
        // Use the shell.openExternal API through IPC
        // This will correctly open the link in the user's default browser
        window.api.openExternalLink(url)
            .catch(err => console.error('Failed to open link:', err));
    }
}

// Display URL edit modal
function showUrlEditModal(type) {
    const currentUrl = type === 'edu' ? appState.eduUrl : appState.instaUrl;
    const buttonLabel = type === 'edu' ? '.edu' : '@Insta';
    
    // Create modal backdrop
    const modalBackdrop = document.createElement('div');
    modalBackdrop.className = 'modal-backdrop';
    
    // Create modal container
    const modal = document.createElement('div');
    modal.className = 'url-edit-modal';
    
    // Create header
    const header = document.createElement('h3');
    header.textContent = `Edit ${buttonLabel} Button URL`;
    
    // Create input field
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'url-input';
    input.value = currentUrl;
    input.placeholder = 'Enter URL (include https://)';
    
    // Create buttons container
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'modal-buttons';
    
    // Create save button
    const saveButton = document.createElement('button');
    saveButton.textContent = 'Save';
    saveButton.className = 'action-button';
    saveButton.addEventListener('click', () => {
        // Update URL in app state
        if (type === 'edu') {
            appState.eduUrl = input.value;
        } else {
            appState.instaUrl = input.value;
        }
        
        // Save to store
        saveCustomUrls();
        
        // Remove modal
        document.body.removeChild(modalBackdrop);
    });
    
    // Create cancel button
    const cancelButton = document.createElement('button');
    cancelButton.textContent = 'Cancel';
    cancelButton.className = 'cancel-button';
    cancelButton.addEventListener('click', () => {
        document.body.removeChild(modalBackdrop);
    });
    
    // Assemble modal
    buttonContainer.appendChild(saveButton);
    buttonContainer.appendChild(cancelButton);
    modal.appendChild(header);
    modal.appendChild(input);
    modal.appendChild(buttonContainer);
    modalBackdrop.appendChild(modal);
    
    // Add to body
    document.body.appendChild(modalBackdrop);
    
    // Focus input
    input.focus();
    input.select();
}

// Set up event listeners
function setupEventListeners() {
    // Button left-click handlers - open the current URL
    eduButton.addEventListener('click', (e) => {
        e.preventDefault();
        openLink(appState.eduUrl);
        return false;
    });
    
    instaButton.addEventListener('click', (e) => {
        e.preventDefault();
        openLink(appState.instaUrl);
        return false;
    });
    
    // Button right-click handlers - edit the URL
    eduButton.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        showUrlEditModal('edu');
        return false;
    });
    
    instaButton.addEventListener('contextmenu', (e => {
        e.preventDefault();
        showUrlEditModal('insta');
        return false;
    }));
    
    // Search input handler
    searchInput.addEventListener('input', (e) => filterCIPList(e.target.value));
    
    // Schema modal handlers
    closeButton.addEventListener('click', () => {
        schemaModal.style.display = 'none';
    });
    
    saveSchemaButton.addEventListener('click', saveSchemaConfig);
    
    // Close modal when clicking outside of it
    window.addEventListener('click', (e) => {
        if (e.target === schemaModal) {
            schemaModal.style.display = 'none';
        }
    });
    
    // IPC event listeners
    window.api.onProgramDataSelected((path) => {
        loadJSONFile(path, 'programs');
    });
    
    window.api.onClubDataSelected((path) => {
        loadJSONFile(path, 'clubs');
    });
    
    window.api.onOpenSchemaConfig(() => {
        updateSchemaInputFields();
        schemaModal.style.display = 'block';
    });

    // Add event listener for save complete
    window.api.onSaveComplete((result) => {
        if (result.success) {
            hasUnsavedChanges = false;
            hideSaveButton();
        }
    });

    // Add event listener for errors
    window.api.onError((error) => {
        console.error('Error:', error.message);
    });

    // Add event listener for save-before-close
    window.api.onSaveBeforeClose(async () => {
        try {
            // Make sure appState.programs and appState.clubs are defined
            if (!appState.programs) appState.programs = [];
            if (!appState.clubs) appState.clubs = [];
            
            const data = {
                programs: appState.programs,
                clubs: appState.clubs
            };
            
            // Save the data
            const result = await window.api.saveToFile(data);
            
            // Notify the main process of the result
            window.api.saveBeforeCloseComplete(result.success);
            
            if (result.success) {
                hasUnsavedChanges = false;
                hideSaveButton();
            }
        } catch (error) {
            console.error('Error saving data before close:', error);
            window.api.saveBeforeCloseComplete(false);
        }
    });
}

// Add beforeunload event listener
window.addEventListener('beforeunload', (e) => {
    if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
    }
});

// Function to show the save button
function showSaveButton() {
    if (saveButton) {
        saveButton.style.display = 'block';
        saveButton.style.visibility = 'visible';
    }
}

// Function to hide the save button
function hideSaveButton() {
    if (saveButton) {
        saveButton.style.display = 'none';
    }
}