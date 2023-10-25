.input-group {
    margin-bottom: 15px;
}

.input-group label {
    display: inline-block;
    width: 200px;
}
.flex-container {
    display: flex;
    justify-content: space-between;
}
.padded-input {
    margin-left: 1em;   /*Add space to the left */
    margin-right: 1em;  /* Add space to the right */
}
.full-height {
    height: calc(100vh - 200px); /* Adjust 200px based on your header and other elements */
    width: 100%;
}

.input-group {
    display: flex;
    align-items: center;
    width: 100%;
}

.input-group #systemMessage_0, 
.input-group [id^='systemMessage_'] {
    width: 800px; /* 4x width */
}

label[for='task'] {
    margin-right: 10px; /* Optional: Adds some spacing between the label and the input box */
}

#task {
    flex-grow: 1; /* Makes the input box grow to take up the remaining space */
    width: 100%; /* Ensures the input box starts at full width */
}
.add-button, .remove-button {
    border: none;
    color: white;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    margin: 2px 1px;
    cursor: pointer;
    border-radius: 6px; /* Adjusted from 12px to 6px */
}

.add-button {
    background-color: #008CBA; /* Blue background */
    padding: 5px 12px; /* Adjusted from 10px 24px to 5px 12px */
    font-size: 16px;   /* Adjusted from 16px to 8px */
}

.remove-button {
    background-color: #f44336; /* Red background */
    padding: 5px 12px; /* Adjusted from 10px 24px to 5px 12px */
    font-size: 16px;   /* Adjusted from 16px to 8px */
}

