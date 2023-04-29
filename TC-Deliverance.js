// ==UserScript==
// @name         War List - Deliverance
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Places a faction ID input field and lists all attackable members. Updates 1 time a second. Be careful not to overdo your API calls with any other scripts you are using in conjunction with this.
// @match        https://www.torn.com/*
// @author       Auxxfire
// @grant        GM_xmlhttpRequest
// ==/UserScript==

// FACTION API: null
// NOTE: Currently relies on Torn Tools to be installed and the "Notes" button to be visible. I will change this later. Torn makes it hard to identify a good placement due to randomly generated HTML elements.
// NOTE: When clearing browser data all tracked attacks are lost. Future update could add database functionality.
// NOTE: Report bugs to Auxxfire

// NOTE: FIND AND REPLACE YOUR_API_KEY_HERE

(function() {
    'use strict';

    const targetDivClass = 'title___';
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const user2ID = urlParams.get('user2ID');
    const idValue = `${user2ID}-user`;
    const storedValues = JSON.parse(localStorage.getItem(idValue));
    const storedUser2ID = storedValues?.user2ID;
    const storedOutcomeValue = storedValues?.outcomeValue;

    if (storedUser2ID && storedOutcomeValue) {
        if (storedOutcomeValue.includes('lost') || storedOutcomeValue.includes('stalemate')) {
            if (confirm(`Results of last attack on ${user2ID}: ${storedOutcomeValue}\nDo you want to continue?`)) {
                console.log("User confirmed, continuing...");
            } else {
                console.log("User cancelled, stopping...");
                history.back();
                return;
            }
        }
    }

    function findTargetDiv() {
        const divs = document.querySelectorAll(`div[class*="${targetDivClass}"]`);
        if (divs.length > 0) {
            const targetDiv = divs[0];
            const outcomeValue = targetDiv.textContent.trim();
            console.log(`Target div text value found: ${outcomeValue}`);

            if (outcomeValue.includes('lost') || outcomeValue.includes('defeated') || outcomeValue.includes('stalemate')) {
                localStorage.setItem(idValue, JSON.stringify({ user2ID, outcomeValue }));
                console.log(`Updated text value for user2ID ${user2ID}: ${outcomeValue}`);
                clearInterval(intervalId);
            }
        } else {
            console.log('');
        }
    }

    const intervalId = setInterval(findTargetDiv, 1000);
})();

(function() {
    'use strict';

    let intervalId = setInterval(function() {
        const links = document.querySelectorAll('a[rel="noopener noreferrer"]');
        if (links.length === 0) {
            console.log('No links with rel="noopener noreferrer" found on the page.');
            return;
        }

        console.log('Links with rel="noopener noreferrer" found on the page:');
        let foundUserLinks = false;
        links.forEach(link => {
            const id = link.getAttribute('id');
            if (id && id.toLowerCase().includes('user')) {
                const storedValue = localStorage.getItem(id);
                if (storedValue) {
                    console.log('ID found in local storage: ' + id);
                    const parsedValue = JSON.parse(storedValue);
                    const outcomeValue = parsedValue.outcomeValue;
                    const iconCell = link.closest('li').querySelector('.table-cell.member-icons.icons');
                    if (iconCell) {
                        if (outcomeValue.toLowerCase().includes("lost")) {
                            clearInterval(intervalId);
                            const newDiv = document.createElement('div');
                            // create a new image element
                            const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="red" class="bi bi-emoji-dizzy" viewBox="0 0 16 16">
        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
        <path d="M9.146 5.146a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .708.708l-.647.646.647.646a.5.5 0 0 1-.708.708l-.646-.647-.646.647a.5.5 0 1 1-.708-.708l.647-.646-.647-.646a.5.5 0 0 1 0-.708zm-5 0a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 1 1 .708.708l-.647.646.647.646a.5.5 0 1 1-.708.708L5.5 7.207l-.646.647a.5.5 0 1 1-.708-.708l.647-.646-.647-.646a.5.5 0 0 1 0-.708zM10 11a2 2 0 1 1-4 0 2 2 0 0 1 4 0z"/>
    </svg>
`;
                            newDiv.innerHTML = svg;
                            newDiv.style.display = 'inline-block';
                            newDiv.style.marginTop = '10px';
                            newDiv.style.marginLeft = '5px';

                            iconCell.insertAdjacentElement('beforebegin', newDiv); } else {
                                const newDiv = document.createElement('div');
                                // create a new image element
                                const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="green" class="bi bi-emoji-dizzy" viewBox="0 0 16 16">
        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
        <path d="M9.146 5.146a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .708.708l-.647.646.647.646a.5.5 0 0 1-.708.708l-.646-.647-.646.647a.5.5 0 1 1-.708-.708l.647-.646-.647-.646a.5.5 0 0 1 0-.708zm-5 0a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 1 1 .708.708l-.647.646.647.646a.5.5 0 1 1-.708.708L5.5 7.207l-.646.647a.5.5 0 1 1-.708-.708l.647-.646-.647-.646a.5.5 0 0 1 0-.708zM10 11a2 2 0 1 1-4 0 2 2 0 0 1 4 0z"/>
    </svg>
`;
        newDiv.innerHTML = svg;
        newDiv.style.display = 'inline-block';
        newDiv.style.marginTop = '10px';
        newDiv.style.marginLeft = '5px';

        iconCell.insertAdjacentElement('beforebegin', newDiv);
    }
                    }
                } else {
                    console.log('ID: ' + id);
                }
                foundUserLinks = true;
            }
        });

        if (foundUserLinks && intervalId) {
            clearInterval(intervalId);
        }
    }, 500);
})();

