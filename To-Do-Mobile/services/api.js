import axios from "axios";

const HOST = "http://172.20.10.8:5000";

const api = axios.create({
  baseURL: `${HOST}/api`,
  headers: { "Content-Type": "application/json" },
});


export async function getLists() {
  try {
    const res = await api.get("/lists");
    return res.data;
  } catch (err) {
    console.log(err.response?.data || err.message);
    throw err;
  }
}

export async function getListBySlug(slug) {
  try {
    const res = await api.get(`/lists/${slug}`);
    return res.data;
  } catch (err) {
    console.log(err.response?.data || err.message);
    throw err;
  }
}

export async function deleteListBySlug(slug) {
  try {
    const res = await api.delete(`/lists/${slug}`);
    return res.data;
  } catch (err) {
    console.log(err.response?.data || err.message);
    throw err;
  }
}

export async function createList(name, slug) {
  try {
    const res = await api.post("/lists", { name, slug });
    return res.data;
  } catch (err) {
    console.log(err.response?.data || err.message);
    throw err;
  }
}

export async function getTodo(slug, todoId) {
  try {
    const res = await api.get(`/lists/${slug}/todos/${todoId}`);
    return res.data;
  } catch (err) {
    console.log(err.response?.data || err.message);
    throw err;
  }
}

export async function createTodo(slug, titel, beschreibung, kategorie) {
  try {
    const res = await api.post(`/lists/${slug}/todos`, {
      titel,
      beschreibung,
      kategorie,
    });
    return res.data;
  } catch (err) {
    console.log(err.response?.data || err.message);
    throw err;
  }
}

export async function updateTodo(slug, todoId, titel, beschreibung, kategorie) {
  try {
    const res = await api.put(`/lists/${slug}/todos/${todoId}`, {
      titel,
      beschreibung,
      kategorie,
    });
    return res.data;
  } catch (err) {
    console.log(err.response?.data || err.message);
    throw err;
  }
}

export async function deleteTodo(slug, todoId) {
  try {
    const res = await api.delete(`/lists/${slug}/todos/${todoId}`);
    return res.data;
  } catch (err) {
    console.log(err.response?.data || err.message);
    throw err;
  }
}


export async function login(email, password) {
  try {
    const res = await api.post("/auth/login", { email, password });
    return res.data;
  } catch (err) {
    console.log(err.response?.data || err.message);
    throw err;
  }
}
