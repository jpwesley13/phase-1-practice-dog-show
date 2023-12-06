document.addEventListener('DOMContentLoaded', () => {

})

const urlBar = 'http://127.0.0.1:3000/dogs/';

const fetchDogs = () => {
    fetch(urlBar)
    .then(res => res.json())
    .then(data => {
        tableDog(data);
    })
    .catch(error => console.log(error))
};

const tableBody = document.querySelector('#table-body');
const dogForm = document.querySelector('#dog-form');

const tableDog = (dogs) => {
    dogs.forEach(dog => {
        const rowDog = document.createElement('tr');

        const nameCell = document.createElement('td');
        nameCell.textContent = dog.name;
        const breedCell = document.createElement('td');
        breedCell.textContent = dog.breed;
        const sexCell = document.createElement('td');
        sexCell.textContent = dog.sex;
        const editButton = document.createElement('td');
        //editButton.textContent = 'Edit'; //by making a button element input with a value, I no longer need the text content for the table cell.
        const buttonElement = document.createElement('input');
        buttonElement.type = 'button';
        buttonElement.value = 'Edit Dog';
        editButton.appendChild(buttonElement);

        rowDog.dataset.id = dog.id;
        tableBody.appendChild(rowDog);
        rowDog.appendChild(nameCell);
        rowDog.appendChild(breedCell);
        rowDog.appendChild(sexCell);
        rowDog.appendChild(editButton);
    });

    tableBody.addEventListener('click', function(e) {
        if(e.target.value === 'Edit Dog') {
            console.log('success');
            const dogID = e.target.closest('tr').dataset.id; //e.target.dataset.id doesn't work to populate the top form heredue to the following: The issue is that e.target refers to the element that triggered the event, which may not be the buttonElement itself. It could be one of its parent elements (like the table row). That's why e.target.dataset.id is undefined, and the fetch request fails with a 404 Not Found error. To fix this, you need to traverse up the DOM tree from the clicked element (e.target) until you find the closest table row (tr) and retrieve the dataset.id from there.
            populateFields(dogID);
        };
    });
};

const populateFields = (dogID) => {
    dogForm.dataset.id = dogID;
    const dogUrl = urlBar + dogID;
    fetch(dogUrl)
    .then(res => res.json())
    .then(data => {
        dogForm.elements.name.value = data.name;
        dogForm.elements.breed.value = data.breed;
        dogForm.elements.sex.value = data.sex;
    })
    .catch(error => console.error(error));
};

dogForm.addEventListener('submit', handleSubmit);

function handleSubmit(e) {
    e.preventDefault();
    const newName = dogForm.elements.name.value;
    const newBreed = dogForm.elements.breed.value;
    const newSex = dogForm.elements.sex.value;
    const dogID = dogForm.dataset.id;
    const dogUrl = urlBar + dogID;
    fetch(dogUrl, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: newName,
            breed: newBreed,
            sex: newSex
        })
    })
    .then(res => res.json())
    .then(data => { //all of this is to change the dog information when I press submit. Because I don't ave many dogs, it's ok that I'm rebuilding the entire table from scratch using my innerHTML reset, but it's very inefficient as it goes on.
        console.log('another success!', data);
        dogForm.reset();
        tableBody.innerHTML = '';
        fetchDogs();
    })
    .catch(error => console.error(error))
};

fetchDogs();