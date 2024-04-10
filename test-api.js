const axios = require('axios');


async function testTask1() {
    try {
        const response = await axios.get('http://localhost:4000/');
        console.log('Task 1 Response:', response.data);
        
        testTask2();
    } catch (error) {
        console.error('Error testing Task 1:', error.message);
    }
}


async function testTask2() {
    try {
        const requestBody = {
            fromCurrency: 'bitcoin',
            toCurrency: 'basic-attention-token',
            date: '12-01-2023',
        };

        console.log('Task 2 Request Body:', requestBody); 
        const response = await axios.post('http://localhost:4000/simple/prices', requestBody);
        console.log('Task 2 Response:', response.data);
   
        testTask3();
    } catch (error) {
        console.error('Error testing Task 2:', error.message);
    }
}


async function testTask3() {
    try {
        const response = await axios.get('http://localhost:4000/companies?currency=bitcoin');
        console.log('Task 3 Response:', response.data);
    } catch (error) {
        console.error('Error testing Task 3:', error.message);
    }
}

testTask1();
