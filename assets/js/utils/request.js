async function post(url, data) {
  try {
    const response = await fetch(url, {
      method: 'POST',
      mode: 'cors',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${window.localStorage.getItem('token')}`
      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
      body: JSON.stringify(data)
    });
    return await response.json();
  } catch (e) {
    throw new Error(e.message);
  }
}

async function postFormData(url, data) {
  try {
    const response = await fetch(url, {
      method: 'POST',
      mode: 'cors',
      credentials: 'same-origin',
      headers: {
        Authorization: `Bearer ${window.localStorage.getItem('token')}`
      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
      body: data
    });
    return await response.json();
  } catch (e) {
    throw new Error(e.message);
  }
}

async function update(url, data) {
  try {
    const response = await fetch(url, {
      method: 'PATCH',
      mode: 'cors',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${window.localStorage.getItem('token')}`
      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
      body: JSON.stringify(data)
    });
    return await response.json();
  } catch (e) {
    throw new Error(e.message);
  }
}

async function deleteData(url) {
  try {
    const response = await fetch(url, {
      method: 'DELETE',
      mode: 'cors',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${window.localStorage.getItem('token')}`
      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer'
    });
    return await response.json();
  } catch (e) {
    throw new Error(e.message);
  }
}

async function get(url) {
  try {
    const response = await fetch(url, {
      method: 'GET',
      mode: 'cors',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${window.localStorage.getItem('token')}`
      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer'
    });
    return await response.json();
  } catch (e) {
    throw new Error(e.message);
  }
}

export { post, get, postFormData, deleteData, update };