(function() {
    'use strict';

    console.log('Script started');
    let makeCalls = localStorage.getItem('makeCalls') === 'true'; // check if makeCalls is stored in localStorage
    const targetButton = document.querySelector('.title > .text');

    if (!targetButton) {
        console.error('Target button not found');
        return;
    }

    const cloneButton = targetButton.parentElement.cloneNode(true);

    cloneButton.querySelector('.text').textContent = 'War List';

    targetButton.parentElement.parentElement.appendChild(cloneButton);

    const factionIDInput = document.createElement('input');
    factionIDInput.type = 'text';
    factionIDInput.placeholder = 'Enter Faction ID';
    factionIDInput.style.marginTop = '5px';
    factionIDInput.style.marginLeft = '5px';
    factionIDInput.style.borderRadius = '5px'; // add rounded corners
    factionIDInput.style.border = 'none'; // remove input border
    factionIDInput.style.padding = '5px'; // add padding
    factionIDInput.style.backgroundColor = '#f2f2f2'; // set input background color
    factionIDInput.style.width = '150px'; // set input width
    cloneButton.parentElement.insertBefore(factionIDInput, cloneButton.nextSibling);

    // Get the memberList element and add styles to it
    const memberList = document.createElement('ul');
    memberList.style.marginTop = '10px';
    memberList.style.marginBottom = '10px';
    memberList.style.backgroundColor = '#e6f2ff'; // add light blue background
    memberList.style.padding = '10px'; // add padding
    memberList.style.borderRadius = '5px'; // add rounded corners
    // memberList.style.fontSize = '8px'; // decrease font size
    cloneButton.parentElement.insertBefore(memberList, factionIDInput.nextSibling);

    // Create a div container for the label and list
    const hospContainer = document.createElement('div');
    hospContainer.style.textAlign = 'center';

    // Create a label element for the list
    const hospLabel = document.createElement('label');
    hospLabel.textContent = 'Less than 90s';
    hospLabel.style.fontSize = '1rem';
    hospLabel.style.color = 'red';
    hospLabel.style.marginTop = '10px';

    // Get the memberList element and add styles to it
    const hospList = document.createElement('ul');
    hospList.style.marginTop = '10px';
    hospList.style.backgroundColor = '#e6f2ff'; // add light blue background
    hospList.style.padding = '10px'; // add padding
    hospList.style.borderRadius = '5px'; // add rounded corners

    // Insert the label and the list into the container
    hospContainer.appendChild(hospLabel);
    hospContainer.appendChild(hospList);

    // Insert the container into the DOM
    cloneButton.parentElement.insertBefore(hospContainer, factionIDInput.nextSibling);


    // Create the button element and add styles to it
    const button = document.createElement('button');
    button.textContent = 'Start';
    button.style.marginTop = '10px';
    button.style.padding = '5px 74px';
    button.style.backgroundColor = '#4CAF50';
    button.style.border = 'none';
    button.style.color = 'white';
    button.style.borderRadius = '5px';
    button.style.cursor = 'pointer';

    // Add event listeners to the button
    button.addEventListener('click', startAPICalls);

    // Append the button to the document body
    cloneButton.parentElement.insertBefore(button, factionIDInput.nextSibling);

    // Create the button element to stop API calls
    const stopButton = document.createElement('button');
    stopButton.textContent = 'Stop';
    stopButton.style.marginTop = '10px';
    stopButton.style.padding = '5px 74px';
    stopButton.style.backgroundColor = '#dc3545';
    stopButton.style.border = 'none';
    stopButton.style.color = 'white';
    stopButton.style.borderRadius = '5px';
    stopButton.style.cursor = 'pointer';
    stopButton.style.display = "none";
    stopButton.style.marginBottom = '10px';

    // Add event listeners to the stop button
    stopButton.addEventListener('click', stopAPICalls);

    // Append the stop button to the document body
    cloneButton.parentElement.insertBefore(stopButton, factionIDInput.nextSibling);

    // Check cookie for uid
    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }

    function startAPICalls() {
        // Get the current user ID from the cookie
        const uid = parseInt(getCookie('uid'));
        console.log(uid);

        // Fetch faction data from Torn API
        fetch('https://api.torn.com/faction/10850?selections=basic&key=YOUR_API_KEY_HERE')
            .then(response => response.json())
            .then(data => {
            // Get the list of allowed user IDs from the faction data
            // console.log('Request created for allowed IDs. Awaiting response.');
            const allowedIDs = Object.keys(data.members).map(id => parseInt(id));
            let isAllowed = false;

            // Loop through each index of allowedIDs to check if uid is there
            for (let i = 0; i < allowedIDs.length; i++) {
                if (uid === allowedIDs[i]) {
                    isAllowed = true;
                    break;
                }
            }

            // Check if the current user ID is in the list of allowed IDs
            if (isAllowed) {
                localStorage.setItem('makeCalls', 'true'); // store makeCalls in localStorage
                makeCalls = true;
                button.style.display = "none";
                stopButton.style.display = "block";
            } else {
                alert('You are not allowed to use this script.');
            }
        })
            .catch(error => console.error(error));
    }


    // Function to stop API calls
    function stopAPICalls() {
        memberList.innerHTML = '';
        hospList.innerHTML = '';
        console.log('Requests closed.');
        makeCalls = false;
        localStorage.setItem('makeCalls', 'false');
        button.style.display = "block";
        stopButton.style.display = "none";
    }

    // Get the faction ID from local storage if it exists
    const storedFactionID = localStorage.getItem('factionID');
    if (storedFactionID) {
        factionIDInput.value = storedFactionID;
    }

    // Function to fetch member data
    function fetchMemberData() {
        // Get the faction ID from the input box
        const factionID = factionIDInput.value;
        // Save button to local storage
        makeCalls = localStorage.getItem('makeCalls');
        if (makeCalls) {
            button.style.display = "none";
            stopButton.style.display = "block";
        } else {
            button.style.display = "block";
            stopButton.style.display = "none";
        }
        // Save the faction ID to local storage
        localStorage.setItem('factionID', factionID);

        const now = Date.now();
        const nowTimestamp = Math.floor(new Date(now).getTime() / 1000);
        // Make the API request for the faction data
        // console.log('Creating request. Awaiting response');
        GM_xmlhttpRequest({
            method: 'GET',
            url: `https://api.torn.com/faction/${factionID}?selections=basic&key=YOUR_API_KEY_HERE`,
            onload: function(response) {
                // Parse the JSON response
                // console.log('Response recieved. Parsing data.');
                const factionData = JSON.parse(response.responseText);
                const members = factionData.members;

                // Clear the existing member list
                memberList.innerHTML = '';
                hospList.innerHTML = '';

                // Loop through each member and extract their data
                for (const memberID in members) {
                    const memberData = members[memberID];

                    if (memberData.status.state === 'Hospital') {
                        const until = memberData.status.until;
                        // Get the current timestamp in milliseconds

                        // Create an li element to hold the member data
                        const li = document.createElement('li');

                        // Create a span element to hold the member username
                        const hospSpan = document.createElement('span');
                        hospSpan.textContent = memberData.name;
                        hospSpan.style.color = 'black';
                        hospSpan.style.display = 'inline-block';
                        hospSpan.style.marginRight = '10px';
                        hospSpan.style.padding = '2px 2px';

                        const timeDiff = until - nowTimestamp
                        // console.log(timeDiff);

                        if (timeDiff < 90 && timeDiff > 0) {
                            // Append the hospSpan to the li element
                            li.appendChild(hospSpan);
                        }
                        // Append the li element to the hospList element
                        hospList.appendChild(li);
                        continue; // Move continue statement here
                    }

                    // Check if the member status is okay
                    if (memberData.status.state !== 'Okay') {
                        // console.log(`Found ${(memberID)} okay.`);
                        continue;
                    }

                    // Create an li element to hold the member data
                    const li = document.createElement('li');

                    // Create a span element to hold the member username
                    const usernameSpan = document.createElement('span');
                    usernameSpan.textContent = memberData.name;
                    usernameSpan.style.color = 'black'; // Make the member name black
                    usernameSpan.style.display = 'inline-block'; // display the span as an inline block
                    usernameSpan.style.marginRight = '10px'; // add some margin to create space
                    usernameSpan.style.padding = '2px 2px';

                    // Create a button element to attack the member
                    const attackButton = document.createElement('button');
                    attackButton.textContent = 'Attack';
                    const attackURL = `https://www.torn.com/loader.php?sid=attack&user2ID=${memberID}`;
                    attackButton.addEventListener('click', function() {
                        window.open(attackURL, '_blank');
                    });
                    attackButton.style.backgroundColor = '#dc3545'; // change the background color to a darker red
                    attackButton.style.color = '#fff'; // set text color to white
                    attackButton.style.border = 'none'; // remove border
                    usernameSpan.style.display = 'inline-block'; // display the span as an inline block
                    attackButton.style.borderRadius = '4px'; // add slightly rounded corners
                    attackButton.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.2)'; // add a subtle shadow
                    attackButton.style.cursor = 'pointer'; // change the cursor to a pointer on hover
                    attackButton.style.padding = '2px 8px'; // add padding
                    attackButton.style.fontSize = '10px'; // decrease font size
                    attackButton.style.float = 'right'; // align button to the right



                    // Add the username span and attack button to the li element
                    li.appendChild(usernameSpan);
                    li.appendChild(attackButton);

                    // Add the li element to the member list
                    memberList.appendChild(li);
                }
            }
        });
    }
    // Set interval to fetch member data every 2 seconds
    setInterval(function() {
        if (makeCalls) {
            fetchMemberData();
        }
    }, 1000);

})();
