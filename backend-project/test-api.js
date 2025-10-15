// Test script to verify API endpoints
import fetch from 'node-fetch';

const baseUrl = 'http://localhost:3001/api';

async function testEndpoints() {
  try {
    console.log('Testing database connection...');
    const dbTest = await fetch(`${baseUrl}/test-db`);
    const dbResult = await dbTest.json();
    console.log('DB Test Result:', dbResult);

    console.log('\nTesting user registration...');
    const registerData = {
      email: 'test@example.com',
      password: 'testpassword123',
      username: 'testuser',
      fullName: 'Test User',
      city: 'Test City'
    };

    const registerResponse = await fetch(`${baseUrl}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(registerData)
    });
    const registerResult = await registerResponse.json();
    console.log('Register Result:', registerResult);

    console.log('\nTesting user login...');
    const loginData = {
      email: 'test@example.com',
      password: 'testpassword123'
    };

    const loginResponse = await fetch(`${baseUrl}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData)
    });
    const loginResult = await loginResponse.json();
    console.log('Login Result:', loginResult);

    console.log('\nTesting get profile...');
    const profileResponse = await fetch(`${baseUrl}/profile?userId=1`);
    const profileResult = await profileResponse.json();
    console.log('Profile Result:', profileResult);

    console.log('\nTesting create post...');
    const postData = {
      content: 'This is a test post from the API!',
      userId: 1
    };

    const postResponse = await fetch(`${baseUrl}/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postData)
    });
    const postResult = await postResponse.json();
    console.log('Post Result:', postResult);

    console.log('\nTesting get posts...');
    const postsResponse = await fetch(`${baseUrl}/posts`);
    const postsResult = await postsResponse.json();
    console.log('Posts Result:', postsResult);

  } catch (error) {
    console.error('Test failed:', error);
  }
}

testEndpoints();